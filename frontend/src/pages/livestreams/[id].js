import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { liveStreamService } from '@/api/liveStreamApi';
import { webrtcService } from '@/services/webrtcService';
import { socketService } from '@/services/socketService';
import { paymentService } from '@/services/paymentService';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function LiveStreamPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useContext(UserContext);

  // מצבי קומפוננטה
  const [liveStream, setLiveStream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // מצבי זרימה ו-WebRTC
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  // מצבי טיפים
  const [tipAmount, setTipAmount] = useState(5);
  const [tipMessage, setTipMessage] = useState('');

  // הפניות לאלמנטים
  const chatContainerRef = useRef(null);
  const videoRef = useRef(null);

  // הגדרת חיבור WebRTC
  const setupWebRTC = async () => {
    try {
      const peerConfig = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      const { success, peerConnection: pc } = await webrtcService.createPeerConnection(peerConfig);
      
      if (success) {
        setPeerConnection(pc);
        
        // הוספת מאזין לערוצי מדיה מרוחקים
        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };
      }
    } catch (err) {
      console.error('WebRTC setup error:', err);
      setError('Failed to setup WebRTC connection');
    }
  };

  // טעינת שידור חי
  useEffect(() => {
    const fetchLiveStream = async () => {
      if (!id || !isAuthenticated) return;

      try {
        setIsLoading(true);
        const response = await liveStreamService.getLiveStreamById(id);
        
        if (response.success) {
          setLiveStream(response.data);
          
          // הכנת WebRTC
          await setupWebRTC();
        } else {
          setError('Failed to load live stream');
        }
      } catch (err) {
        console.error('Error fetching live stream:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveStream();
  }, [id, isAuthenticated]);

  // הגדרת Socket
  useEffect(() => {
    if (!liveStream) return;

    // התחברות לשרת Socket
    const socket = socketService.connect(process.env.NEXT_PUBLIC_SOCKET_URL, {
      query: { 
        userId: user?.id,
        liveStreamId: id 
      }
    });

    // מאזינים לאירועי צ׳אט
    socketService.on('livestream_chat_message', (message) => {
      setChatMessages(prev => [...prev, message]);
      
      // גלילה אוטומטית לתחתית הצ׳אט
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    });

    // מאזינים לאירועי WebRTC
    socketService.on('livestream_webrtc_offer', async (offer) => {
      if (peerConnection) {
        await webrtcService.createAnswer(peerConnection, offer);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [liveStream, user, id, peerConnection]);

  // טעינת זרם מדיה מקומי
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setLocalStream(stream);
        
        // הוספת זרם מדיה מקומי לחיבור WebRTC
        if (peerConnection && stream) {
          await webrtcService.addMediaStream(peerConnection, stream);
          
          // עדכון אלמנט הווידאו
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    if (liveStream) {
      getLocalStream();
    }
  }, [liveStream, peerConnection]);

  // שליחת הודעת צ׳אט
  const sendChatMessage = () => {
    if (!newMessage.trim()) return;

    socketService.emit('send_livestream_chat', {
      streamId: id,
      userId: user.id,
      message: newMessage,
      username: user.username
    });

    setNewMessage('');
  };

  // שליחת טיפ
  const sendTip = async () => {
    try {
      const response = await paymentService.sendTip(
        liveStream.creatorId, 
        tipAmount, 
        tipMessage
      );

      if (response.success) {
        // שידור הודעת טיפ בצ׳אט
        socketService.emit('send_livestream_chat', {
          streamId: id,
          userId: user.id,
          message: `שלח טיפ של $${tipAmount} ${tipMessage ? `עם ההודעה: ${tipMessage}` : ''}`,
          username: user.username,
          type: 'tip'
        });

        // איפוס טופס טיפ
        setTipAmount(5);
        setTipMessage('');
      }
    } catch (err) {
      console.error('Error sending tip:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>טוען שידור חי...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push('/livestreams')}>חזרה לשידורים חיים</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* תצוגת וידאו */}
        <div className="md:col-span-2 bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* סרגל צד - צ׳אט */}
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">צ׳אט חי</h2>
          
          {/* אזור הודעות */}
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2"
          >
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg ${
                  msg.type === 'tip' 
                    ? 'bg-yellow-600 bg-opacity-20' 
                    : 'bg-gray-700'
                }`}
              >
                <strong>{msg.username}: </strong>
                {msg.message}
              </div>
            ))}
          </div>

          {/* טופס הודעה */}
          <div className="mt-auto">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="כתוב הודעה..."
              className="w-full p-2 rounded bg-gray-700 text-white"
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <Button 
              onClick={sendChatMessage}
              className="w-full mt-2"
            >
              שלח
            </Button>
          </div>
        </div>

        {/* מידע על השידור */}
        <div className="md:col-span-2 bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{liveStream.title}</h1>
            <div className="flex items-center space-x-2">
              {/* אינדיקטור שידור חי */}
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>שידור חי</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <Image 
              src={`${process.env.NEXT_PUBLIC_API_URL}${liveStream.creator.profileImage}`}
              alt={liveStream.creator.username}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{liveStream.creator.username}</p>
              <p className="text-sm text-gray-400">{liveStream.description}</p>
            </div>
          </div>

          {/* טופס טיפים */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">שלח טיפ</h3>
            <div className="flex space-x-2 mb-3">
              {[5, 10, 20].map((amount) => (
                <Button
                  key={amount}
                  variant={tipAmount === amount ? 'primary' : 'secondary'}
                  onClick={() => setTipAmount(amount)}
                  className="flex-1"
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <input 
              type="text"
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
              placeholder="הודעה עם הטיפ (אופציונלי)"
              className="w-full p-2 rounded bg-gray-600 text-white mb-3"
            />
            <Button 
              onClick={sendTip}
              className="w-full"
            >
              שלח טיפ ${tipAmount}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}