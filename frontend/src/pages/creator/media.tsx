import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  createdAt: string;
  size: number;
  status: 'processing' | 'ready' | 'error';
}

const MediaPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  useEffect(() => {
    if (!loading && !user?.isCreator) {
      router.push('/become-creator');
      return;
    }

    const fetchMedia = async () => {
      try {
        // TODO: Implement API call to fetch media items
        // For now, using mock data
        setMedia([
          {
            id: '1',
            type: 'image',
            url: 'https://picsum.photos/800/600',
            thumbnail: 'https://picsum.photos/400/300',
            title: 'Summer Collection',
            description: 'Latest summer fashion collection',
            createdAt: '2024-03-20',
            size: 2048576,
            status: 'ready',
          },
          {
            id: '2',
            type: 'video',
            url: 'https://example.com/video.mp4',
            thumbnail: 'https://picsum.photos/400/300',
            title: 'Behind the Scenes',
            description: 'Making of the summer collection',
            createdAt: '2024-03-19',
            size: 10485760,
            status: 'ready',
          },
          {
            id: '3',
            type: 'image',
            url: 'https://picsum.photos/800/600',
            thumbnail: 'https://picsum.photos/400/300',
            title: 'Product Showcase',
            description: 'Featured products from the collection',
            createdAt: '2024-03-18',
            size: 3072256,
            status: 'processing',
          },
        ]);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media items');
        setIsLoading(false);
      }
    };

    if (!loading && user?.isCreator) {
      fetchMedia();
    }
  }, [loading, user, router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // TODO: Implement actual file upload logic
      // Simulating upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(i);
      }

      // Add new media items to the list
      const newMedia: MediaItem[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file),
        title: file.name,
        description: '',
        createdAt: new Date().toISOString(),
        size: file.size,
        status: 'processing',
      }));

      setMedia(prev => [...newMedia, ...prev]);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Implement API call to delete media
      setMedia(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media');
    }
  };

  const handleBulkDelete = async () => {
    try {
      // TODO: Implement API call to delete multiple media items
      setMedia(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete selected items');
    }
  };

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
          <h1 className="text-2xl font-bold">Media Management</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg px-4 py-2"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Upload Media</span>
            </label>
            <p className="text-sm text-neutral-500 mt-2">
              Drag and drop files here, or click to select files
            </p>
          </div>
          {isUploading && (
            <div className="mt-4">
              <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Media Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        }
                      }}
                      className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center text-sm text-neutral-500">
                    <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Preview</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {media.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-200 dark:border-neutral-700">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-neutral-500">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {(item.size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.id]);
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                            }
                          }}
                          className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600"
                        />
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MediaPage; 