import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MoreVertical, Plus, Trash2, Edit2, Lock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Collection, CollectionPost } from '../../types/collection';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import Pagination from '../../components/ui/Pagination';
import { formatDate } from '@/lib/utils';

const CollectionDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [posts, setPosts] = useState<CollectionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedCollection, setEditedCollection] = useState<Partial<Collection>>({});

  useEffect(() => {
    if (id) {
      fetchCollection();
      fetchPosts();
    }
  }, [id, currentPage]);

  const fetchCollection = async () => {
    try {
      const response = await fetch(`/api/collections/${id}`);
      if (!response.ok) throw new Error('Failed to fetch collection');
      const data = await response.json();
      setCollection(data);
    } catch (error) {
      showToast('Failed to load collection', 'error');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/collections/${id}/posts?page=${currentPage}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      showToast('Failed to load posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCollection),
      });

      if (!response.ok) throw new Error('Failed to update collection');
      
      const data = await response.json();
      setCollection(data);
      setIsEditModalOpen(false);
      setEditedCollection({});
      showToast('Collection updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update collection', 'error');
    }
  };

  const handleDeleteCollection = async () => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete collection');
      
      showToast('Collection deleted successfully', 'success');
      router.push('/collections');
    } catch (error) {
      showToast('Failed to delete collection', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton variant="rectangular" className="h-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Collection not found</h1>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="relative mb-8">
          <div className="h-64 rounded-lg overflow-hidden">
            {collection.coverImageUrl ? (
              <img
                src={collection.coverImageUrl}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Lock className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
                {collection.description && (
                  <p className="mt-2 text-white text-lg">{collection.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => router.push(`/posts/${post.postId}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              {post.post.thumbnailUrl ? (
                <img
                  src={post.post.thumbnailUrl}
                  alt={post.post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Lock className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{post.post.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {post.post.content}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Added {formatDate(post.addedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Collection"
        >
          <form onSubmit={handleUpdateCollection} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={editedCollection.name || collection.name}
                onChange={(e) => setEditedCollection({ ...editedCollection, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={editedCollection.description || collection.description || ''}
                onChange={(e) => setEditedCollection({ ...editedCollection, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={editedCollection.isPrivate ?? collection.isPrivate}
                onChange={(e) => setEditedCollection({ ...editedCollection, isPrivate: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                Make this collection private
              </label>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Update Collection
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Collection"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this collection? This action cannot be undone.
            </p>
            <div className="mt-5 sm:mt-6">
              <button
                onClick={handleDeleteCollection}
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
              >
                Delete Collection
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default CollectionDetailPage; 