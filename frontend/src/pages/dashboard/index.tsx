import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/MainLayout';
import {
  UserIcon,
  ChartBarIcon,
  PhotoIcon,
  VideoCameraIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'text' | 'photo' | 'video' | 'vr';
  thumbnail?: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
}

interface Subscriber {
  id: string;
  name: string;
  username: string;
  avatar: string;
  date: string;
  tier: string;
}

const CreatorDashboardPage: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [recentSubscribers, setRecentSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, contentResponse, subscribersResponse] = await Promise.all([
          fetch('/api/creator/stats'),
          fetch('/api/creator/content/recent'),
          fetch('/api/creator/subscribers/recent')
        ]);

        const [statsData, contentData, subscribersData] = await Promise.all([
          statsResponse.json(),
          contentResponse.json(),
          subscribersResponse.json()
        ]);

        setStats(statsData);
        setRecentContent(contentData);
        setRecentSubscribers(subscribersData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get icon for content type
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon className="w-5 h-5" />;
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />;
      case 'vr':
        return <UserIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  return (
    <MainLayout title="Creator Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Creator Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage your content and monitor your performance
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Link 
              href="/create-post" 
              className="btn-primary py-2 px-4 flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-1.5" />
              Create Post
            </Link>
            
            <Link 
              href="/analytics" 
              className="btn-secondary py-2 px-4 flex items-center"
            >
              <ChartBarIcon className="w-5 h-5 mr-1.5" />
              Full Analytics
            </Link>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {stat.title}
                  </h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className={`ml-2 flex items-center text-sm ${
                      stat.change >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change >= 0 ? (
                        <ArrowUpIcon className="w-3 h-3 mr-0.5 flex-shrink-0" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3 mr-0.5 flex-shrink-0" />
                      )}
                      {Math.abs(stat.change)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Recent Content and Subscribers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Recent Content</h2>
                <Link href="/content" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {isLoading ? (
                <div className="p-6 flex justify-center">
                  <div className="w-10 h-10 border-4 border-neutral-200 dark:border-neutral-700 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div>
                  {recentContent.length > 0 ? (
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {recentContent.map((content) => (
                        <div key={content.id} className="px-6 py-4 flex items-start">
                          {content.thumbnail ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-700">
                              <Image
                                src={content.thumbnail}
                                alt={content.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                              {getContentTypeIcon(content.type)}
                            </div>
                          )}
                          
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                content.type === 'photo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                content.type === 'video' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                content.type === 'vr' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                              }`}>
                                {content.type.toUpperCase()}
                              </span>
                            </div>
                            
                            <h3 className="mt-1 text-sm font-medium text-neutral-900 dark:text-white truncate">
                              <Link href={`/edit-post/${content.id}`} className="hover:text-primary-600 transition">
                                {content.title}
                              </Link>
                            </h3>
                            
                            <div className="mt-1 flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                              <span>{formatDate(content.date)}</span>
                              <span className="mx-1.5">•</span>
                              <span>{content.views} views</span>
                              <span className="mx-1.5">•</span>
                              <span>{content.likes} likes</span>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <button className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300">
                              <EllipsisHorizontalIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        No content yet. Create your first post!
                      </p>
                      <Link 
                        href="/create-post" 
                        className="mt-4 btn-primary py-2 px-4 inline-flex items-center"
                      >
                        <PlusIcon className="w-5 h-5 mr-1.5" />
                        Create Post
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Subscribers */}
          <div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Recent Subscribers</h2>
                <Link href="/subscriptions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {isLoading ? (
                <div className="p-6 flex justify-center">
                  <div className="w-10 h-10 border-4 border-neutral-200 dark:border-neutral-700 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div>
                  {recentSubscribers.length > 0 ? (
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {recentSubscribers.map((subscriber) => (
                        <div key={subscriber.id} className="px-6 py-4 flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={subscriber.avatar}
                              alt={subscriber.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {subscriber.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              @{subscriber.username}
                            </p>
                          </div>
                          
                          <div className="ml-3 flex flex-col items-end">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {formatDate(subscriber.date)}
                            </span>
                            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                              {subscriber.tier}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        No subscribers yet. Share your profile to get started!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 bg-white dark:bg-neutral-800 rounded-xl shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Quick Actions</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 gap-4">
                <Link 
                  href="/settings/subscription-tiers" 
                  className="flex items-center p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  <div className="w-8 h-8 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      Manage Subscription Tiers
                    </p>
                  </div>
                </Link>
                
                <Link 
                  href="/messages" 
                  className="flex items-center p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      Message Subscribers
                    </p>
                  </div>
                </Link>
                
                <Link 
                  href="/analytics" 
                  className="flex items-center p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      View Detailed Analytics
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorDashboardPage; 