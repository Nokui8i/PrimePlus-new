import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

// Types
interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const MessagesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // TODO: Fetch conversations from API
    // For now, using mock data
    const mockConversations: Conversation[] = [
      {
        id: '1',
        user: {
          id: '1',
          username: 'creator1',
          avatar: 'https://picsum.photos/100/100',
          isOnline: true,
        },
        lastMessage: 'Hey, I loved your latest post!',
        lastMessageTime: '2 minutes ago',
        unreadCount: 2,
        messages: [
          {
            id: '1',
            content: 'Hey, I loved your latest post!',
            timestamp: '2 minutes ago',
            senderId: '1',
            isRead: false,
          },
          {
            id: '2',
            content: 'Thank you! I worked really hard on it.',
            timestamp: '1 minute ago',
            senderId: 'currentUser',
            isRead: true,
          },
        ],
      },
      {
        id: '2',
        user: {
          id: '2',
          username: 'creator2',
          avatar: 'https://picsum.photos/100/100',
          isOnline: false,
        },
        lastMessage: 'When is your next post coming out?',
        lastMessageTime: '1 hour ago',
        unreadCount: 0,
        messages: [
          {
            id: '3',
            content: 'When is your next post coming out?',
            timestamp: '1 hour ago',
            senderId: '2',
            isRead: true,
          },
        ],
      },
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, [isAuthenticated, router]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // TODO: Send message to API
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: 'Just now',
      senderId: 'currentUser',
      isRead: true,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: 'Just now',
              unreadCount: 0,
              messages: [...conv.messages, newMsg],
            }
          : conv
      )
    );

    setSelectedConversation(prev =>
      prev
        ? {
            ...prev,
            lastMessage: newMessage,
            lastMessageTime: 'Just now',
            unreadCount: 0,
            messages: [...prev.messages, newMsg],
          }
        : null
    );

    setNewMessage('');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-bold">Messages</h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className={`p-4 cursor-pointer ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={conversation.user.avatar}
                        alt={conversation.user.username}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      {conversation.user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-neutral-800 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">
                          {conversation.user.username}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {conversation.lastMessageTime}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={selectedConversation.user.avatar}
                      alt={selectedConversation.user.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {selectedConversation.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-neutral-800 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedConversation.user.username}</h3>
                    <p className="text-sm text-neutral-500">
                      {selectedConversation.user.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === 'currentUser'
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-700'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 dark:bg-neutral-800"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700"
                    >
                      Send
                    </motion.button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    No conversation selected
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Select a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage; 