import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';

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
  
  // Check if user has premium subscription
  const isPremiumUser = isAuthenticated && user && user.subscription && user.subscription.status === 'active';
  
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
    <aside className="w-full md:w-80 lg:w-96 space-y-8 p-4">
      {/* Premium Banner */}
      {isAuthenticated && !isPremiumUser && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white mb-6">
          <h3 className="font-bold text-lg mb-2">Upgrade to Premium</h3>
          <p className="text-sm mb-3">Get unlimited access to exclusive content from your favorite creators</p>
          <Link href="/premium" className="block text-center bg-white text-indigo-600 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition">
            Explore Plans
          </Link>
        </div>
      )}
      
      {/* Trending Content */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-bold text-lg mb-4">Trending Now</h3>
        <div className="space-y-4">
          {trendingContent.map((item) => (
            <div key={item.id} className="group">
              <Link href={`/content/${item.id}`} className="flex space-x-3">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-indigo-600">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    <Link href={`/creators/${item.creatorId}`} className="hover:underline">
                      {item.creatorName}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatNumber(item.views)} views</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Link href="/trending" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium block text-center mt-4">
          View All Trending
        </Link>
      </div>
      
      {/* Suggested Creators */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-bold text-lg mb-4">Creators to Follow</h3>
        <div className="space-y-4">
          {suggestedCreators.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between">
              <Link href={`/creators/${creator.username}`} className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={creator.avatar}
                    alt={creator.name}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium group-hover:text-indigo-600">{creator.name}</h4>
                  <p className="text-xs text-gray-500">{formatNumber(creator.subscribers)} subscribers</p>
                </div>
              </Link>
              <button 
                className={`text-xs font-medium py-1 px-3 rounded-full ${
                  creator.isSubscribed 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {creator.isSubscribed ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
        <Link href="/discover" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium block text-center mt-4">
          Discover More Creators
        </Link>
      </div>
      
      {/* Footer Links */}
      <div className="text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/help" className="hover:underline">Help Center</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
        <p className="mt-3">© 2023 PrimePlus+. All rights reserved.</p>
      </div>
    </aside>
  );
} 