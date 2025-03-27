import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { motion } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { notificationService } from '@/services/notificationService';

// Interface for navigation item
interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  creatorOnly?: boolean;
  isExternal?: boolean;
}

const NavigationSidebar: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isCreator } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
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

  // Navigation items
  const navItems: NavItem[] = [
    {
      name: 'Home',
      path: '/home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'Collections',
      path: '/collections',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'Subscriptions',
      path: '/subscriptions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'My Profile',
      path: `/profile/${user?.username || ''}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'Creator Dashboard',
      path: '/creator/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      requiresAuth: true,
      creatorOnly: true
    }
  ];
  
  // Filter navigation items based on auth requirements and role
  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.creatorOnly && !isCreator) return false;
    return true;
  });

  // Check if a route is active
  const isActive = (path: string): boolean => {
    return router.pathname === path || 
      (path.startsWith('/profile') && router.pathname.startsWith('/profile'));
  };
  
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 fixed z-10 shadow-lg"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Link href="/" className="flex items-center group">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
            >
              PrimePlus+
            </motion.span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <motion.li 
                key={item.path}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {item.isExternal ? (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 rounded-lg group"
                  >
                    <span className="text-neutral-500 group-hover:text-primary-500 transition-colors duration-300">{item.icon}</span>
                    <span className="ml-3 hidden md:block">{item.name}</span>
                  </a>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 ${
                      isActive(item.path) 
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    } transition-all duration-300 rounded-lg group`}
                  >
                    <span className={`${
                      isActive(item.path) 
                        ? 'text-primary-600' 
                        : 'text-neutral-500 group-hover:text-primary-500'
                    } transition-colors duration-300`}>
                      {item.icon}
                    </span>
                    <span className="ml-3 hidden md:block">{item.name}</span>
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>
        </nav>
        
        {/* Create New Post Button */}
        {isAuthenticated && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/content/create"
                className="w-full flex items-center justify-center p-3 text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">Create New Post</span>
              </Link>
            </motion.div>
          </div>
        )}
        
        {/* Auth Links - Show if not authenticated */}
        {!isAuthenticated && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/auth/login"
                  className="w-full flex items-center justify-center p-3 text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/auth/register"
                  className="w-full flex items-center justify-center p-3 text-primary-600 border-2 border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg font-medium transition-all duration-300"
                >
                  Register
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NavigationSidebar;