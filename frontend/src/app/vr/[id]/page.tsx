'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import VRViewer from '@/components/VRViewer';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';

interface VRContent {
  id: string;
  title: string;
  description: string;
  type: 'model' | '360-video' | '360-image';
  mediaUrl: string;
  thumbnailUrl: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  isPremium: boolean;
  price: number;
  views: number;
  likes: number;
  createdAt: string;
  tags: string[];
  isLiked: boolean;
  isSaved: boolean;
  hasAccess: boolean;
}

// Mock data - replace with actual API call
const mockContent: VRContent = {
  id: '1',
  title: 'Virtual Art Gallery',
  description: 'Explore a curated collection of digital art in VR. Walk through beautifully designed virtual spaces and discover amazing artworks from talented creators around the world.',
  type: 'model',
  mediaUrl: '/mock/gallery.glb',
  thumbnailUrl: '/mock/vr-gallery.jpg',
  creator: {
    id: 'creator1',
    name: 'ArtSpace VR',
    avatar: '/mock/creator-avatar.jpg'
  },
  isPremium: true,
  price: 9.99,
  views: 1250,
  likes: 423,
  createdAt: '2024-02-20T10:00:00Z',
  tags: ['art', 'gallery', 'virtual-tour', 'digital-art'],
  isLiked: false,
  isSaved: false,
  hasAccess: false
};

export default function VRContentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [content, setContent] = useState<VRContent>(mockContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchContent = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setContent(mockContent);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.id) {
      fetchContent();
    } else {
      router.push('/vr');
    }
  }, [params?.id, router]);

  const handleLike = async () => {
    try {
      // TODO: Implement like API call
      setContent(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement save API call
      setContent(prev => ({
        ...prev,
        isSaved: !prev.isSaved
      }));
    } catch (error) {
      console.error('Error updating save:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      // TODO: Implement purchase API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setContent(prev => ({
        ...prev,
        hasAccess: true
      }));
      // TODO: Show success toast
    } catch (error) {
      console.error('Error purchasing content:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={content.title}>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Content Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <EyeIcon className="w-4 h-4" />
                  <span>{content.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {content.isLiked ? (
                  <HeartIconSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleSave}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {content.isSaved ? (
                  <BookmarkIconSolid className="w-6 h-6 text-primary-500" />
                ) : (
                  <BookmarkIcon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* VR Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {content.isPremium && !content.hasAccess ? (
              <div className="aspect-video relative">
                <img
                  src={content.thumbnailUrl}
                  alt={content.title}
                  className="w-full h-full object-cover filter blur-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <p className="text-white mb-4">
                      This is premium content. Purchase to access.
                    </p>
                    <button
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                    >
                      {isPurchasing ? (
                        <span className="flex items-center space-x-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          <span>Processing...</span>
                        </span>
                      ) : (
                        `Purchase for $${content.price}`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video">
                <VRViewer
                  mediaUrl={content.mediaUrl}
                  contentType={content.type}
                  title={content.title}
                />
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {content.description}
                </p>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <Link
                  href={`/profile/${content.creator.id}`}
                  className="flex items-center space-x-4 mb-4"
                >
                  <img
                    src={content.creator.avatar}
                    alt={content.creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{content.creator.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Creator</p>
                  </div>
                </Link>
                <button className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  Follow Creator
                </button>
              </div>

              {/* Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold mb-4">Content Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Views</span>
                    <span className="font-medium">{content.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Likes</span>
                    <span className="font-medium">{content.likes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Created</span>
                    <span className="font-medium">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
} 