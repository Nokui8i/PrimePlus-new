import { useState, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { messageService } from '@/services/messageService';
import Image from 'next/image';

interface MessageItemProps {
  message: {
    id: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    attachmentUrl?: string;
    attachmentType?: string;
    sender: {
      id: string;
      username: string;
      fullName?: string;
      profileImage?: string;
    };
  };
  onDelete?: (messageId: string) => void;
}

export default function MessageItem({ message, onDelete }: MessageItemProps) {
  const { user } = useContext(UserContext);
  const [showOptions, setShowOptions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const isCurrentUserSender = user?.id === message.sender.id;
  
  const handleDeleteMessage = async () => {
    if (confirmDelete) {
      try {
        const response = await messageService.deleteMessage(message.id);
        if (response.success && onDelete) {
          onDelete(message.id);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    } else {
      setConfirmDelete(true);
      
      // Reset confirm state after a delay if not acted upon
      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
    }
  };
  
  // Format time to display
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = 
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  return (
    <div 
      className={`flex mb-4 ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Message with avatar for other user */}
      {!isCurrentUserSender && (
        <div className="flex-shrink-0 mr-2">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 relative">
            {message.sender.profileImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${message.sender.profileImage}`}
                alt={message.sender.username}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <span className="text-blue-600 text-xs font-medium">
                  {message.sender.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="relative max-w-[75%]">
        {/* Message content */}
        <div 
          className={`px-4 py-2 rounded-lg ${
            isCurrentUserSender 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-gray-200 text-gray-800 rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {/* Attachment handling (if present) */}
          {message.attachmentUrl && (
            <div className="mt-2">
              {message.attachmentType?.startsWith('image/') ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${message.attachmentUrl}`}
                  alt="Attachment"
                  width={200}
                  height={150}
                  className="rounded"
                />
              ) : (
                <a 
                  href={`${process.env.NEXT_PUBLIC_API_URL}${message.attachmentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attachment
                </a>
              )}
            </div>
          )}
        </div>
        
        {/* Message timestamp */}
        <div 
          className={`text-xs text-gray-500 mt-1 ${
            isCurrentUserSender ? 'text-right' : 'text-left'
          }`}
        >
          {formatMessageTime(message.createdAt)}
          {isCurrentUserSender && message.isRead && (
            <span className="ml-1 text-green-600">✓</span>
          )}
        </div>
        
        {/* Delete option (only for sent messages) */}
        {isCurrentUserSender && showOptions && (
          <button
            onClick={handleDeleteMessage}
            className={`absolute top-0 ${isCurrentUserSender ? 'left-0' : 'right-0'} -translate-x-full text-xs p-1 ${
              confirmDelete ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            } rounded`}
          >
            {confirmDelete ? 'Confirm' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
}