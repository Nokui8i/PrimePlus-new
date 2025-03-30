import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface AnalyticsData {
  subscribers: {
    total: number;
    active: number;
    new: number;
    churned: number;
  };
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    thumbnail: string;
  }>;
  audienceDemographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
}

const AnalyticsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    subscribers: {
      total: 0,
      active: 0,
      new: 0,
      churned: 0,
    },
    revenue: {
      total: 0,
      monthly: 0,
      growth: 0,
    },
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
    },
    topPosts: [],
    audienceDemographics: {
      ageGroups: {},
      locations: {},
      devices: {},
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user?.isCreator) {
      router.push('/');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/creator/analytics');
        const data = await response.json();
        setAnalytics(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [loading, user, router]);

  if (loading || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg ${
                  timeRange === range
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Subscribers</h3>
            <p className="text-2xl font-bold mt-2">{analytics.subscribers.total}</p>
            <p className="text-sm text-green-600 mt-1">
              +{analytics.subscribers.new} new, -{analytics.subscribers.churned} churned
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Monthly Revenue</h3>
            <p className="text-2xl font-bold mt-2">${analytics.revenue.monthly}</p>
            <p className="text-sm text-green-600 mt-1">
              {analytics.revenue.growth}% growth
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Engagement</h3>
            <p className="text-2xl font-bold mt-2">{analytics.engagement.views}</p>
            <p className="text-sm text-neutral-500 mt-1">
              {analytics.engagement.likes} likes, {analytics.engagement.comments} comments
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Subscribers</h3>
            <p className="text-2xl font-bold mt-2">{analytics.subscribers.active}</p>
            <p className="text-sm text-neutral-500 mt-1">
              {((analytics.subscribers.active / analytics.subscribers.total) * 100).toFixed(1)}% retention
            </p>
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Performing Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.topPosts.map((post) => (
              <div key={post.id} className="bg-neutral-50 dark:bg-neutral-900 rounded-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{post.title}</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm text-neutral-500">
                    <div>
                      <p className="font-medium">{post.views}</p>
                      <p>Views</p>
                    </div>
                    <div>
                      <p className="font-medium">{post.likes}</p>
                      <p>Likes</p>
                    </div>
                    <div>
                      <p className="font-medium">{post.comments}</p>
                      <p>Comments</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Age Distribution</h2>
            <div className="space-y-4">
              {Object.entries(analytics.audienceDemographics.ageGroups).map(([age, percentage]) => (
                <div key={age}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{age}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                    <div
                      className="h-full bg-primary-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Top Locations</h2>
            <div className="space-y-4">
              {Object.entries(analytics.audienceDemographics.locations).map(([location, percentage]) => (
                <div key={location}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{location}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                    <div
                      className="h-full bg-primary-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Device Usage</h2>
            <div className="space-y-4">
              {Object.entries(analytics.audienceDemographics.devices).map(([device, percentage]) => (
                <div key={device}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{device}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                    <div
                      className="h-full bg-primary-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage; 