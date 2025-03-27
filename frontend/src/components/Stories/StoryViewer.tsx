import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { XMarkIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import type { Creator, StoryItem } from '@/types/story';

interface StoryViewerProps {
  creator: Creator;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  creator,
  onClose,
  onNext,
  onPrevious,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const storyDuration = creator.stories[currentStoryIndex]?.media.duration || 5; // Default 5 seconds

  useEffect(() => {
    startProgress();
    return () => clearInterval(progressInterval.current);
  }, [currentStoryIndex]);

  const startProgress = () => {
    setProgress(0);
    clearInterval(progressInterval.current);
    
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          handleStoryEnd();
          return prev;
        }
        return prev + (100 / (storyDuration * 10)); // Update 10 times per second
      });
    }, 100);
  };

  const handleStoryEnd = () => {
    if (currentStoryIndex < creator.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (onNext) {
      onNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    
    if (touch.clientX < screenWidth / 2) {
      if (currentStoryIndex > 0) {
        setCurrentStoryIndex(prev => prev - 1);
      } else if (onPrevious) {
        onPrevious();
      }
    } else {
      handleStoryEnd();
    }
  };

  const currentStory = creator.stories[currentStoryIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white p-2"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      {/* Story Content */}
      <div className="w-full h-full max-w-md mx-auto relative">
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2">
          {creator.stories.map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: `${index === currentStoryIndex ? progress : index < currentStoryIndex ? 100 : 0}%`
                }}
              />
            </div>
          ))}
        </div>

        {/* Creator Info */}
        <div className="absolute top-8 left-0 right-0 flex items-center space-x-3 p-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={creator.avatar}
              alt={creator.username}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">{creator.username}</h3>
            <p className="text-white/70 text-sm">
              {new Date(currentStory.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Story Media */}
        <div
          className="w-full h-full"
          onTouchStart={handleTouchStart}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width / 2) {
              if (currentStoryIndex > 0) {
                setCurrentStoryIndex(prev => prev - 1);
              } else if (onPrevious) {
                onPrevious();
              }
            } else {
              handleStoryEnd();
            }
          }}
        >
          {currentStory.media.type === 'image' ? (
            <Image
              src={currentStory.media.url}
              alt=""
              fill
              className="object-contain"
            />
          ) : (
            <video
              src={currentStory.media.url}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
              onEnded={handleStoryEnd}
            />
          )}
        </div>

        {/* Interaction Buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4 p-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="text-white p-2"
          >
            {isLiked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
          </button>
          <button className="text-white p-2">
            <ChatBubbleLeftIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer; 