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
  HashtagIcon,
  AdjustmentsHorizontalIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// ממשק לסוג הממיין
type SortOption = 'latest' | 'popular' | 'oldest';

// ממשק לסוג הסינון
type FilterOption = 'all' | 'photo' | 'video' | 'text';

// ממשק ליוצר
interface Creator {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
}

// ממשק לפוסט
interface Post {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  type: 'photo' | 'video' | 'text';
  creator: Creator;
  timestamp: string;
  likes: number;
  comments: number;
  isPremium: boolean;
  isLiked: boolean;
  isSaved: boolean;
}

const TagPage: NextPage = () => {
  const router = useRouter();
  const { tag } = router.query;
  
  // סטייט ומיון וסינון
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // סטייט לפוסטים
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // סימולציה של קריאת API לפוסטים עם התגית
  useEffect(() => {
    if (!tag) return;
    
    setIsLoading(true);
    
    // סימולציה של API קול
    setTimeout(() => {
      const samplePosts: Post[] = [
        {
          id: 'post1',
          title: 'Sunset at Tel Aviv Beach',
          description: 'Captured this breathtaking sunset yesterday at Tel Aviv beach. The colors were absolutely magical!',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?q=80&w=2070',
          type: 'photo',
          creator: {
            id: 'creator1',
            username: 'emily_photos',
            fullName: 'Emily Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            isVerified: true
          },
          timestamp: '2024-03-20T18:30:00Z',
          likes: 245,
          comments: 32,
          isPremium: false,
          isLiked: false,
          isSaved: false
        },
        {
          id: 'post2',
          title: 'Advanced Portrait Lighting Techniques',
          description: 'In this premium tutorial, I break down my approach to portrait lighting in difficult environments.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070',
          type: 'video',
          creator: {
            id: 'creator2',
            username: 'james_arts',
            fullName: 'James Smith',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            isVerified: true
          },
          timestamp: '2024-03-18T14:15:00Z',
          likes: 189,
          comments: 48,
          isPremium: true,
          isLiked: true,
          isSaved: false
        },
        {
          id: 'post3',
          title: 'Jerusalem Old City Collection',
          description: 'My latest photo collection from the historic streets of Jerusalem. Exploring ancient architecture and the vibrant culture.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=2074',
          type: 'photo',
          creator: {
            id: 'creator3',
            username: 'sophia_creator',
            fullName: 'Sophia Williams',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            isVerified: false
          },
          timestamp: '2024-03-15T10:45:00Z',
          likes: 312,
          comments: 65,
          isPremium: true,
          isLiked: false,
          isSaved: true
        },
        {
          id: 'post4',
          title: 'Photography Basics: Composition Tips',
          description: 'A guide for beginners looking to improve their photography composition skills.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2070',
          type: 'text',
          creator: {
            id: 'creator4',
            username: 'photo_master',
            fullName: 'Michael Chen',
            avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
            isVerified: true
          },
          timestamp: '2024-03-12T09:20:00Z',
          likes: 156,
          comments: 22,
          isPremium: false,
          isLiked: false,
          isSaved: false
        }
      ];
      
      setPosts(samplePosts);
      setIsLoading(false);
    }, 1000);
  }, [tag]);
  
  // פונקציה לסינון פוסטים לפי סוג
  const filteredPosts = posts.filter(post => {
    if (filterBy === 'all') return true;
    return post.type === filterBy;
  });
  
  // מיון פוסטים
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });
  
  // פונקציה לפורמט של התאריך
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // פונקציה ללייק פוסט
  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };
  
  // פונקציה לשמירת פוסט
  const handleSave = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };
  
  // פונקציה לקבלת אייקון לפי סוג פוסט
  const getPostTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon className="w-5 h-5" />;
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />;
      case 'text':
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout title={`#${tag} - Posts`}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title={`#${tag} - Posts`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <HashtagIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            #{tag}
          </h1>
        </div>
        
        {/* אזור סינון ומיון */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center">
            <span className="text-neutral-600 dark:text-neutral-400 mr-2">
              {posts.length} posts
            </span>
            {/* כפתור לפתיחת חלונית סינון במובייל */}
            <button
              className="md:hidden ml-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <AdjustmentsHorizontalIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:flex md:items-center space-y-4 md:space-y-0 md:space-x-6`}>
            {/* סינון לפי סוג */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-500">Filter:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setFilterBy('all')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filterBy === 'all'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterBy('photo')}
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    filterBy === 'photo'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <PhotoIcon className="w-4 h-4 mr-1" />
                  Photos
                </button>
                <button
                  onClick={() => setFilterBy('video')}
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    filterBy === 'video'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <VideoCameraIcon className="w-4 h-4 mr-1" />
                  Videos
                </button>
                <button
                  onClick={() => setFilterBy('text')}
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    filterBy === 'text'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <DocumentTextIcon className="w-4 h-4 mr-1" />
                  Articles
                </button>
              </div>
            </div>
            
            {/* מיון */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="form-select py-1 text-sm"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* רשימת הפוסטים */}
        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map(post => (
              <div key={post.id} className="card overflow-hidden flex flex-col">
                {/* טמבנייל */}
                <div className="relative">
                  <img 
                    src={post.thumbnailUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* אינדיקטור לתוכן פרימיום */}
                  {post.isPremium && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
                      Premium
                    </div>
                  )}
                  
                  {/* אינדיקטור לסוג תוכן */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    {getPostTypeIcon(post.type)}
                    <span className="ml-1 capitalize">{post.type}</span>
                  </div>
                </div>
                
                {/* תוכן */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2 line-clamp-1">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <Link href={`/creators/${post.creator.username}`} className="flex items-center group">
                      <img 
                        src={post.creator.avatar} 
                        alt={post.creator.fullName} 
                        className="w-6 h-6 rounded-full object-cover mr-2"
                      />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {post.creator.fullName}
                      </span>
                      {post.creator.isVerified && (
                        <span className="ml-1 text-primary-600 dark:text-primary-400">
                          <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </span>
                      )}
                    </Link>
                  </div>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2">
                    {post.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-neutral-500">
                      <span>{formatDate(post.timestamp)}</span>
                      
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center"
                        >
                          {post.isLiked ? (
                            <HeartIconSolid className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                          <span className="ml-1">{post.likes}</span>
                        </button>
                        
                        <div className="flex items-center">
                          <ChatBubbleLeftIcon className="w-5 h-5" />
                          <span className="ml-1">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* כפתורי פעולה */}
                <div className="flex border-t border-neutral-100 dark:border-neutral-800">
                  <Link 
                    href={`/posts/${post.id}`}
                    className="flex-1 py-2 text-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    View Post
                  </Link>
                  <button
                    onClick={() => handleSave(post.id)}
                    className={`w-12 flex items-center justify-center ${
                      post.isSaved 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                    } border-l border-neutral-100 dark:border-neutral-800`}
                  >
                    <BookmarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {filterBy === 'all'
                ? `No posts with #${tag} tag found.`
                : `No ${filterBy} posts with #${tag} tag found. Try changing the filter.`}
            </p>
            
            <button 
              onClick={() => setFilterBy('all')}
              className="btn-primary py-2 px-6 inline-block"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TagPage; 