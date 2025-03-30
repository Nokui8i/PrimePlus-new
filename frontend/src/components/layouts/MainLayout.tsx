'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { 
  HomeIcon, 
  BellIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon, 
  CreditCardIcon,
  StarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title = 'PrimePlus+',
  showNavigation = true
}) => {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const shouldShowNavigation = showNavigation && isAuthenticated;
  
  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar - Desktop */}
      {shouldShowNavigation && (
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 shadow-lg"
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 pt-6 pb-4">
              <Link href="/" className="flex items-center group">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  className="h-10 w-auto" 
                  src="/logo.svg" 
                  alt="PrimePlus+" 
                />
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
                >
                  PrimePlus+
                </motion.span>
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/" className={`nav-link ${isActive('/') ? 'nav-link-active' : 'nav-link-inactive'}`}>
                  <HomeIcon className="nav-icon" />
                  <span>Home</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/messages" className={`nav-link ${isActive('/messages') ? 'nav-link-active' : 'nav-link-inactive'}`}>
                  <ChatBubbleLeftRightIcon className="nav-icon" />
                  <span>Messages</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/subscriptions" className={`nav-link ${isActive('/subscriptions') ? 'nav-link-active' : 'nav-link-inactive'}`}>
                  <CreditCardIcon className="nav-icon" />
                  <span>Subscriptions</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/vr" className={`nav-link ${isActive('/vr') ? 'nav-link-active' : 'nav-link-inactive'}`}>
                  <VideoCameraIcon className="nav-icon" />
                  <span>VR Content</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href="/profile" className={`nav-link ${isActive('/profile') ? 'nav-link-active' : 'nav-link-inactive'}`}>
                  <UserIcon className="nav-icon" />
                  <span>Profile</span>
                </Link>
              </motion.div>
              
              {/* More options toggle */}
              <motion.button 
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMore(!showMore)}
                className="w-full text-left nav-link nav-link-inactive"
              >
                <span className="flex-1">More</span>
                <motion.div
                  animate={{ rotate: showMore ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDownIcon className="w-5 h-5" />
                </motion.div>
              </motion.button>
              
              {/* More options menu */}
              <AnimatePresence>
                {showMore && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-10 space-y-1"
                  >
                    {/* Always show Creator Dashboard during development */}
                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <Link href="/creator/dashboard" className={`nav-link ${isActive('/creator/dashboard') ? 'nav-link-active' : 'nav-link-inactive'}`}>
                        <StarIcon className="nav-icon" />
                        <span>Creator Dashboard</span>
                      </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <Link href="/settings" className={`nav-link ${isActive('/settings') ? 'nav-link-active' : 'nav-link-inactive'}`}>
                        <Cog6ToothIcon className="nav-icon" />
                        <span>Settings</span>
                      </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <Link href="/logout" className="nav-link nav-link-inactive text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <ArrowRightOnRectangleIcon className="nav-icon" />
                        <span>Logout</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>
            
            {/* Notifications and User info */}
            <div className="px-4 py-4 border-t border-neutral-200 dark:border-neutral-700">
              {/* Notifications */}
              <div className="relative mb-4">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-full flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-300 ${isActive('/notifications') ? 'bg-neutral-100 dark:bg-neutral-700' : ''}`}
                >
                  <div className="relative">
                    <BellIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      3
                    </span>
                  </div>
                  <span className="ml-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">Notifications</span>
                </button>
                {showNotifications && (
                  <div className="absolute bottom-full mb-2 left-0 right-0">
                    <NotificationDropdown 
                      isOpen={showNotifications} 
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
              </div>

              {/* User info */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-300"
              >
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-neutral-800 shadow-lg"
                  src={user?.avatar || "https://randomuser.me/api/portraits/women/8.jpg"} 
                  alt="Current user"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{user?.username || 'User Name'}</p>
                  <Link href="/profile" className="text-xs text-primary-600 hover:text-primary-500 transition-colors duration-300">
                    View Profile
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Main content */}
      <main className={`flex-1 ${shouldShowNavigation ? 'md:pl-64' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 