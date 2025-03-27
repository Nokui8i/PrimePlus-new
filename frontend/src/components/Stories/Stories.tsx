import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Creator } from '@/types/story';

interface StoriesProps {
  followedCreators: Creator[];
  suggestedCreators?: Creator[];
}

export const Stories: React.FC<StoriesProps> = ({ followedCreators, suggestedCreators = [] }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setScrollPosition(storiesContainerRef.current.scrollLeft - 200);
    }
  };

  const scrollRight = () => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setScrollPosition(storiesContainerRef.current.scrollLeft + 200);
    }
  };

  // Use suggested creators if there are no followed creators
  const creatorsToShow = followedCreators.length > 0 ? followedCreators : suggestedCreators;

  return (
    <div className="relative">
      {/* Stories Container */}
      <div className="relative">
        <div
          ref={storiesContainerRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 px-4"
        >
          {/* Create Story Card */}
          <div className="flex-shrink-0 w-[120px] rounded-xl overflow-hidden cursor-pointer group relative">
            <div className="relative h-[200px] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
              <Image
                src="/mock/avatar1.jpg"  // Replace with user's avatar
                alt="Your Story"
                fill
                className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
              <div className="bg-primary-500 rounded-full w-9 h-9 flex items-center justify-center mx-auto mb-2 border-4 border-white dark:border-neutral-800">
                <PlusIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-white">Create Story</span>
            </div>
          </div>

          {/* Stories */}
          {creatorsToShow.map((creator) => (
            <div
              key={creator.id}
              className="flex-shrink-0 w-[120px] rounded-xl overflow-hidden cursor-pointer group relative"
            >
              {/* Story Preview */}
              <div className="relative h-[200px]">
                <Image
                  src={creator.stories[0]?.media.url || creator.avatar}
                  alt={creator.username}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
              </div>

              {/* Creator Avatar */}
              <div className="absolute top-3 left-3">
                <div className={`rounded-full p-1 ${
                  creator.hasNewStory
                    ? 'bg-gradient-to-tr from-primary-500 to-secondary-500'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }`}>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-neutral-800">
                    <Image
                      src={creator.avatar}
                      alt={creator.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Creator Name */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs font-medium text-white line-clamp-2">
                  {creator.username}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg hover:bg-white dark:hover:bg-neutral-700 transition-colors z-10"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg hover:bg-white dark:hover:bg-neutral-700 transition-colors z-10"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>
    </div>
  );
};

export default Stories; 