import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {
  FolderIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  BookmarkIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

// Types
interface Collection {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CollectionItem {
  id: string;
  title: string;
  thumbnail: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  type: 'post' | 'video' | 'image';
  savedAt: string;
}

const CollectionsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        setCollections(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setLoading(false);
      }
    };

    fetchCollections();
  }, [isAuthenticated, router]);

  const handleCreateCollection = async () => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCollectionName,
          description: newCollectionDescription,
          isPrivate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      const newCollection = await response.json();
      setCollections(prev => [...prev, newCollection]);
      setShowCreateModal(false);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setIsPrivate(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleSelectCollection = async (collection: Collection) => {
    try {
      const response = await fetch(`/api/collections/${collection.id}/items`);
      const data = await response.json();
      setSelectedCollection(collection);
      setCollectionItems(data);
    } catch (error) {
      console.error('Error fetching collection items:', error);
    }
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
    if (selectedCollection?.id === id) {
      setSelectedCollection(null);
      setCollectionItems([]);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Collections</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Collection</span>
          </motion.button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg cursor-pointer ${
                selectedCollection?.id === collection.id ? 'ring-2 ring-primary-600' : ''
              }`}
              onClick={() => handleSelectCollection(collection)}
            >
              <div className="relative h-48">
                <Image
                  src={collection.thumbnail}
                  alt={collection.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute top-2 right-2">
                  <div className="bg-black/50 rounded-full p-2">
                    <EllipsisHorizontalIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{collection.name}</h3>
                  {collection.isPrivate && (
                    <span className="text-xs bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500 mb-4">{collection.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>{collection.itemCount} items</span>
                  <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Collection Items */}
        {selectedCollection && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{selectedCollection.name}</h2>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  <ShareIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  <PencilIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteCollection(selectedCollection.id)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectionItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="relative h-48">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/50 rounded-full p-2">
                        <BookmarkIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={item.creator.avatar}
                        alt={item.creator.username}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm text-neutral-500">
                        {item.creator.username}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Create Collection Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md"
              >
                <h2 className="text-xl font-bold mb-4">Create New Collection</h2>
                <form onSubmit={handleCreateCollection}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 dark:bg-neutral-800"
                        placeholder="Enter collection name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={newCollectionDescription}
                        onChange={(e) => setNewCollectionDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 dark:bg-neutral-800"
                        placeholder="Enter collection description"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="private"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="private" className="text-sm">
                        Make collection private
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg"
                    >
                      Create Collection
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default CollectionsPage; 