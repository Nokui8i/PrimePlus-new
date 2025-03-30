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
      name: 'Subscriptions',
      path: '/subscriptions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'VR Content',
      path: '/vr',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      requiresAuth: true
    },
    {
      name: 'Profile',
      path: `/profile/${user?.username || ''}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      requiresAuth: true
    }
  ];
  
  // More menu items
  const moreItems: NavItem[] = [
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
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      requiresAuth: true
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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700 fixed right-0 z-10 shadow-lg"
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
                  <span className="ml-3">{item.name}</span>
                </Link>
              </motion.li>
            ))}
            
            {/* More Section */}
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <h3 className="px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">More</h3>
              {moreItems.filter(item => {
                if (item.requiresAuth && !isAuthenticated) return false;
                if (item.creatorOnly && !isCreator) return false;
                return true;
              }).map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
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
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </motion.li>
              ))}
            </div>
          </ul>
        </nav>
        
        {/* Logout Button */}
        {isAuthenticated && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => {/* TODO: Add logout handler */}}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="ml-3">Logout</span>
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NavigationSidebar;