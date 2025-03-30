import Link from 'next/link';
import Image from 'next/image';

interface ConversationItemProps {
  conversation: {
    otherUser: {
      id: string;
      username: string;
      fullName?: string;
      profileImage?: string;
    };
    lastMessage: {
      id: string;
      content: string;
      createdAt: string;
      isRead: boolean;
      senderId: string;
    };
    unreadCount: number;
  };
  isActive?: boolean;
}

export default function ConversationItem({ conversation, isActive = false }: ConversationItemProps) {
  const { otherUser, lastMessage, unreadCount } = conversation;
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = 
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    
    const isYesterday = 
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Yesterday';
    } else if (now.getFullYear() === date.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };
  
  // Truncate message for preview
  const truncateMessage = (message: string, maxLength = 60) => {
    if (message.length <= maxLength) {
      return message;
    }
    return message.slice(0, maxLength) + '...';
  };
  
  return (
    <Link href={`/messages/${otherUser.id}`} className="block">
      <div 
        className={`flex items-center p-3 hover:bg-gray-50 ${
          isActive ? 'bg-blue-50' : ''
        } ${unreadCount > 0 ? 'font-medium' : ''}`}
      >
        {/* User avatar */}
        <div className="flex-shrink-0 mr-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 relative">
            {otherUser.profileImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${otherUser.profileImage}`}
                alt={otherUser.username}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <span className="text-blue-600 text-lg font-medium">
                  {otherUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Conversation info */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {otherUser.fullName || otherUser.username}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatTime(lastMessage.createdAt)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className={`text-sm ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-500'} truncate`}>
              {truncateMessage(lastMessage.content)}
            </p>
            
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}