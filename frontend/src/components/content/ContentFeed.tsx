import React, { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ContentCard from './ContentCard';
import { ContentItem, ContentType } from '@/types/content';
import Spinner from '@/components/ui/Spinner';

interface ContentFeedProps {
  items: ContentItem[];
  layout?: 'grid' | 'list';
  showFilters?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
  onFilterChange?: (filters: ContentFeedFilters) => void;
  currentUserId?: string;
}

interface ContentFeedFilters {
  type: ContentType | 'all';
  sort: 'recent' | 'popular' | 'trending';
  isPremium: boolean;
}

const ContentFeed: React.FC<ContentFeedProps> = ({
  items,
  layout = 'grid',
  showFilters = true,
  emptyMessage = 'No content available',
  isLoading = false,
  onFilterChange,
  currentUserId,
}) => {
  const [filters, setFilters] = useState<ContentFeedFilters>({
    type: 'all',
    sort: 'recent',
    isPremium: false,
  });

  const handleFilterChange = (key: keyof ContentFeedFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Filter options
  const contentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'text', label: 'Text' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                id="content-type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort-by"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value as 'recent' | 'popular' | 'trending')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end md:w-auto w-full">
              <div className="flex items-center h-10">
                <input
                  id="premium-only"
                  type="checkbox"
                  checked={filters.isPremium}
                  onChange={(e) => handleFilterChange('isPremium', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="premium-only" className="ml-2 block text-sm text-gray-700">
                  Premium Only
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'gap-4'}`}>
        {items.map((item) => (
          <ContentCard
            key={item.id}
            content={item}
            layout={layout}
            isCreator={currentUserId === item.creator.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentFeed;