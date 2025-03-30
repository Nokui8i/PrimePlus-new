import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { contentService } from '@/services/contentService';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import PremiumContentPaywall from '@/components/content/PremiumContentPaywall';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  isPublished: boolean;
  isPremium: boolean;
  price: number;
  views: number;
  likes: number;
  createdAt: string;
  userId: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}

export default function ContentDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated, loading } = useContext(UserContext);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [creatorId, setCreatorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await contentService.getContentById(id as string);
        if (response.success) {
          setContent(response.data);
        } else if (response.isPremium) {
          // אם התוכן הוא פרימיום והמשתמש אין לו גישה
          setAccessDenied(true);
          setCreatorId(response.creatorId);
        } else {
          setError('Failed to load content');
        }
      } catch (err: any) {
        // בדוק אם השגיאה היא בגלל גישה מוגבלת (403)
        if (err.response && err.response.status === 403 && err.response.data.isPremium) {
          setAccessDenied(true);
          setCreatorId(err.response.data.creatorId);
        } else {
          setError(err.message || 'An error occurred while fetching content');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchContent();
    }
  }, [isAuthenticated, id]);

  const handleDelete = async () => {
    if (!content || !window.confirm('Are you sure you want to delete this content?')) {
      return;
    }
    
    try {
      const response = await contentService.deleteContent(content.id);
      if (response.success) {
        alert('Content deleted successfully');
        router.push('/content');
      } else {
        setError('Failed to delete content');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting content');
    }
  };

  const handleRefreshAfterSubscribe = () => {
    // רענן את הדף לאחר רכישת מנוי
    if (id) {
      router.reload();
    }
  };

  const isOwner = content && user && content.userId === user.id;
  const isAdmin = user && user.role === 'admin';
  
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading content...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Sign in to view content</h1>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-md mb-6 max-w-md">
          <p className="text-red-700">{error}</p>
        </div>
        <Link href="/content">
          <Button>Back to Content Gallery</Button>
        </Link>
      </div>
    );
  }

  if (accessDenied && creatorId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/content">
            <Button variant="outline" size="sm">
              ← Back to Gallery
            </Button>
          </Link>
        </div>
        
        <PremiumContentPaywall 
          contentId={id as string} 
          creatorId={creatorId}
          onSubscribe={handleRefreshAfterSubscribe}
        />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Content not found</h1>
        <Link href="/content">
          <Button>Back to Content Gallery</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/content">
            <Button variant="outline" size="sm">
              ← Back to Gallery
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
                <Link href={`/creator/${content.creator.id}`}>
                  <p className="text-blue-600 mb-4">By {content.creator.fullName || content.creator.username}</p>
                </Link>
              </div>
              
              {content.isPremium && (
                <div className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                  PREMIUM
                </div>
              )}
            </div>
            
            <div className="mb-6 text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span>{content.views} views</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              {content.contentType === 'image' && content.mediaUrl && (
                <div className="relative w-full h-96">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${content.mediaUrl}`} 
                    alt={content.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              
              {content.contentType === 'video' && content.mediaUrl && (
                <video
                  src={`${process.env.NEXT_PUBLIC_API_URL}${content.mediaUrl}`}
                  controls
                  className="w-full max-h-96"
                ></video>
              )}
              
              {content.contentType === 'audio' && content.mediaUrl && (
                <audio
                  src={`${process.env.NEXT_PUBLIC_API_URL}${content.mediaUrl}`}
                  controls
                  className="w-full"
                ></audio>
              )}
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-line">{content.description}</p>
            </div>
            
            {(isOwner || isAdmin) && (
              <div className="flex space-x-4 pt-4 border-t">
                <Link href={`/content/edit/${content.id}`}>
                  <Button variant="outline">Edit Content</Button>
                </Link>
                <Button variant="outline" onClick={handleDelete}>Delete Content</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}