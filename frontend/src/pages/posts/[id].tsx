import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  BookmarkIcon, 
  ShareIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  LockClosedIcon,
  EyeIcon,
  CheckIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// ממשק ליצרן התוכן
interface Creator {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
}

// ממשק לסוג תוכן
interface PostMedia {
  type: 'image' | 'video';
  url: string;
  aspectRatio?: number;
  thumbnail?: string;
}

// ממשק לתגובה
interface Comment {
  id: string;
  user: {
    username: string;
    fullName: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

// ממשק לפוסט
interface Post {
  id: string;
  title: string;
  content: string;
  media?: PostMedia[];
  creator: Creator;
  timestamp: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  isPremium: boolean;
}

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // נתוני פוסט לדוגמה (יבואו מהשרת בעתיד)
  const [post, setPost] = useState<Post | null>(null);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // טען נתוני דוגמה (סימולציה לקריאת שרת)
  useEffect(() => {
    // סימולציה של העיכוב בטעינה מהשרת
    const timer = setTimeout(() => {
      setPost({
        id: 'post-123',
        title: 'Sunset at Tel Aviv Beach',
        content: "I captured this breathtaking sunset yesterday at Tel Aviv beach. The colors were absolutely magical! The way the sunlight reflected on the water created this stunning gradient effect that I've been trying to capture for weeks. \n\nFor the photography enthusiasts, I used my Canon EOS R5 with a 24-70mm f/2.8 lens for this shot. Settings: ISO 100, f/8, 1/125s. \n\nI'll be sharing more from this beach session in the coming days, so stay tuned! If you have any questions about the location or my photography process, feel free to ask in the comments below.",
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?q=80&w=2070',
            aspectRatio: 16/9
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?q=80&w=2089',
            aspectRatio: 16/9
          }
        ],
        creator: {
          id: 'creator-1',
          username: 'emily_photos',
          fullName: 'Emily Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
          isVerified: true
        },
        timestamp: '2024-03-20T18:30:00Z',
        tags: ['photography', 'sunset', 'telaviv', 'beach', 'nature'],
        likes: 245,
        comments: 32,
        isLiked: false,
        isSaved: false,
        isPremium: false
      });
      
      setCommentsList([
        {
          id: 'comment-1',
          user: {
            username: 'photography_lover',
            fullName: 'David Cohen',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            isVerified: false
          },
          content: 'Amazing capture! The colors are absolutely stunning. What time of day was this taken exactly?',
          timestamp: '2024-03-20T19:45:00Z',
          likes: 12,
          isLiked: true
        },
        {
          id: 'comment-2',
          user: {
            username: 'travel_enthusiast',
            fullName: 'Sarah Miller',
            avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
            isVerified: true
          },
          content: 'Tel Aviv has the most beautiful sunsets! This reminds me of when I visited last summer. Definitely a must-see for anyone traveling to Israel.',
          timestamp: '2024-03-21T08:15:00Z',
          likes: 8,
          isLiked: false
        },
        {
          id: 'comment-3',
          user: {
            username: 'emily_photos',
            fullName: 'Emily Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            isVerified: true
          },
          content: '@photography_lover Thank you! This was taken around 7:30 PM, just about 20 minutes before the sun fully set. That's the golden hour magic!',
          timestamp: '2024-03-21T10:30:00Z',
          likes: 5,
          isLiked: false
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  // פונקציה ללייק של פוסט
  const handleLikePost = () => {
    if (!post) return;
    
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1
    });
  };
  
  // פונקציה לשמירת פוסט
  const handleSavePost = () => {
    if (!post) return;
    
    setPost({
      ...post,
      isSaved: !post.isSaved
    });
  };
  
  // פונקציה ללייק של תגובה
  const handleLikeComment = (commentId: string) => {
    setCommentsList(comments => 
      comments.map(comment => 
        comment.id === commentId 
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            } 
          : comment
      )
    );
  };
  
  // פונקציה להוספת תגובה חדשה
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !post) return;
    
    // יצירת תגובה חדשה
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        username: 'current_user',
        fullName: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isVerified: false
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    
    // הוספת התגובה החדשה
    setCommentsList([newCommentObj, ...commentsList]);
    
    // עדכון מספר התגובות בפוסט
    setPost({
      ...post,
      comments: post.comments + 1
    });
    
    // איפוס שדה התגובה החדשה
    setNewComment('');
  };
  
  // פורמט תאריך תצוגה
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // פורמט זמן עבור תגובות
  const formatCommentTime = (timestamp: string) => {
    const commentDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - commentDate.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout title="Loading Post...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!post) {
    return (
      <MainLayout title="Post Not Found">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/home" className="btn-primary py-2 px-6">
            Back to Feed
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title={post.title}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* כפתור חזרה */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-6"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back
        </button>
        
        <div className="card">
          {/* כותרת הפוסט */}
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          {/* מידע על היוצר */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href={`/creators/${post.creator.username}`} className="flex items-center group">
                <img 
                  src={post.creator.avatar} 
                  alt={post.creator.fullName} 
                  className="w-10 h-10 rounded-full object-cover mr-3 border border-neutral-200 dark:border-neutral-700"
                />
                
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center">
                    {post.creator.fullName}
                    {post.creator.isVerified && (
                      <span className="ml-1 text-primary-600 dark:text-primary-400">
                        <CheckIcon className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-500">@{post.creator.username}</div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center text-sm text-neutral-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>{formatDate(post.timestamp)}</span>
            </div>
          </div>
          
          {/* תמונות */}
          {post.media && post.media.length > 0 && (
            <div className={`mb-6 ${post.media.length > 1 ? 'grid grid-cols-1 gap-4' : ''}`}>
              {post.media.map((media, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  {media.type === 'image' && (
                    <img 
                      src={media.url} 
                      alt={`${post.title} - Image ${index + 1}`}
                      className="w-full h-auto"
                    />
                  )}
                  {media.type === 'video' && (
                    <div className="relative aspect-video">
                      <img 
                        src={media.thumbnail || media.url} 
                        alt={`${post.title} - Video thumbnail`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                        <button className="bg-white/20 rounded-full p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* תוכן הפוסט */}
          <div className="mb-6">
            <div className="prose dark:prose-invert max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-neutral-800 dark:text-neutral-200">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* תגיות */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <Link
                  href={`/tags/${tag}`}
                  key={tag}
                  className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm px-3 py-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
          
          {/* לייקים, תגובות, שמירה ושיתוף */}
          <div className="flex items-center justify-between py-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLikePost}
                className="flex items-center group"
              >
                {post.isLiked ? (
                  <HeartIconSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-neutral-500 group-hover:text-red-500" />
                )}
                <span className={`ml-2 ${post.isLiked ? 'text-red-500' : 'text-neutral-500 group-hover:text-red-500'}`}>
                  {post.likes}
                </span>
              </button>
              
              <button className="flex items-center text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                <ChatBubbleLeftIcon className="w-6 h-6" />
                <span className="ml-2">{post.comments}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSavePost}
                className={post.isSaved ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}
              >
                <BookmarkIcon className="w-6 h-6" />
              </button>
              
              <button className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* אזור התגובות */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
            Comments ({post.comments})
          </h2>
          
          {/* טופס הוספת תגובה */}
          <div className="card mb-6">
            <form onSubmit={handleAddComment} className="space-y-4">
              <div className="flex items-start">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Your profile"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="form-input min-h-[80px] w-full"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button type="button" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                  <FaceSmileIcon className="w-6 h-6" />
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-2 px-4 flex items-center" 
                  disabled={!newComment.trim()}
                >
                  <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                  Post Comment
                </button>
              </div>
            </form>
          </div>
          
          {/* רשימת תגובות */}
          <div className="space-y-6">
            {commentsList.length > 0 ? (
              commentsList.map(comment => (
                <div key={comment.id} className="card">
                  <div className="flex items-start">
                    <Link href={`/creators/${comment.user.username}`} className="flex-shrink-0">
                      <img 
                        src={comment.user.avatar} 
                        alt={comment.user.fullName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/creators/${comment.user.username}`} className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                            {comment.user.fullName}
                            {comment.user.isVerified && (
                              <span className="ml-1 text-primary-600 dark:text-primary-400">
                                <CheckIcon className="w-4 h-4" />
                              </span>
                            )}
                          </Link>
                          <div className="text-sm text-neutral-500">
                            @{comment.user.username} • {formatCommentTime(comment.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-neutral-800 dark:text-neutral-200">
                        {comment.content}
                      </div>
                      
                      <div className="mt-3 flex items-center space-x-4">
                        <button 
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center text-sm group"
                        >
                          {comment.isLiked ? (
                            <HeartIconSolid className="w-4 h-4 text-red-500 mr-1" />
                          ) : (
                            <HeartIcon className="w-4 h-4 text-neutral-500 group-hover:text-red-500 mr-1" />
                          )}
                          <span className={comment.isLiked ? 'text-red-500' : 'text-neutral-500 group-hover:text-red-500'}>
                            {comment.likes}
                          </span>
                        </button>
                        
                        <button className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage; 