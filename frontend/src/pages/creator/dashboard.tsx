import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalPosts: number;
  totalViews: number;
  engagementRate: number;
}

interface RecentActivity {
  id: string;
  type: 'subscription' | 'unsubscribe' | 'post' | 'comment';
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  details: string;
}

const CreatorDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalPosts: 0,
    totalViews: 0,
    engagementRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user?.isCreator) {
      router.push('/become-creator');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // TODO: Implement API calls to fetch dashboard data
        // For now, using mock data
        setStats({
          totalSubscribers: 150,
          activeSubscribers: 120,
          totalRevenue: 1500,
          monthlyRevenue: 450,
          totalPosts: 25,
          totalViews: 5000,
          engagementRate: 4.5,
        });

        setRecentActivity([
          {
            id: '1',
            type: 'subscription',
            user: {
              id: '1',
              username: 'user1',
              avatar: 'https://picsum.photos/100/100',
            },
            timestamp: '2 minutes ago',
            details: 'New subscriber',
          },
          {
            id: '2',
            type: 'post',
            user: {
              id: user?.id || '',
              username: user?.username || '',
              avatar: user?.avatar || '',
            },
            timestamp: '1 hour ago',
            details: 'Posted new content',
          },
          {
            id: '3',
            type: 'comment',
            user: {
              id: '2',
              username: 'user2',
              avatar: 'https://picsum.photos/100/100',
            },
            timestamp: '3 hours ago',
            details: 'Commented on your post',
          },
        ]);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    if (!loading && user?.isCreator) {
      fetchDashboardData();
    }
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
          <h1 className="text-2xl font-bold">Creator Dashboard</h1>
          <Link
            href="/create-post"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Create New Post
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Subscribers</h3>
            <p className="text-2xl font-bold mt-2">{stats.totalSubscribers}</p>
            <p className="text-sm text-green-600 mt-1">+{stats.activeSubscribers} active</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Monthly Revenue</h3>
            <p className="text-2xl font-bold mt-2">${stats.monthlyRevenue}</p>
            <p className="text-sm text-green-600 mt-1">Total: ${stats.totalRevenue}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Posts</h3>
            <p className="text-2xl font-bold mt-2">{stats.totalPosts}</p>
            <p className="text-sm text-neutral-500 mt-1">{stats.totalViews} total views</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Engagement Rate</h3>
            <p className="text-2xl font-bold mt-2">{stats.engagementRate}%</p>
            <p className="text-sm text-green-600 mt-1">+0.5% from last month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/creator/analytics"
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-neutral-500">View detailed analytics and insights</p>
          </Link>
          <Link
            href="/creator/content"
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Content Management</h3>
            <p className="text-sm text-neutral-500">Manage your posts and content</p>
          </Link>
          <Link
            href="/creator/subscribers"
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Subscribers</h3>
            <p className="text-sm text-neutral-500">View and manage your subscribers</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={activity.user.avatar}
                    alt={activity.user.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {activity.type === 'subscription' && (
                    <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.username}</span>{' '}
                    {activity.details}
                  </p>
                  <p className="text-xs text-neutral-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorDashboard; 