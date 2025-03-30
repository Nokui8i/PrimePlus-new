import React from 'react';
import Link from 'next/link';
import { FaHashtag } from 'react-icons/fa';

interface Tag {
  id: string;
  name: string;
  postsCount: number;
  isFollowing: boolean;
}

interface TagCardProps {
  tag: Tag;
}

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  // Format post count
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Link
      href={`/tags/${tag.name}`}
      className="bg-white dark:bg-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center mb-2">
        <FaHashtag size={20} color="#2563eb" />
        <h3 className="font-medium text-lg ml-2">{tag.name}</h3>
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {formatNumber(tag.postsCount)} posts
      </p>
      {tag.isFollowing && (
        <div className="mt-2 text-xs text-primary-600 dark:text-primary-400">
          Following
        </div>
      )}
    </Link>
  );
};

export default TagCard; 