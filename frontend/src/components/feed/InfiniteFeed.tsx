import React, { useState, useEffect } from 'react';

interface BasePost {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  likes: number;
  views: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  username: string;
  avatar?: string;
}

interface PostMedia {
  url: string;
  type: 'vr' | 'image' | 'video';
  thumbnail: string;
  subscriptionPackId: string | null;
  includeInSubscription: boolean;
  individualPrice?: number;
}

interface Creator {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: number;
  posts: number;
  isVerified: boolean;
}

interface LocalPost extends BasePost {
  isEditing: boolean;
  creator: Creator;
  media?: PostMedia[];
  comments: Comment[];
}

interface InfiniteFeedProps {
  initialPosts: LocalPost[];
  hasMore: boolean;
  onLoadMore: () => void;
  isSubscribed?: boolean;
  subscriptionTier?: 'none' | 'basic' | 'premium' | 'vr';
  onSubscribe?: () => void;
  onPurchaseContent?: (postId: string, mediaIndex: number) => void;
  creatorId?: string;
}

const InfiniteFeed: React.FC<InfiniteFeedProps> = ({
  initialPosts,
  hasMore,
  onLoadMore,
  isSubscribed = false,
  subscriptionTier = 'none',
  onSubscribe,
  onPurchaseContent,
  creatorId
}) => {
  const [posts, setPosts] = useState<LocalPost[]>(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          {/* Post header */}
          <div className="p-4 flex items-center space-x-3">
            <img
              src={post.creator.avatar}
              alt={post.creator.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {post.creator.username}
              </h3>
              <p className="text-sm text-neutral-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Post content */}
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-neutral-600 dark:text-neutral-300">{post.description}</p>
          </div>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-700">
              {post.media.map((media, index) => (
                <div key={index} className="relative">
                  {media.type === 'image' && (
                    <img
                      src={media.url}
                      alt={post.title}
                      className="w-full h-auto"
                    />
                  )}
                  {media.type === 'video' && (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-auto"
                      poster={media.thumbnail}
                    />
                  )}
                  {media.type === 'vr' && (
                    <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                      <span className="text-neutral-500">VR Content</span>
                    </div>
                  )}

                  {/* Purchase overlay */}
                  {!isSubscribed && media.individualPrice && media.individualPrice > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <p className="text-base font-bold mb-1.5">${media.individualPrice}</p>
                        <button
                          onClick={() => onPurchaseContent?.(post.id, index)}
                          className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium hover:bg-primary-700 transition-colors"
                        >
                          Purchase
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Post stats */}
          <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center space-x-6 text-sm text-neutral-500">
            <span>{post.likes} likes</span>
            <span>{post.comments.length} comments</span>
            <span>{post.views} views</span>
          </div>
        </div>
      ))}

      {/* Load more */}
      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default InfiniteFeed; 