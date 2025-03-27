import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  isFollowing: boolean;
}

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  // Format follower count
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
      href={`/creators/${creator.id}`}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 flex items-start hover:shadow-md transition-shadow"
    >
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={creator.avatar}
          alt={creator.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center">
          <h3 className="font-medium text-neutral-900 dark:text-white truncate">
            {creator.name}
          </h3>
          {creator.isFollowing && (
            <FaCheck size={16} color="#2563eb" style={{ marginLeft: '0.25rem', flexShrink: 0 }} />
          )}
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
          {creator.bio}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {formatNumber(creator.followers)} followers
        </p>
      </div>
    </Link>
  );
};

export default CreatorCard; 