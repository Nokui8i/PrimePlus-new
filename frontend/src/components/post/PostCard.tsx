import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, EyeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { containers, typography, contentSizes, commonStyles, components } from '@/styles/design-system';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import type { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  onTip?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isSubscribed = false,
  onSubscribe,
  onTip
}) => {
  const {
    title,
    content,
    creator,
    createdAt,
    media,
    likes,
    comments,
    views,
    isPremium
  } = post;

  return (
    <article className={`${containers.post} overflow-hidden`}>
      {/* Post Header */}
      <div className={`${commonStyles.cardHeader} p-4`}>
        <div className="flex items-center space-x-3">
          <div className={`relative ${contentSizes.profile.avatar.md} rounded-full overflow-hidden`}>
            {creator.avatar ? (
              <Image
                src={creator.avatar}
                alt={creator.username}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <PlaceholderImage
                type="avatar"
                text={creator.username.charAt(0).toUpperCase()}
              />
            )}
          </div>
          <div>
            <h3 className={typography.heading.h4}>{creator.username}</h3>
            <p className={`${typography.body.small} text-neutral-500`}>
              {format(new Date(createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        {isPremium && !isSubscribed && (
          <div className="flex items-center">
            <LockClosedIcon className="w-4 h-4 text-primary-500" />
            <span className={`${typography.body.small} text-primary-500 ml-1`}>Premium</span>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className={`${commonStyles.cardContent} px-4`}>
        <h2 className={typography.heading.h3}>{title}</h2>
        <p className={`${typography.body.base} text-neutral-700 dark:text-neutral-300`}>
          {content}
        </p>
      </div>

      {/* Post Media */}
      {media && media.length > 0 && (
        <div className="mt-4">
          <div className="relative aspect-video">
            {media[0].url ? (
              <Image
                src={media[0].url}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              <PlaceholderImage
                type="cover"
                text="Media not available"
                width={768}
                height={432}
              />
            )}
          </div>
        </div>
      )}

      {/* Post Footer */}
      <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-700">
              <HeartIcon className="w-5 h-5" />
              <span className={typography.body.small}>{likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-700">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className={typography.body.small}>{comments}</span>
            </button>
            <div className="flex items-center space-x-1 text-neutral-500">
              <EyeIcon className="w-5 h-5" />
              <span className={typography.body.small}>{views}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isPremium && !isSubscribed ? (
              <button
                onClick={onSubscribe}
                className={`${components.button.base} ${components.button.sizes.sm} ${components.button.variants.primary}`}
              >
                Subscribe to View
              </button>
            ) : (
              <button
                onClick={onTip}
                className={`${components.button.base} ${components.button.sizes.sm} ${components.button.variants.outline}`}
              >
                Send Tip
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard; 