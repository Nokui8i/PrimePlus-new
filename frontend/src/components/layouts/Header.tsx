import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { BellIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { notificationService } from '@/services/notificationService';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fetch unread notifications count
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        if (response.success) {
          setUnreadCount(response.data);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    // Set up polling for unread count
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                Prime<span className="text-indigo-400">Plus+</span>
              </span>
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 flex items-center justify-center px-2 lg:px-6">
            <div className="max-w-lg w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
            </div>
          </div>

          {/* Right section - Navigation */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none relative"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown 
                    isOpen={showNotifications} 
                    onClose={() => setShowNotifications(false)}
                  />
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 text-gray-500" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 