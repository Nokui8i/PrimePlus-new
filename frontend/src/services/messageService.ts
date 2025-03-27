import { useState, useEffect, useCallback } from 'react';
import api from './api';
import socketService from './socketService';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

// Socket.IO connection function
const connectToSocket = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return socketService.connect(token);
  } catch (error) {
    console.error('Socket connection error:', error);
    return false;
  }
};

// Hook for real-time messaging with Socket.IO support
export const useMessaging = (userId: string) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for connection events
  useEffect(() => {
    const isConnected = connectToSocket();
    setConnected(isConnected);

    socketService.onConnect(() => {
      setConnected(true);
      setError(null);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!connected) return;

    socketService.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketService.removeAllListeners('new_message');
    };
  }, [connected]);

  // Check current connection status
  const checkConnection = useCallback(() => {
    return connected;
  }, [connected]);

  // Send message via Socket
  const sendMessage = useCallback(async (receiverId: string, content: string, attachments?: File[]) => {
    if (!connected) {
      throw new Error('Not connected to messaging service');
    }

    try {
      // Set timeout in case no response is received
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Message sending timeout')), 10000)
      );

      // Listen for send confirmation
      const confirmation = new Promise((resolve) => {
        socketService.on('message_sent', resolve);
      });

      // Listen for errors
      const errorHandler = new Promise((_, reject) => {
        socketService.on('message_error', reject);
      });

      // Send the message
      socketService.emit('send_message', {
        receiverId,
        content,
        attachments
      });

      // Handle file attachments (to be implemented)
      if (attachments?.length) {
        // Upload files logic will be added here
      }

      await Promise.race([confirmation, errorHandler, timeout]);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [connected]);

  // Mark messages as read via Socket
  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!connected) {
      throw new Error('Not connected to messaging service');
    }

    try {
      socketService.emit('mark_read', { messageIds });
      
      setMessages(prev => 
        prev.map(msg => 
          messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        )
      );

      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }, [connected]);

  return {
    connected,
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    checkConnection
  };
};

// Message service for REST API calls
export const messageService = {
  // Send new message
  sendMessage: async (receiverId: string, content: string, attachments?: File[]) => {
    try {
      const formData = new FormData();
      formData.append('receiverId', receiverId);
      formData.append('content', content);
      
      if (attachments?.length) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const response = await api.post('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get conversation with specific user
  getConversation: async (userId: string, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  },

  // Get all user conversations
  getConversations: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/messages/conversations', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (messageIds: string[]) => {
    try {
      const response = await api.post('/messages/read', { messageIds });
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Get unread messages count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/messages/unread/count');
      return response.data;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};

export default messageService;