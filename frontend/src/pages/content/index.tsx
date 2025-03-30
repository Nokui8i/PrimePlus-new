import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { vrContentService } from '@/api/vrContentApi';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

interface VRContentItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
  tags: string[];
  views: number;
  interactionCount: number;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
  };
}

export default function VRContentGallery() {
  const { user, isAuthenticated, loading } = useContext(UserContext);
  const [vrContent, setVRContent] = useState<VRContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    contentType: '',
    isPremium: ''
  });

  useEffect(() => {
    const fetchVRContent = async () => {
      try {
        setIsLoading(true);
        const activeFilters: any = {};
        
        if (filters.contentType) {
          activeFilters.contentType = filters.contentType;
        }
        
        if (filters.isPremium) {
          activeFilters.isPremium = filters.isPremium;
        }
        
        const response = await vrContentService.getAllVRContent(activeFilters);
        if (response.success) {
          setVRContent(response.data);
        } else {
          setError('Error loading VR content');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading VR content');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchVRContent();
    }
  }, [isAuthenticated, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading VR content...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view VR content</h1>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">VR Content Gallery</h1>
          
          {user?.role === 'creator' || user?.role === 'admin' ? (
            <Link href="/vr/create">
              <Button>Upload New VR Content</Button>
            </Link>
          ) : null}
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select
              name="contentType"
              value={filters.contentType}
              onChange={handleFilterChange}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="360">360 Degrees</option>
              <option value="interactive">Interactive</option>
              <option value="immersive">Immersive</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Tier
            </label>
            <select
              name="isPremium"
              value={filters.isPremium}
              onChange={handleFilterChange}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Content</option>
              <option value="true">Premium Only</option>
              <option value="false">Free Content</option>
            </select>
          </div>
        </div>
        
        {vrContent.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No VR content found</p>
            {user?.role === 'creator' || user?.role === 'admin' ? (
              <div className="mt-4">
                <Link href="/vr/create">
                  <Button>Create New VR Content</Button>
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vrContent.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <Link href={`/vr/${item.id}`}>
                  <div className="relative h-48 w-full bg-gray-200">
                    {item.mediaUrl ? (
                      <Image 
                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.mediaUrl}`} 
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Premium badge */}
                    {item.isPremium && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        PREMIUM
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/vr/${item.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  </Link>
                  
                  <Link href={`/creator/${item.creator.id}`}>
                    <p className="text-sm text-blue-600 mb-2">By {item.creator.fullName || item.creator.username}</p>
                  </Link>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span className="ml-1">{item.views}</span>
                    </div>
                    
                    <div>
                      {new Date(item.createdAt).toLocaleDateString('en-US')}
                    </div>
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}