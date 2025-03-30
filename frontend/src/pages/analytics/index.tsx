import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '@/hooks/useAnalytics';
import Button from '@/components/ui/Button';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { 
  LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';

// תאריכי טווח אפשריים לסינון
type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';

// סוגי נתונים
interface StatsData {
  totalSubscribers: number;
  newSubscribers: number;
  subscribersChange: number;
  totalViews: number;
  viewsChange: number;
  totalRevenue: number;
  revenueChange: number;
  contentCount: number;
  averageEngagement: number;
}

// נתוני איזורים
interface RegionData {
  name: string;
  subscribers: number;
  percentage: number;
}

// נתוני פוסט
interface PostStats {
  id: string;
  title: string;
  published: string;
  views: number;
  engagement: number;
  likes: number;
  comments: number;
  type: 'text' | 'photo' | 'video' | 'vr';
}

// נתוני הכנסות חודשיות
interface MonthlyRevenue {
  month: string;
  revenue: number;
  subscriptions: number;
  tips: number;
}

const AnalyticsPage: NextPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useContext(UserContext);
  const { getDashboardAnalytics, isLoading: isLoadingAnalytics } = useAnalytics();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [timespan, setTimespan] = useState('30'); // Default to 30 days
  const [error, setError] = useState(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`/api/analytics?timespan=${timespan}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setDashboardData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch analytics data');
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timespan]);
  
  // פונקציית עזר לפורמט מספרים
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };
  
  // פונקציית עזר לפורמט כסף
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // פונקציית עזר לפורמט תאריך
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // חישוב גובה תרשים עמודות
  const calculateBarHeight = (value: number, maxValue: number): number => {
    return (value / maxValue) * 100;
  };
  
  // אייקון עבור סוג הפוסט
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <ChartBarIcon className="w-5 h-5" />;
      case 'photo':
        return <EyeIcon className="w-5 h-5" />;
      case 'video':
        return <ChartBarIcon className="w-5 h-5" />;
      case 'vr':
        return <ChartBarIcon className="w-5 h-5" />;
      default:
        return <ChartBarIcon className="w-5 h-5" />;
    }
  };
  
  // סטייט עבור מצב טעינה
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <MainLayout title="Analytics">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Creator Analytics</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track your performance, subscribers, and revenue
            </p>
          </div>
          
          {/* בחירת טווח תאריכים */}
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-5 h-5 text-neutral-500" />
              <select
                value={timespan}
                onChange={(e) => setTimespan(e.target.value)}
                className="form-select py-2"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* מצב טעינה */}
        {isLoading ? (
          <div className="flex justify-center my-32">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-300 dark:border-neutral-600 border-t-primary-600 animate-spin"></div>
          </div>
        ) : (
          <>
            {/* שורת קארדים עם נתונים עיקריים */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* מנויים */}
              <div className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Subscribers</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold">{formatNumber(dashboardData.metrics[0].value)}</p>
                      <span className={`ml-2 text-sm font-medium ${
                        dashboardData.metrics[0].change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.metrics[0].change >= 0 ? (
                          <ArrowUpIcon className="inline w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownIcon className="inline w-3 h-3 mr-0.5" />
                        )}
                        {Math.abs(dashboardData.metrics[0].change)}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatNumber(dashboardData.metrics[0].newSubscribers)} new
                    </p>
                  </div>
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                    <UsersIcon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
              
              {/* צפיות */}
              <div className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Views</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold">{formatNumber(dashboardData.metrics[1].value)}</p>
                      <span className={`ml-2 text-sm font-medium ${
                        dashboardData.metrics[1].change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.metrics[1].change >= 0 ? (
                          <ArrowUpIcon className="inline w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownIcon className="inline w-3 h-3 mr-0.5" />
                        )}
                        {Math.abs(dashboardData.metrics[1].change)}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Across {dashboardData.metrics[1].contentCount} posts
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <EyeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              {/* הכנסות */}
              <div className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Revenue</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold">{formatCurrency(dashboardData.metrics[2].value)}</p>
                      <span className={`ml-2 text-sm font-medium ${
                        dashboardData.metrics[2].change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.metrics[2].change >= 0 ? (
                          <ArrowUpIcon className="inline w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownIcon className="inline w-3 h-3 mr-0.5" />
                        )}
                        {Math.abs(dashboardData.metrics[2].change)}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatCurrency(dashboardData.metrics[2].totalRevenue / (timespan === '7d' ? 7 : 30))} avg. daily
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              {/* מעורבות */}
              <div className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Avg. Engagement</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold">{dashboardData.metrics[3].value}%</p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Likes, comments, shares
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                    <ChartBarIcon className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* תרשימים ונתונים נוספים */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* תרשים הכנסות */}
              <div className="lg:col-span-2 card p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
                <div className="h-80">
                  <div className="flex h-64 items-end space-x-2 rtl:space-x-reverse">
                    {dashboardData.monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="relative w-full flex flex-col items-center">
                          <div
                            className="w-full bg-green-100 dark:bg-green-900/30 rounded-t"
                            style={{ height: `${calculateBarHeight(item.subscriptions, 800)}%` }}
                          ></div>
                          <div
                            className="w-full bg-primary-100 dark:bg-primary-900/30 mt-px"
                            style={{ height: `${calculateBarHeight(item.tips, 800)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium text-neutral-500 mt-2">{item.month}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 mr-2"></div>
                        <span className="text-xs text-neutral-500">Subscriptions</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary-100 dark:bg-primary-900/30 mr-2"></div>
                        <span className="text-xs text-neutral-500">Tips</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* התפלגות מנויים לפי איזור */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Subscribers by Region</h3>
                <div className="space-y-4">
                  {dashboardData.regions.map((region, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm font-medium">{region.name}</div>
                        <div className="text-sm text-neutral-500">{region.percentage}%</div>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* פוסטים מובילים */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Top Performing Posts</h3>
                <Link href="/analytics/posts" className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm font-medium flex items-center">
                  View all posts
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
                      <th className="pb-3 font-medium">Post Title</th>
                      <th className="pb-3 font-medium">Published</th>
                      <th className="pb-3 font-medium text-right">Views</th>
                      <th className="pb-3 font-medium text-right">Engagement</th>
                      <th className="pb-3 font-medium text-right">Likes</th>
                      <th className="pb-3 font-medium text-right">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topPosts.map((post, index) => (
                      <tr key={post.id} className={`${
                        index < dashboardData.topPosts.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-700' : ''
                      }`}>
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              post.type === 'photo' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                              post.type === 'video' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                              post.type === 'vr' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                              'bg-neutral-100 text-neutral-600 dark:bg-neutral-800'
                            }`}>
                              {getPostTypeIcon(post.type)}
                            </div>
                            <span className="font-medium line-clamp-1">{post.title}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                          {formatDate(post.published)}
                        </td>
                        <td className="py-4 text-right font-medium">
                          {formatNumber(post.views)}
                        </td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            post.engagement > 7 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            post.engagement > 5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                            'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                          }`}>
                            {post.engagement}%
                          </span>
                        </td>
                        <td className="py-4 text-right text-sm text-neutral-500 dark:text-neutral-400">
                          {formatNumber(post.likes)}
                        </td>
                        <td className="py-4 text-right text-sm text-neutral-500 dark:text-neutral-400">
                          {formatNumber(post.comments)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* כפתורי פעולה מהירה */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/analytics/subscribers" className="card p-6 hover:border-primary-500 transition flex items-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Subscriber Details</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    View detailed subscriber statistics
                  </p>
                </div>
                <ChevronDownIcon className="w-5 h-5 ml-auto text-neutral-400" />
              </Link>
              
              <Link href="/analytics/revenue" className="card p-6 hover:border-primary-500 transition flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                  <CurrencyDollarIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Revenue Report</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Detailed earnings breakdown
                  </p>
                </div>
                <ChevronDownIcon className="w-5 h-5 ml-auto text-neutral-400" />
              </Link>
              
              <Link href="/analytics/content" className="card p-6 hover:border-primary-500 transition flex items-center">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                  <ChartBarIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Content Performance</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Analyze your content metrics
                  </p>
                </div>
                <ChevronDownIcon className="w-5 h-5 ml-auto text-neutral-400" />
              </Link>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
