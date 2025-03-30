// Moving this file to /pages/index.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/MainLayout';
import InfiniteFeed from '@/components/feed/InfiniteFeed';
import { MOCK_POSTS, MOCK_CREATORS } from '@/services/mockData';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Stories from '@/components/Stories/Stories';

const useDropdownPosition = (searchContainerRef: React.RefObject<HTMLDivElement>) => {
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const updateDropdownPosition = () => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition);
    
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition);
    };
  }, []);

  return { dropdownPosition, updateDropdownPosition };
};

// Add mock data after other mock data
const mockFollowedCreators = [
  {
    id: '1',
    username: 'sarah_creative',
    avatar: '/mock/avatar1.jpg',
    isVerified: true,
    hasNewStory: true,
    stories: [
      {
        id: 's1',
        creatorId: '1',
        media: {
          url: '/mock/story1.jpg',
          type: 'image' as const,
          duration: 5
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        viewCount: 156,
        interactions: {
          likes: 45,
          replies: 12
        }
      }
    ]
  },
  {
    id: '2',
    username: 'mike_photos',
    avatar: '/mock/avatar2.jpg',
    isVerified: true,
    hasNewStory: true,
    stories: [
      {
        id: 's2',
        creatorId: '2',
        media: {
          url: '/mock/story2.jpg',
          type: 'image' as const,
          duration: 5
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        viewCount: 232,
        interactions: {
          likes: 89,
          replies: 8
        }
      }
    ]
  }
];

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [postText, setPostText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'posts' | 'users'>('users');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { dropdownPosition, updateDropdownPosition } = useDropdownPosition(searchContainerRef);

  // Filter suggestions based on search query
  const filteredSuggestions = searchType === 'users' 
    ? MOCK_CREATORS.filter(creator => 
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : MOCK_POSTS.filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Main Feed Column */}
            <div className="md:col-span-5 lg:col-span-6 xl:col-span-7">
              {/* Stories Section */}
              <div className="pt-3 sm:pt-4 pb-2">
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden">
                  <Stories
                    followedCreators={mockFollowedCreators}
                    suggestedCreators={MOCK_CREATORS.slice(0, 5).map(creator => ({
                      ...creator,
                      hasNewStory: false,
                      stories: [{
                        id: `story-${creator.id}`,
                        creatorId: creator.id,
                        media: {
                          url: creator.avatar,
                          type: 'image' as const,
                          duration: 5
                        },
                        createdAt: new Date(),
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        viewCount: 0,
                        interactions: {
                          likes: 0,
                          replies: 0
                        }
                      }]
                    }))}
                  />
                </div>
              </div>

              {/* Feed */}
              <div className="mt-4 sm:mt-6">
                <InfiniteFeed
                  initialPosts={MOCK_POSTS}
                  hasMore={false}
                  onLoadMore={() => {}}
                  isSubscribed={true}
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-3 lg:col-span-4 xl:col-span-5">
              <div className="sticky top-0 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                {/* Search Bar */}
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 relative">
                  <div className="p-2 sm:p-3">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <h2 className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100">Search</h2>
                        <div className="flex items-center bg-neutral-100 dark:bg-neutral-700/50 rounded-full p-0.5">
                          <button
                            onClick={() => {
                              setSearchType('users');
                              setSearchQuery('');
                              setShowSuggestions(false);
                            }}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                              searchType === 'users'
                                ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
                            }`}
                          >
                            <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Users</span>
                          </button>
                          <button
                            onClick={() => {
                              setSearchType('posts');
                              setSearchQuery('');
                              setShowSuggestions(false);
                            }}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                              searchType === 'posts'
                                ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
                            }`}
                          >
                            <DocumentTextIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Posts</span>
                          </button>
                        </div>
                      </div>
                      <div className="relative search-container" ref={searchContainerRef}>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true);
                            updateDropdownPosition();
                          }}
                          onFocus={() => {
                            setShowSuggestions(true);
                            updateDropdownPosition();
                          }}
                          placeholder={searchType === 'users' ? "Search users..." : "Search posts..."}
                          className="w-full pl-8 pr-3 py-1.5 text-sm sm:text-base border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                        />
                        <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 sm:h-5 sm:w-5 text-primary-500" />
                        
                        {/* Autocomplete Suggestions */}
                        {showSuggestions && searchQuery && dropdownPosition && (
                          <div 
                            ref={dropdownRef}
                            style={{
                              position: 'fixed',
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                              width: `${dropdownPosition.width}px`,
                              zIndex: 2147483647 // Maximum possible z-index
                            }}
                            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 max-h-[300px] overflow-auto shadow-2xl"
                          >
                            {filteredSuggestions.length > 0 ? (
                              filteredSuggestions.map((item, index) => (
                                <div
                                  key={item.id}
                                  onClick={() => {
                                    if (searchType === 'users') {
                                      router.push(`/profile/${item.id}`);
                                    } else {
                                      // Handle post click - scroll to post or open modal
                                      console.log('Post clicked:', item.id);
                                    }
                                    setShowSuggestions(false);
                                    setSearchQuery('');
                                  }}
                                  className="flex items-center space-x-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors"
                                >
                                  {searchType === 'users' ? (
                                    <>
                                      <Image
                                        src={(item as typeof MOCK_CREATORS[0]).avatar}
                                        alt={(item as typeof MOCK_CREATORS[0]).username}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full"
                                      />
                                      <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                          {(item as typeof MOCK_CREATORS[0]).username}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                          @{(item as typeof MOCK_CREATORS[0]).username.toLowerCase()}
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {(item as typeof MOCK_POSTS[0]).thumbnail && (
                                        <Image
                                          src={(item as typeof MOCK_POSTS[0]).thumbnail!}
                                          alt={(item as typeof MOCK_POSTS[0]).title || ''}
                                          width={48}
                                          height={32}
                                          className="w-12 h-8 rounded object-cover"
                                        />
                                      )}
                                      <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                          {(item as typeof MOCK_POSTS[0]).title}
                                        </p>
                                        <p className="text-xs text-neutral-500 line-clamp-1">
                                          {(item as typeof MOCK_POSTS[0]).description}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-sm text-neutral-500 text-center">
                                No {searchType} found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested Creators */}
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="p-2 sm:p-3">
                    <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-neutral-900 dark:text-neutral-100">Suggested Creators</h2>
                    <div className="space-y-2 sm:space-y-3">
                      {MOCK_CREATORS.slice(0, 3).map((creator) => (
                        <div key={creator.id} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden mb-2">
                            <Image
                              src={`https://picsum.photos/400/225?random=${creator.id}`}
                              alt={creator.username}
                              width={400}
                              height={225}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image
                              src={creator.avatar}
                              alt={creator.username}
                              width={24}
                              height={24}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                            />
                            <div>
                              <h3 className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100">{creator.username}</h3>
                              <p className="text-xs sm:text-sm text-neutral-500">@{creator.username.toLowerCase()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expired Subscriptions - lower z-index */}
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 relative z-[1]">
                  <div className="p-2 sm:p-3">
                    <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-rose-600 dark:text-rose-400">Expired Subscriptions</h2>
                    <div className="space-y-2 sm:space-y-3">
                      {MOCK_CREATORS.slice(0, 2).map((creator) => (
                        <div key={creator.id} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden mb-2">
                            <Image
                              src={`https://picsum.photos/400/225?random=${creator.id + 10}`}
                              alt={creator.username}
                              width={400}
                              height={225}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image
                              src={creator.avatar}
                              alt={creator.username}
                              width={24}
                              height={24}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                            />
                            <div>
                              <h3 className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100">{creator.username}</h3>
                              <p className="text-xs sm:text-sm text-neutral-500">@{creator.username.toLowerCase()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage; 