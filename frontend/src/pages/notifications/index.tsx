import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import NotificationItem from '@/components/notifications/NotificationItem';
import {
  BellIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  StarIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

// Types
interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  user?: {
    id: string;
    username: string;
    avatar: string;
  };
  post?: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'liked your post',
    timestamp: '2024-03-23T10:30:00Z',
    read: false,
    user: {
      id: '1',
      username: 'user1',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    post: {
      id: '1',
      title: 'Amazing VR Experience',
      thumbnail: 'https://picsum.photos/400/300?random=1',
    },
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'commented on your post',
    timestamp: '2024-03-23T09:15:00Z',
    read: true,
    user: {
      id: '2',
      username: 'user2',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    post: {
      id: '2',
      title: 'Virtual Reality Tips',
      thumbnail: 'https://picsum.photos/400/300?random=2',
    },
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'started following you',
    timestamp: '2024-03-23T08:45:00Z',
    read: false,
    user: {
      id: '3',
      username: 'user3',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'Your subscription has been renewed',
    timestamp: '2024-03-23T08:00:00Z',
    read: true,
  },
];

const NotificationsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1); // Mock single page for now

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate API delay
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setNotifications(MOCK_NOTIFICATIONS);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, router]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'likes', label: 'Likes' },
    { id: 'comments', label: 'Comments' },
    { id: 'follows', label: 'Follows' },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'likes') return notification.type === 'like';
    if (activeFilter === 'comments') return notification.type === 'comment';
    if (activeFilter === 'follows') return notification.type === 'follow';
    return true;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlusIcon className="w-5 h-5 text-green-500" />;
      case 'mention':
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
      case 'system':
        return <BellAlertIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-neutral-500" />;
    }
  };

  const handleMarkAllAsRead = async () => {
    // Simulate marking all as read
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    // Simulate marking single notification as read
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDelete = (id: string) => {
    // Simulate deleting notification
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <button
            onClick={handleMarkAllAsRead}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>

        {/* Notifications List */}
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-neutral-800 rounded-lg p-4 mb-4 shadow-sm ${
                !notification.read ? 'border-l-4 border-primary-600' : ''
              }`}
            >
              <div className="flex items-start">
                {notification.user ? (
                  <Image
                    src={notification.user.avatar}
                    alt={notification.user.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-full">
                    {getNotificationIcon(notification.type)}
                  </div>
                )}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {notification.user?.username || notification.title}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-neutral-500">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {notification.post && (
                    <Link
                      href={`/content/${notification.post.id}`}
                      className="mt-2 flex items-center p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <Image
                        src={notification.post.thumbnail}
                        alt={notification.post.title}
                        width={60}
                        height={45}
                        className="rounded"
                      />
                      <span className="ml-2 text-sm font-medium">
                        {notification.post.title}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
