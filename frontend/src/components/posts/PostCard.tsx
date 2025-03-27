import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaBookmark } from 'react-icons/fa';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  isFollowing: boolean;
}

interface Post {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'text';
  thumbnail?: string;
  creator: Creator;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  isPremium: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  formatDate: (date: string) => string;
  getPostTypeIcon: (type: string) => React.ReactNode;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onSave,
  formatDate,
  getPostTypeIcon
}) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
      {post.thumbnail && (
        <div className="relative h-48">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
          {post.isPremium && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
              Premium
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={post.creator.avatar}
              alt={post.creator.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <Link
              href={`/creators/${post.creator.id}`}
              className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400"
            >
              {post.creator.name}
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="block group">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {post.title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2">
            {post.description}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1 text-sm"
            >
              <FaHeart
                size={16}
                color={post.isLiked ? '#ef4444' : '#6b7280'}
              />
              <span className={post.isLiked ? 'text-red-500' : 'text-neutral-600 dark:text-neutral-400'}>
                {post.likes}
              </span>
            </button>
            <button
              onClick={() => onSave(post.id)}
              className="flex items-center gap-1 text-sm"
            >
              <FaBookmark
                size={16}
                color={post.isSaved ? '#2563eb' : '#6b7280'}
              />
            </button>
          </div>
          <div className="text-neutral-500 dark:text-neutral-400">
            {getPostTypeIcon(post.type)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 