import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ContentItem, ContentType } from '@/types/content';

interface ContentCardProps {
  content: ContentItem;
  layout?: 'grid' | 'list';
  showAuthor?: boolean;
  showActions?: boolean;
  className?: string;
  onClick?: () => void;
  isCreator?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  layout = 'grid',
  showAuthor = true,
  showActions = true,
  className = '',
  onClick,
  isCreator = false,
}) => {
  const {
    id,
    title,
    mediaType,
    thumbnail,
    description,
    createdAt,
    likeCount,
    commentCount,
    viewCount,
    isPremium,
    creator,
  } = content;
  
  const getContentTypeIcon = () => {
    switch (mediaType) {
      case 'video':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'text':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'mixed':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };
  
  const cardClasses = layout === 'grid' 
    ? 'h-full flex flex-col rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200'
    : 'flex rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200';
  
  return (
    <div 
      className={`${cardClasses} ${className}`}
      onClick={onClick}
    >
      <Link href={`/content/${id}`}>
        <div className={layout === 'grid' ? 'block' : 'flex'}>
          <div 
            className={`relative ${
              layout === 'grid' 
                ? 'h-48 w-full' 
                : 'h-32 flex-shrink-0 w-48'
            }`}
          >
            {thumbnail ? (
              <div className="absolute inset-0">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="p-4 text-gray-400">
                  {getContentTypeIcon()}
                </div>
              </div>
            )}
            
            {isPremium && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                PREMIUM
              </div>
            )}
            
            {mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-30 rounded-full p-3">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            
            {isCreator && (
              <Link 
                href={`/content/edit/${id}`}
                className="absolute top-2 left-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 hover:text-gray-900 rounded-full p-2 transition-all duration-200 shadow-sm z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
            )}
          </div>
          
          <div className={`flex-1 p-4 ${layout === 'grid' ? '' : 'flex flex-col'}`}>
            <div className="flex-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                <span className="capitalize">{mediaType}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{title}</h3>
              
              {description && layout === 'list' && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
              )}
              
              {showAuthor && (
                <div className="mt-2 flex items-center space-x-2">
                  {creator.avatar ? (
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-sm text-gray-700">{creator.name}</span>
                </div>
              )}
            </div>
            
            {showActions && (
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{viewCount > 999 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{likeCount}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{commentCount}</span>
                  </div>
                </div>
                
                <button 
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle bookmark or save
                  }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContentCard;