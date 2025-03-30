import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { MagnifyingGlassIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';

// Interfaces for the sidebar components
interface TrendingItem {
  id: string;
  title: string;
  views: number;
  thumbnail: string;
  creatorName: string;
  creatorId: string;
}

interface SuggestedCreator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  subscribers: number;
  isSubscribed: boolean;
}

export default function SuggestedSidebar() {
  const { isAuthenticated, user } = useUser();
  const [trendingContent, setTrendingContent] = useState<TrendingItem[]>([]);
  const [suggestedCreators, setSuggestedCreators] = useState<SuggestedCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'users' | 'posts'>('users');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Check if user has premium subscription
  const isPremiumUser = isAuthenticated && user?.isPremium;
  
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [trendingResponse, creatorsResponse] = await Promise.all([
          fetch('/api/content/trending'),
          fetch('/api/creators/suggested')
        ]);

        const [trendingData, creatorsData] = await Promise.all([
          trendingResponse.json(),
          creatorsResponse.json()
        ]);

        setTrendingContent(trendingData);
        setSuggestedCreators(creatorsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSidebarData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || loading) {
    return null;
  }
  
  // Format numbers for display (e.g., 12500 -> 12.5K)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  return (
    <aside className="fixed top-0 right-0 h-screen w-64 lg:w-72 pt-16 overflow-y-auto hide-scrollbar bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-sm border-l border-neutral-200/50 dark:border-neutral-700/50">
      <div className="space-y-1.5 px-0">
        {/* Search Bar */}
        <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm shadow-sm border-y border-neutral-200/50 dark:border-neutral-700/50">
          <div className="p-1.5">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">Search</h2>
                <div className="flex items-center bg-neutral-100 dark:bg-neutral-700/50 rounded-full p-0.5">
                  <button
                    onClick={() => {
                      setSearchType('users');
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className={`flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full text-[10px] transition-colors ${
                      searchType === 'users'
                        ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <UserIcon className="w-3 h-3" />
                    <span>Users</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchType('posts');
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className={`flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full text-[10px] transition-colors ${
                      searchType === 'posts'
                        ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <DocumentTextIcon className="w-3 h-3" />
                    <span>Posts</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={searchType === 'users' ? "Search users..." : "Search posts..."}
                  className="w-full pl-6 pr-2 py-0.5 text-[11px] border border-neutral-200/50 dark:border-neutral-700/50 rounded-md bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
                <MagnifyingGlassIcon className="absolute left-1.5 top-1 h-3 w-3 text-primary-500" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Suggested Creators */}
        <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm shadow-sm border-y border-neutral-200/50 dark:border-neutral-700/50">
          <div className="p-1.5">
            <h2 className="text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">Suggested Creators</h2>
            <div className="space-y-1.5">
              {suggestedCreators.slice(0, 3).map((creator) => (
                <div key={creator.id} className="relative group">
                  <div className="aspect-video overflow-hidden mb-1">
                    <Image
                      src={`https://picsum.photos/400/225?random=${creator.id}`}
                      alt={creator.name}
                      width={400}
                      height={225}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                    />
                    <div>
                      <h3 className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100">{creator.name}</h3>
                      <p className="text-[10px] text-neutral-500">@{creator.username.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 