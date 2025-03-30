import { useState } from 'react';
import Link from 'next/link';
import { notificationService } from '@/services/notificationService';

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'message' | 'subscription' | 'content' | 'like' | 'comment' | 'payment' | 'system';
    title: string;
    content: string;
    isRead: boolean;
    link?: string;
    iconUrl?: string;
    createdAt: string;
  };
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  const handleMarkAsRead = async (e: React.MouseEvent) => {
    if (notification.isRead) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await notificationService.markAsRead(notification.id);
      
      if (response.success && onMarkAsRead) {
        onMarkAsRead(notification.id);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await notificationService.deleteNotification(notification.id);
      
      if (response.success && onDelete) {
        onDelete(notification.id);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  // Format time to display
  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Get icon based on notification type
  const getIcon = () => {
    if (notification.iconUrl) {
      return (
        <img 
          src={`${process.env.NEXT_PUBLIC_API_URL}${notification.iconUrl}`}
          alt=""
          className="h-6 w-6 object-cover"
        />
      );
    }
    
    switch (notification.type) {
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'subscription':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'content':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'like':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'comment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case 'payment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  const NotificationContent = () => (
    <div className={`relative flex py-3 px-4 ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h4 className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-blue-800'}`}>
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
            {formatTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
      </div>
      
      {/* Actions dropdown */}
      {showOptions && (
        <div className="absolute right-0 top-0 mt-8 mr-2 bg-white rounded-md shadow-lg p-2 z-10">
          {!notification.isRead && (
            <button
              onClick={handleMarkAsRead}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
          >
            Delete
          </button>
        </div>
      )}
      
      {/* Options button */}
      <button
        className="ml-2 text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  );
  
  if (notification.link) {
    return (
      <Link href={notification.link}>
        <div 
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
          className="cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
        >
          <NotificationContent />
        </div>
      </Link>
    );
  }
  
  return (
    <div 
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
      className="hover:bg-gray-50 border-b last:border-b-0"
    >
      <NotificationContent />
    </div>
  );
}