'use client';

import React from 'react';
import VRViewer from '@/components/VRViewer';
import { motion } from 'framer-motion';
import { PlayIcon, ViewfinderCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/components/layouts/MainLayout';

const testContent = [
  {
    id: '1',
    title: '3D Model Example',
    mediaUrl: 'https://cdn.aframe.io/examples/models/virtualcity.glb',
    contentType: 'model' as const,
    description: 'A 3D model of a virtual city',
    icon: ViewfinderCircleIcon,
    isPremium: true
  },
  {
    id: '2',
    title: '360° Video Example',
    mediaUrl: 'https://cdn.aframe.io/videos/360.mp4',
    contentType: '360-video' as const,
    description: 'A 360-degree video experience',
    icon: PlayIcon,
    isPremium: false
  },
  {
    id: '3',
    title: '360° Image Example',
    mediaUrl: 'https://cdn.aframe.io/360-image-gallery-boilerplate/img/city.jpg',
    contentType: '360-image' as const,
    description: 'A 360-degree panoramic image',
    icon: PhotoIcon,
    isPremium: true
  }
];

export default function VRTestPage() {
  return (
    <MainLayout title="VR Content Examples">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-5">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                VR Content Examples
              </h1>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Experience different types of VR content with our interactive viewer
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800">
              <PlayIcon className="w-5 h-5 mr-2" />
              Create VR Content
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6">
            {testContent.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <content.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-neutral-900 dark:text-white">
                        {content.title}
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {content.description}
                      </p>
                    </div>
                    {content.isPremium && (
                      <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700">
                  <VRViewer
                    mediaUrl={content.mediaUrl}
                    contentType={content.contentType}
                    title={content.title}
                  />
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4 text-neutral-500 dark:text-neutral-400">
                      <span>• Click and drag to look around</span>
                      <span>• Scroll to zoom</span>
                      <span>• Double click for fullscreen</span>
                    </div>
                    <button className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                      View Details
                      <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
} 