import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  BookmarkIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { feedService } from '@/services/feedService';
import { MOCK_POSTS } from '@/services/mockData';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  views: number;
  isPremium: boolean;
  media?: {
    url: string;
    type: 'image' | 'video' | 'vr';
    subscriptionPackId: string | 'free' | 'individual' | null;
    individualPrice?: number;
    includeInSubscription: boolean;
  }[];
  createdAt: string;
}

interface InfiniteFeedProps {
  initialPosts: Post[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isSubscribed?: boolean;
  subscriptionTier?: 'none' | 'basic' | 'premium' | 'vr';
  onSubscribe?: () => void;
  onPurchaseContent?: (postId: string, mediaIndex: number) => void;
  creatorId?: string;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'vr';
  subscriptionPackId: string | 'free' | 'individual' | null;
  individualPrice?: number;
  includeInSubscription: boolean;
}

const InfiniteFeed: React.FC<InfiniteFeedProps> = ({
  initialPosts = [],
  hasMore = true,
  onLoadMore,
  isSubscribed = false,
  subscriptionTier = 'none',
  onSubscribe,
  onPurchaseContent,
  creatorId,
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(hasMore);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = async () => {
    if (loading || !hasMorePosts) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter posts by creator ID if provided
      let newPosts = MOCK_POSTS;
      if (creatorId) {
        newPosts = MOCK_POSTS.filter(post => post.creator.id === creatorId);
      }
      
      // Add required fields to match Post interface
      const formattedPosts: Post[] = newPosts.map((post) => ({
        ...post,
        id: `${post.id}-${page}`,
        createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        media: []
      }));
      
      setPosts(prev => [...prev, ...formattedPosts]);
      setPage(prev => prev + 1);
      setHasMorePosts(page < 5); // For demo, limit to 5 pages
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [page, loading, hasMorePosts]);

  const handleLike = (postId: string) => {
    setLiked(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSave = (postId: string) => {
    setSaved(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const canAccessContent = (media: MediaItem): boolean => {
    if (media.subscriptionPackId === 'free') return true;
    if (media.subscriptionPackId === 'individual') return false; // Will be handled by purchase button
    if (media.includeInSubscription) return isSubscribed;
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-3">
        <button className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium">
          All
        </button>
        <button className="px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full text-xs font-medium">
          Photos
        </button>
        <button className="px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full text-xs font-medium">
          Videos
        </button>
      </div>

      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-700"
        >
          {/* Post Header */}
          <div className="p-2.5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src={post.creator.avatar}
                  alt={post.creator.username}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <Link 
                  href={`/profile/${post.creator.username}`}
                  className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {post.creator.username}
                </Link>
                <p className="text-xs text-neutral-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Post Description */}
          <div className="px-2.5 py-2">
            <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
              {post.description}
            </p>
          </div>

          {/* Post Media */}
          {post.media && post.media.length > 0 && (
            <div className="relative">
              {post.media.map((media, index) => (
                <div key={index} className="relative">
                  {/* Media Content */}
                  <div className={`relative ${!canAccessContent(media) ? 'blur-lg' : ''}`}>
                    {media.type === 'video' ? (
                      <video
                        src={media.url}
                        controls={canAccessContent(media)}
                        poster={post.thumbnail}
                        className="w-full h-auto"
                      />
                    ) : media.type === 'vr' ? (
                      <div className="relative aspect-video bg-neutral-900">
                        <Image
                          src={media.url}
                          alt="VR Content"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-video">
                        <Image
                          src={media.url}
                          alt="Post content"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Access Overlay */}
                  {!canAccessContent(media) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white p-4">
                        {media.subscriptionPackId === 'individual' ? (
                          <>
                            <CurrencyDollarIcon className="w-6 h-6 mx-auto mb-1.5" />
                            <p className="text-base font-bold mb-1.5">${media.individualPrice}</p>
                            <button
                              onClick={() => onPurchaseContent?.(post.id, index)}
                              className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium hover:bg-primary-700 transition-colors"
                            >
                              Purchase Content
                            </button>
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-6 h-6 mx-auto mb-1.5" />
                            <p className="text-base font-bold mb-1.5">
                              Subscription Required
                            </p>
                            <button
                              onClick={onSubscribe}
                              className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium hover:bg-primary-700 transition-colors"
                            >
                              Subscribe to Access
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content Type Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${media.subscriptionPackId === 'free' ? 'bg-green-100 text-green-800' :
                        media.subscriptionPackId === 'individual' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'}
                    `}>
                      {media.type === 'vr' ? 'VR' :
                        media.type === 'video' ? 'Video' : 'Photo'} •{' '}
                      {media.subscriptionPackId === 'free' ? 'Free' :
                        media.subscriptionPackId === 'individual' ? `$${media.individualPrice}` :
                        'Subscription'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="p-2.5 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
              >
                {liked[post.id] ? (
                  <HeartIconSolid className="w-4 h-4 text-red-600" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
                <span className="ml-1 text-xs">{post.likes + (liked[post.id] ? 1 : 0)}</span>
              </button>
              <button className="flex items-center text-neutral-600 dark:text-neutral-400">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span className="ml-1 text-xs">{post.comments}</span>
              </button>
              <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                <EyeIcon className="w-4 h-4" />
                <span className="ml-1 text-xs">{post.views}</span>
              </div>
            </div>
            <button
              onClick={() => handleSave(post.id)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {saved[post.id] ? (
                <BookmarkIconSolid className="w-4 h-4 text-primary-600" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>
      ))}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={loadingRef} className="h-8" />

      {/* End of Feed */}
      {!hasMorePosts && (
        <div className="text-center py-6 text-neutral-500 text-sm">
          You've reached the end of your feed
        </div>
      )}
    </div>
  );
};

export default InfiniteFeed; 