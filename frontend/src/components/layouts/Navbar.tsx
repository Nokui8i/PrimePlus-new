import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/components/providers/AuthProvider';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { notificationService } from '@/services/notificationService';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const { isAuthenticated: authAuthenticated } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Fetch unread notifications count
  useEffect(() => {
    if (!authAuthenticated) return;

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
  }, [authAuthenticated]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? "/feed" : "/"}>
              <span className="text-indigo-600 font-bold text-2xl cursor-pointer">
                Prime<span className="text-indigo-400">Plus+</span>
              </span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href={isAuthenticated ? "/feed" : "/"}
                className={`${
                  router.pathname === '/feed' || router.pathname === '/' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>

              <Link 
                href="/notifications"
                className={`${
                  router.pathname === '/notifications' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Notifications
              </Link>

              <Link 
                href="/post/new"
                className={`${
                  router.pathname === '/post/new' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                New post
              </Link>

              <Link 
                href="/messages"
                className={`${
                  router.pathname === '/messages' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Messages
              </Link>
              
              <Link 
                href="/collections"
                className={`${
                  router.pathname === '/collections' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Collections
              </Link>
              
              <Link 
                href="/subscriptions"
                className={`${
                  router.pathname === '/subscriptions' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Subscriptions
              </Link>
              
              <Link 
                href="/profile"
                className={`${
                  router.pathname === '/profile' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                My profile
              </Link>

              <button
                onClick={toggleProfileMenu}
                className={`
                  border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                `}
              >
                More
              </button>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative mr-4">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
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
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleProfileMenu}
                      className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </button>
                  </div>
                  
                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg">
                      <div className="py-1 rounded-md bg-white shadow-xs">
                        <div className="block px-4 py-3 text-sm border-b border-gray-200">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 mr-3">
                              {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="font-medium">{user?.fullName || user?.username}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                @{user?.username}
                              </div>
                            </div>
                          </div>
                          <div className="flex mt-2 text-xs text-gray-500">
                            <span className="mr-3">{user?.fanCount || 0} Fans</span>
                            <span>{user?.followingCount || 0} Following</span>
                          </div>
                        </div>
                        
                        <Link href="/profile">
                          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            My profile
                          </span>
                        </Link>
                        
                        {user?.role === 'creator' && (
                          <Link href="/creator/dashboard">
                            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                              Creator dashboard
                            </span>
                          </Link>
                        )}

                        <Link href="/settings/account">
                          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Settings
                          </span>
                        </Link>

                        <Link href="/settings/payments">
                          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Payments
                          </span>
                        </Link>
                        
                        {user?.role !== 'creator' && (
                          <Link href="/become-creator">
                            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                              Become a creator
                            </span>
                          </Link>
                        )}
                        
                        <Link href="/help">
                          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Help and support
                          </span>
                        </Link>

                        <div className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>Dark mode</span>
                            <button className="w-10 h-5 bg-gray-200 rounded-full focus:outline-none">
                              <div className="w-4 h-4 bg-white rounded-full transform translate-x-1"></div>
                            </button>
                          </div>
                        </div>

                        <div className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200">
                          <select className="block w-full text-sm text-gray-700 bg-white focus:outline-none">
                            <option>English</option>
                            <option>Español</option>
                            <option>Français</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none border-t border-gray-200"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            {isAuthenticated && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative mr-2"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${
                router.pathname === '/'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } text-base font-medium cursor-pointer`}>
                Home
              </span>
            </Link>
            
            <Link href="/notifications">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${
                router.pathname === '/notifications'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } text-base font-medium cursor-pointer`}>
                Notifications
              </span>
            </Link>
            
            <Link href="/post/new">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${
                router.pathname === '/post/new'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } text-base font-medium cursor-pointer`}>
                New post
              </span>
            </Link>
            
            <Link href="/messages">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${
                router.pathname === '/messages'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } text-base font-medium cursor-pointer`}>
                Messages
              </span>
            </Link>
            
            <Link href="/collections">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${
                router.pathname === '/collections'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } text-base font-medium cursor-pointer`}>
                Collections
              </span>
            </Link>

            <Link href="/subscriptions">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${
                router.pathname === '/subscriptions'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } text-base font-medium cursor-pointer`}>
                Subscriptions
              </span>
            </Link>
            
            <Link href="/profile">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${
                router.pathname === '/profile'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } text-base font-medium cursor-pointer`}>
                My profile
              </span>
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.fullName || user?.username}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link href="/profile">
                  <span className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer">
                    My profile
                  </span>
                </Link>
                <Link href="/settings">
                  <span className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-around">
                <Link
                  href="/login"
                  className="px-4 py-2 text-base font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;