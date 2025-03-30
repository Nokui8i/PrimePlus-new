import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { messageService, useMessageService } from '@/services/messageService';
import { userService } from '@/services/api';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import ConversationItem from '@/components/messages/ConversationItem';
import MessageItem from '@/components/messages/MessageItem';
import MessageInput from '@/components/messages/MessageInput';
import Image from 'next/image';

export default function ConversationPage() {
  const router = useRouter();
  const { userId } = router.query;
  const { user, isAuthenticated, loading } = useContext(UserContext);
  
  const [otherUser, setOtherUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  
  // הוספת שימוש בשירות המסרים בזמן אמת
  const { isConnected, newMessages, sendMessageSocket, markAsReadSocket } = useMessageService();
  
  const messagesEndRef = useRef(null);
  
  // Polling interval for new messages (in ms)
  const POLLING_INTERVAL = 10000;
  
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!userId) return;
    
    const fetchUserProfile = async () => {
      try {
        setIsLoadingUser(true);
        // For a real implementation, get the user profile
        // For now, we'll mock it since we don't have the API endpoint yet
        
        // const response = await userService.getUserProfile(userId as string);
        // if (response.success) {
        //   setOtherUser(response.data);
        // }
        
        // Mock data for demonstration
        setOtherUser({
          id: userId,
          username: 'user' + userId,
          fullName: 'User ' + userId,
          profileImage: null
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const response = await messageService.getConversation(userId as string);
        
        if (response.success) {
          setMessages(response.data);
          
          // Mark all messages as read
          const unreadMessageIds = response.data
            .filter(msg => !msg.isRead && msg.senderId === userId)
            .map(msg => msg.id);
            
          if (unreadMessageIds.length > 0) {
            await messageService.markAsRead(unreadMessageIds);
            // גם סימון דרך Socket.IO
            markAsReadSocket(unreadMessageIds);
          }
        } else {
          setError(response.message || 'Failed to load messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('An error occurred while fetching messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };
    
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const response = await messageService.getConversations();
        
        if (response.success) {
          setConversations(response.data);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    
    if (isAuthenticated) {
      fetchUserProfile();
      fetchMessages();
      fetchConversations();
      
      // Set up polling for new messages if Socket.IO isn't connected
      let intervalId: any;
      if (!isConnected) {
        intervalId = setInterval(fetchMessages, POLLING_INTERVAL);
      }
      
      // Cleanup on unmount
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [isAuthenticated, loading, router, userId, isConnected, markAsReadSocket]);
  
  // האזנה להודעות חדשות
  useEffect(() => {
    if (newMessages.length > 0 && userId) {
      // סינון רק הודעות שרלוונטיות לשיחה הנוכחית
      const relevantMessages = newMessages.filter(
        msg => msg.senderId === userId || msg.receiverId === userId
      );
      
      if (relevantMessages.length > 0) {
        // הוספת ההודעות החדשות למצב
        setMessages(prevMessages => {
          // סינון הודעות כפולות לפי מזהה
          const messageIds = new Set(prevMessages.map(m => m.id));
          const filteredNew = relevantMessages.filter(m => !messageIds.has(m.id));
          
          return [...prevMessages, ...filteredNew];
        });
        
        // סימון ההודעות החדשות כנקראו
        const unreadMessageIds = relevantMessages
          .filter(msg => !msg.isRead && msg.senderId === userId)
          .map(msg => msg.id);
          
        if (unreadMessageIds.length > 0) {
          messageService.markAsRead(unreadMessageIds);
          markAsReadSocket(unreadMessageIds);
        }
      }
    }
  }, [newMessages, userId, markAsReadSocket]);
  
  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (content, attachment) => {
    if (!content.trim() && !attachment) return;
    
    try {
      setIsSending(true);
      
      let response;
      
      // נסה לשלוח הודעה דרך Socket.IO אם מחובר
      if (isConnected) {
        try {
          response = await sendMessageSocket(userId as string, content);
        } catch (socketError) {
          console.warn('Socket send failed, falling back to API', socketError);
          response = await messageService.sendMessage(userId as string, content, attachment);
        }
      } else {
        // שליחה רגילה דרך ה-API
        response = await messageService.sendMessage(userId as string, content, attachment);
      }
      
      if (response.success) {
        // Add the new message to the list
        setMessages(prevMessages => [
          ...prevMessages,
          {
            ...response.data,
            sender: {
              id: user.id,
              username: user.username,
              fullName: user.fullName,
              profileImage: user.profileImage
            }
          }
        ]);
        
        // Refresh conversations list to update preview
        const conversationsResponse = await messageService.getConversations();
        if (conversationsResponse.success) {
          setConversations(conversationsResponse.data);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
  const handleDeleteMessage = (messageId) => {
    // Remove the message from the list
    setMessages(prevMessages => 
      prevMessages.filter(msg => msg.id !== messageId)
    );
  };
  
  if (loading || isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading conversation...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/messages">
          <Button variant="outline" size="sm">
            ← Back to Messages
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar - conversation list */}
        <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center">
            <h2 className="font-medium">Recent Conversations</h2>
            <Link href="/messages/new">
              <Button size="sm">New</Button>
            </Link>
          </div>
          
          <div className="overflow-y-auto max-h-[60vh]">
            {isLoadingConversations ? (
              <div className="p-4 text-center text-gray-500">
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conversation) => (
                  <ConversationItem 
                    key={conversation.otherUser.id} 
                    conversation={conversation} 
                    isActive={conversation.otherUser.id === userId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right side - message thread */}
        <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden flex flex-col h-[70vh]">
          {/* Conversation header */}
          {otherUser && (
            <div className="p-4 border-b flex items-center">
              <div className="mr-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 relative">
                  {otherUser.profileImage ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${otherUser.profileImage}`}
                      alt={otherUser.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <span className="text-blue-600 text-sm font-medium">
                        {otherUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="font-medium text-gray-900">
                  {otherUser.fullName || otherUser.username}
                </h2>
                <p className="text-xs text-gray-500">
                  @{otherUser.username}
                </p>
              </div>
              
              {/* סטטוס חיבור */}
              {isConnected ? (
                <div className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Live
                </div>
              ) : null}
            </div>
          )}
          
          {/* Messages container */}
          <div className="flex-grow p-4 overflow-y-auto">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-center">
                <svg className="h-12 w-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <div>
                {messages.map((message) => (
                  <MessageItem 
                    key={message.id} 
                    message={message} 
                    onDelete={handleDeleteMessage}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message input */}
          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={isSending}
            placeholder={`Message ${otherUser ? otherUser.fullName || otherUser.username : ''}...`}
          />
        </div>
      </div>
    </div>
  );
}