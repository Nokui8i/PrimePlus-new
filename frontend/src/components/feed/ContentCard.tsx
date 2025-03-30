import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { feedService } from '@/services/feedService';
import Button from '@/components/ui/Button';

interface ContentCardProps {
  content: any;
}

export default function ContentCard({ content }: ContentCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const handleLike = async () => {
    try {
      await feedService.likeContent(content.id);
      setLiked(!liked);
    } catch (err) {
      console.error('Error liking content:', err);
    }
  };

  const handleSave = async () => {
    try {
      await feedService.saveContent(content.id);
      setSaved(!saved);
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const result = await feedService.addComment(content.id, comment);
      if (result.success) {
        setComments([
          ...comments,
          {
            id: result.data.id,
            text: comment,
            user: { username: 'You' }
          }
        ]);
        setComment('');
      }
    } catch (err) {
      console.error('Error sending comment:', err);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Post header and user */}
      <div className="p-4 flex items-center border-b">
        <Link href={`/creator/${content.creator.id}`}>
          <div className="flex items-center">
            <div className="h-10 w-10 relative rounded-full overflow-hidden">
              {content.creator.profileImage ? (
                <Image 
                  src={`${process.env.NEXT_PUBLIC_API_URL}${content.creator.profileImage}`}
                  alt={content.creator.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <span className="text-lg text-gray-600">
                    {content.creator.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">
                {content.creator.fullName || content.creator.username}
              </p>
              <p className="text-xs text-gray-500">
                {getTimeAgo(content.createdAt)}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Post content */}
      <div className="p-4">
        <Link href={`/content/${content.id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{content.title}</h3>
        </Link>
        <p className="text-gray-700 mb-4">{content.description}</p>

        {/* Image or video */}
        {content.mediaUrl && (
          <Link href={`/content/${content.id}`}>
            <div className="relative aspect-video w-full bg-gray-100 mb-4 rounded overflow-hidden">
              {content.contentType === 'image' ? (
                <Image 
                  src={`${process.env.NEXT_PUBLIC_API_URL}${content.mediaUrl}`}
                  alt={content.title}
                  fill
                  className="object-cover"
                />
              ) : content.contentType === 'video' ? (
                <video 
                  src={`${process.env.NEXT_PUBLIC_API_URL}${content.mediaUrl}`}
                  className="w-full h-full object-cover"
                  controls
                ></video>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">View full content</p>
                </div>
              )}

              {/* VR content badge */}
              {content.contentType === 'vr' && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  VR
                </div>
              )}

              {/* Premium content badge */}
              {content.isPremium && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                  PREMIUM
                </div>
              )}
            </div>
          </Link>
        )}
      </div>

      {/* Interaction buttons */}
      <div className="border-t px-4 py-2 flex justify-between">
        <div className="flex space-x-4">
          <button 
            onClick={handleLike}
            className={`flex items-center ${liked ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={liked ? 0 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="ml-1">Like</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="ml-1">Comments</span>
          </button>
        </div>
        
        <button 
          onClick={handleSave}
          className={`flex items-center ${saved ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={saved ? 0 : 1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="ml-1">Save</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="p-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
          
          {comments.length > 0 ? (
            <div className="space-y-3 mb-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <p className="text-xs font-medium text-gray-900">{comment.user.username}</p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">No comments yet.</p>
          )}
          
          <form onSubmit={handleComment} className="flex">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" className="rounded-l-none">
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}