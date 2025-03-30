import React, { useEffect } from 'react';
import { useCreator } from '@/context/CreatorContext';

const AnalyticsDashboard: React.FC = () => {
  const { analytics, refreshAnalytics, loading } = useCreator();

  // Refresh analytics on component mount
  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  if (loading && !analytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">No analytics data available</div>
      </div>
    );
  }

  // Helper function to determine growth color
  const getGrowthClass = (value: number): string => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Parse growth as number
  const subscriberGrowth = parseFloat(analytics.subscribers.growth);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Analytics</h2>
        <button 
          onClick={() => refreshAnalytics()} 
          className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Refresh Data
        </button>
      </div>

      {/* Subscriber Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Subscribers</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-indigo-700">{analytics.subscribers.total}</span>
            <span className={`ml-3 ${getGrowthClass(subscriberGrowth)}`}>
              {subscriberGrowth > 0 ? '+' : ''}{analytics.subscribers.growth}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.subscribers.new} new this month
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Content</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-purple-700">{analytics.content.total}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.content.new} new this month
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Engagement</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-teal-700">
              {analytics.engagement.totalLikes + analytics.engagement.totalComments}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.engagement.totalLikes} likes, {analytics.engagement.totalComments} comments
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Subscriber Insights</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total Subscribers</span>
              <span className="font-semibold">{analytics.subscribers.total}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">New This Month</span>
              <span className="font-semibold">{analytics.subscribers.new}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Monthly Growth</span>
              <span className={`font-semibold ${getGrowthClass(subscriberGrowth)}`}>
                {subscriberGrowth > 0 ? '+' : ''}{analytics.subscribers.growth}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Engagement Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total Likes</span>
              <span className="font-semibold">{analytics.engagement.totalLikes}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total Comments</span>
              <span className="font-semibold">{analytics.engagement.totalComments}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Average Likes per Post</span>
              <span className="font-semibold">
                {analytics.engagement.averageLikes.toFixed(1)}
              </span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Average Comments per Post</span>
              <span className="font-semibold">
                {analytics.engagement.averageComments.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Data updated as of {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;