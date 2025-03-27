import { useState, useEffect, useCallback, useRef } from 'react';
import { virtualRoomStreamService } from '../services/virtualRoomStreamService';
import { socketService } from '../services/socketService';

/**
 * Hook for managing virtual room livestreams
 */
export const useVirtualRoomStream = (roomId, streamId = null) => {
  const [isStreamer, setIsStreamer] = useState(false);
  const [stream, setStream] = useState(null);
  const [activeStreams, setActiveStreams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  
  // WebRTC connection state
  const peerConnectionRef = useRef(null);
  const streamRef = useRef(null);
  
  // Load active streams data for a room
  useEffect(() => {
    if (!roomId) return;
    
    const fetchRoomStreams = async () => {
      try {
        setIsLoading(true);
        
        const response = await virtualRoomStreamService.getRoomLivestreams(roomId);
        
        if (response.success) {
          setActiveStreams(response.data);
          
          // If we're looking for a specific streamId, set that stream
          if (streamId && response.data.some(s => s.id === streamId)) {
            const foundStream = response.data.find(s => s.id === streamId);
            setStream(foundStream);
            
            // Check if user is the streamer
            const userId = socketService.getUserId();
            if (userId && foundStream.streamerId === userId) {
              setIsStreamer(true);
            }
            
            // Set states based on stream data
            setViewerCount(foundStream.viewerCount);
            setIsLive(foundStream.status === 'live');
          }
        } else {
          console.error('Error loading streams:', response.message);
        }
      } catch (err) {
        console.error('Error fetching room streams:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomStreams();
    
    // Set up socket listener for new streams in this room
    socketService.on('livestream_preparing', (data) => {
      if (data.stream.roomId === roomId) {
        setActiveStreams(prev => {
          // Add to list if not already there
          const exists = prev.some(s => s.id === data.stream.id);
          if (!exists) {
            return [...prev, data.stream];
          }
          return prev;
        });
      }
    });
    
    return () => {
      socketService.off('livestream_preparing');
    };
  }, [roomId, streamId]);
  
  // Start a new livestream
  const startLivestream = useCallback(async (streamData = {}) => {
    if (!roomId) return { success: false, message: 'Room ID is required' };
    
    try {
      const response = await virtualRoomStreamService.startLivestream(roomId, streamData);
      
      if (response.success) {
        setStream(response.data);
        setIsStreamer(true);
        
        // Pre-setup WebRTC as streamer
        await setupLocalStream();
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred while starting livestream';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [roomId]);
  
  // Go live - transition from waiting to live
  const goLive = useCallback(async () => {
    if (!stream || !isStreamer) return { success: false, message: 'Not authorized to go live' };
    
    try {
      const response = await virtualRoomStreamService.goLive(stream.id);
      
      if (response.success) {
        setIsLive(true);
        setStream(response.data);
        
        // Start WebRTC broadcast
        await startBroadcast();
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred while going live';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [stream, isStreamer]);
  
  // End livestream
  const endLivestream = useCallback(async () => {
    if (!stream) return { success: false, message: 'No active stream' };
    
    try {
      const response = await virtualRoomStreamService.endLivestream(stream.id);
      
      if (response.success) {
        setIsLive(false);
        
        // Clean up WebRTC
        cleanupWebRTC();
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred while ending livestream';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [stream]);
  
  // Join a livestream as a viewer
  const joinLivestream = useCallback(async (selectedStreamId = null) => {
    const streamToJoin = selectedStreamId || (stream ? stream.id : null);
    
    if (!streamToJoin) return { success: false, message: 'No stream to join' };
    
    try {
      const response = await virtualRoomStreamService.joinLivestream(streamToJoin);
      
      if (response.success) {
        setIsJoined(true);
        
        // Setup WebRTC as viewer
        await setupViewerConnection(response.data.rtcSessionId);
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred while joining livestream';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [stream]);
  
  // Leave a livestream
  const leaveLivestream = useCallback(async () => {
    if (!stream || !isJoined) return { success: true };
    
    try {
      const response = await virtualRoomStreamService.leaveLivestream(stream.id);
      
      if (response.success) {
        setIsJoined(false);
        
        // Clean up WebRTC
        cleanupWebRTC();
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred while leaving livestream';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [stream, isJoined]);
  
  // Setup local stream for broadcasting
  const setupLocalStream = useCallback(async () => {
    try {
      // Get user media
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(mediaStream);
      streamRef.current = mediaStream;
      
      return mediaStream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Could not access camera and microphone');
      throw err;
    }
  }, []);
  
  // Start broadcasting
  const startBroadcast = useCallback(async () => {
    if (!localStream && !streamRef.current) {
      try {
        await setupLocalStream();
      } catch (err) {
        return false;
      }
    }
    
    const stream = localStream || streamRef.current;
    if (!stream) return false;
    
    // Set up WebRTC peer connection
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    
    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });
    
    // Set up event listeners
    const cleanup = virtualRoomStreamService.setupStreamEventListeners(stream.id, {
      onSignalingMessage: async (data) => {
        if (data.type === 'answer') {
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
          } catch (e) {
            console.error('Error setting remote description:', e);
          }
        }
      },
      onIceCandidate: async (data) => {
        try {
          if (data.viewerId && data.candidate) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      },
      onViewerJoined: (data) => {
        console.log('Viewer joined:', data);
        setViewerCount(prev => prev + 1);
      },
      onViewerLeft: (data) => {
        console.log('Viewer left:', data);
        setViewerCount(prev => prev - 1);
      }
    });
    
    // Handle ICE candidates
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await virtualRoomStreamService.sendRTCSignal(stream.id, {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };
    
    // Create and send offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      await virtualRoomStreamService.sendRTCSignal(stream.id, {
        type: 'offer',
        sdp: peerConnection.localDescription
      });
      
      peerConnectionRef.current = peerConnection;
      return true;
    } catch (err) {
      console.error('Error creating offer:', err);
      return false;
    }
  }, [localStream]);
  
  // Setup viewer connection
  const setupViewerConnection = useCallback(async (rtcSessionId) => {
    // Create peer connection
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    
    // Create a stream to receive tracks
    const inboundStream = new MediaStream();
    setRemoteStream(inboundStream);
    
    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        inboundStream.addTrack(track);
      });
    };
    
    // Set up event listeners
    const cleanup = virtualRoomStreamService.setupStreamEventListeners(streamId, {
      onSignalingMessage: async (data) => {
        if (data.type === 'offer' && data.streamerId) {
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
            
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            
            await virtualRoomStreamService.sendRTCSignal(streamId, {
              type: 'answer',
              sdp: peerConnection.localDescription
            });
          } catch (e) {
            console.error('Error handling offer:', e);
          }
        }
      },
      onIceCandidate: async (data) => {
        try {
          if (data.streamerId && data.candidate) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      },
      onStreamEnded: () => {
        setIsLive(false);
        setIsJoined(false);
        cleanupWebRTC();
      }
    });
    
    // Handle ICE candidates
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await virtualRoomStreamService.sendRTCSignal(streamId, {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };
    
    peerConnectionRef.current = peerConnection;
    return inboundStream;
  }, [streamId]);
  
  // Clean up WebRTC connections
  const cleanupWebRTC = useCallback(() => {
    // Stop all tracks in local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Clear remote stream
    setRemoteStream(null);
  }, [localStream]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      cleanupWebRTC();
    };
  }, [cleanupWebRTC]);
  
  return {
    // Stream data
    stream,
    activeStreams,
    isStreamer,
    isLive,
    isJoined,
    viewerCount,
    isLoading,
    error,
    
    // Media streams
    localStream,
    remoteStream,
    
    // Actions
    startLivestream,
    goLive,
    endLivestream,
    joinLivestream,
    leaveLivestream,
    
    // WebRTC utilities
    setupLocalStream,
    cleanupWebRTC
  };
};

export default useVirtualRoomStream;