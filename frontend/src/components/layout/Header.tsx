import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { messageService } from '@/services/messageService';
import { notificationService } from '@/services/notificationService';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

export default function Header() {
  const { user, isAuthenticated, logout } = useContext(UserContext);
  const router = useRouter();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Check for unread messages and notifications periodically
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchUnreadCounts = async () => {
      try {
        // Fetch unread message count
        const messageResponse = await messageService.getUnreadCount();
        if (messageResponse.success) {
          setUnreadMessageCount(messageResponse.data.unreadCount);
        }
        
        // Fetch unread notification count
        const notificationResponse = await notificationService.getUnreadCount();
        if (notificationResponse.success) {
          setUnreadNotificationCount(notificationResponse.data.unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread counts:', error);
      }
    };
    
    // Initial fetch
    fetchUnreadCounts();
    
    // Set up interval
    const intervalId = setInterval(fetchUnreadCounts, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                primePlus+
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-4">
              <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${
                router.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}>
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}>
                    Dashboard
                  </Link>
                  <Link href="/content" className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname.startsWith('/content') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}>
                    Content
                  </Link>
                  <Link href="/vr" className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname.startsWith('/vr') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}>
                    VR
                  </Link>
                  <Link href="/subscriptions" className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === '/subscriptions' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}>
                    Subscriptions
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Messages button */}
                <Link 
                  href="/messages" 
                  className={`relative p-1 rounded-full text-gray-700 hover:text-blue-600 ${
                    router.pathname.startsWith('/messages') ? 'text-blue-600' : ''
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {unreadMessageCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                    </span>
                  )}
                </Link>
                
                {/* Notifications button */}
                <div className="relative">
                  <button 
                    onClick={toggleNotifications}
                    className={`relative p-1 rounded-full text-gray-700 hover:text-blue-600 ${
                      router.pathname === '/notifications' || showNotifications ? 'text-blue-600' : ''
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadNotificationCount > 0 && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                      </span>
                    )}
                  </button>
                  
                  <NotificationDropdown 
                    isOpen={showNotifications} 
                    onClose={() => setShowNotifications(false)} 
                  />
                </div>
                
                <span className="text-sm text-gray-700">
                  Hello, {user?.username || 'User'}
                </span>
                <button 
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}