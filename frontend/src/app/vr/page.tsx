'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  VideoCameraIcon,
  CubeIcon,
  PhotoIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/components/providers/AuthProvider';

interface VRContentCard {
  id: string;
  title: string;
  description: string;
  type: 'model' | '360-video' | '360-image';
  thumbnailUrl: string;
  creator: {
    name: string;
    avatar: string;
  };
  views: number;
  createdAt: string;
}

const mockContent: VRContentCard[] = [
  {
    id: '1',
    title: 'Virtual Art Gallery',
    description: 'Explore a curated collection of digital art in VR',
    type: 'model',
    thumbnailUrl: '/mock/vr-gallery.jpg',
    creator: {
      name: 'ArtSpace VR',
      avatar: '/mock/creator-avatar.jpg'
    },
    views: 1250,
    createdAt: '2024-02-20T10:00:00Z'
  },
  // Add more mock content as needed
];

export default function VRContentPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [selectedType, setSelectedType] = useState<'all' | 'model' | '360-video' | '360-image'>('all');

  const filteredContent = mockContent.filter(content => {
    if (selectedType === 'all') return true;
    return content.type === selectedType;
  });

  return (
    <MainLayout title="VR Content">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">VR Content</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore and create immersive VR experiences
              </p>
            </div>
            
            {user?.role === 'creator' && (
              <Link
                href="/vr/create"
                className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Content
              </Link>
            )}
          </div>

          {/* Content Type Filter */}
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span>All</span>
            </button>
            
            <button
              onClick={() => setSelectedType('model')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedType === 'model'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <CubeIcon className="w-5 h-5" />
              <span>3D Models</span>
            </button>
            
            <button
              onClick={() => setSelectedType('360-video')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedType === '360-video'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <VideoCameraIcon className="w-5 h-5" />
              <span>360° Videos</span>
            </button>
            
            <button
              onClick={() => setSelectedType('360-image')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedType === '360-image'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <PhotoIcon className="w-5 h-5" />
              <span>360° Images</span>
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map(content => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <Link href={`/vr/${content.id}`}>
                  {/* Thumbnail */}
                  <div className="aspect-video relative">
                    <img
                      src={content.thumbnailUrl}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-sm rounded-lg">
                      {content.type === 'model' ? '3D Model' :
                       content.type === '360-video' ? '360° Video' : '360° Image'}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {content.description}
                    </p>
                    
                    {/* Creator Info */}
                    <div className="flex items-center mt-4">
                      <img
                        src={content.creator.avatar}
                        alt={content.creator.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="ml-2">
                        <p className="text-sm font-medium">{content.creator.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <VideoCameraIcon className="w-4 h-4 mr-1" />
                        {content.views}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <VideoCameraIcon className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No content found</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {user?.role === 'creator'
                  ? 'Create your first VR content to get started!'
                  : 'No VR content matches your current filter.'}
              </p>
              {user?.role === 'creator' && (
                <Link
                  href="/vr/create"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Content
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
} 