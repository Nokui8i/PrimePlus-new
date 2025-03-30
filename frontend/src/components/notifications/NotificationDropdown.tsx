import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { notificationService } from '@/services/notificationService';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotifications();
        if (response.success) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notification =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return format(date, 'MMM d');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="w-full bg-white rounded-xl shadow-xl ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/10 overflow-hidden z-50"
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          <button
            onClick={() => {/* Mark all as read */}}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full dark:hover:bg-neutral-700"
          >
            <CheckIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-gray-100 dark:bg-neutral-700 mx-4 mt-4 rounded-xl">
          <Tab
            className={({ selected }) =>
              `w-full py-2 text-sm leading-5 font-medium rounded-lg focus:outline-none ${
                selected
                  ? 'bg-white text-blue-600 shadow dark:bg-neutral-600 dark:text-white'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800 dark:text-gray-300'
              }`
            }
          >
            All
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2 text-sm leading-5 font-medium rounded-lg focus:outline-none ${
                selected
                  ? 'bg-white text-blue-600 shadow dark:bg-neutral-600 dark:text-white'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800 dark:text-gray-300'
              }`
            }
          >
            Unread
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-2 max-h-[400px] overflow-y-auto">
          <Tab.Panel className="p-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors duration-200 ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <img
                    src={notification.sender.avatar}
                    alt={notification.sender.username}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-red-600 hover:text-red-800 dark:hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Tab.Panel>

          <Tab.Panel className="p-1">
            {notifications.filter(n => !n.isRead).map((notification) => (
              <div
                key={notification.id}
                className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <img
                    src={notification.sender.avatar}
                    alt={notification.sender.username}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                    >
                      Mark as read
                    </button>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-red-600 hover:text-red-800 dark:hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {notifications.length === 0 && (
        <div className="p-8 text-center">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
        </div>
      )}
    </div>
  );
}