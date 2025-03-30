'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  TagIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface VRContent {
  id: string;
  title: string;
  description: string;
  type: 'model' | '360-video' | '360-image';
  thumbnailUrl: string;
  status: 'draft' | 'published' | 'scheduled';
  isPremium: boolean;
  price: number;
  views: number;
  createdAt: string;
  publishedAt: string | null;
  scheduledFor: string | null;
  tags: string[];
}

const mockVRContent: VRContent[] = [
  {
    id: '1',
    title: 'Virtual Art Gallery',
    description: 'Explore a curated collection of digital art in VR',
    type: 'model',
    thumbnailUrl: '/mock/vr-gallery.jpg',
    status: 'published',
    isPremium: true,
    price: 9.99,
    views: 1250,
    createdAt: '2024-02-20T10:00:00Z',
    publishedAt: '2024-02-21T15:30:00Z',
    scheduledFor: null,
    tags: ['art', 'gallery', 'virtual-tour']
  },
  // Add more mock content as needed
];

export default function ManageVRContent() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<VRContent['status'] | 'all'>('all');
  const [selectedType, setSelectedType] = useState<VRContent['type'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredContent = mockVRContent.filter(content => {
    if (selectedStatus !== 'all' && content.status !== selectedStatus) return false;
    if (selectedType !== 'all' && content.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        content.title.toLowerCase().includes(query) ||
        content.description.toLowerCase().includes(query) ||
        content.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    setIsDeleting(true);
    try {
      // TODO: Implement actual delete logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh the list
      router.refresh();
    } catch (error) {
      console.error('Error deleting content:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout title="Manage VR Content">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage VR Content</h1>
            <Link
              href="/vr/create"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create New Content
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              />
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as VRContent['status'] | 'all')}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as VRContent['type'] | 'all')}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              >
                <option value="all">All Types</option>
                <option value="model">3D Models</option>
                <option value="360-video">360° Videos</option>
                <option value="360-image">360° Images</option>
              </select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map(content => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="aspect-video relative">
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  {content.isPremium && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-primary-500 text-white text-sm rounded-full">
                      Premium
                    </div>
                  )}
                  <div className={`
                    absolute bottom-2 left-2 px-2 py-1 rounded-full text-sm
                    ${content.status === 'published' ? 'bg-green-500 text-white' :
                      content.status === 'draft' ? 'bg-gray-500 text-white' :
                      'bg-yellow-500 text-white'}
                  `}>
                    {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {content.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{content.views}</span>
                    </div>
                    {content.isPremium && (
                      <div className="flex items-center space-x-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        <span>${content.price}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/vr/${content.id}`}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/vr/${content.id}/edit`}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(content.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No content found matching your filters.</p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
} 