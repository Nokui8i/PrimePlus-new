import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { userService } from '@/services/api';
import { contentService } from '@/services/contentService';
import { vrContentService } from '@/api/vrContentApi';
import { paymentService } from '@/services/paymentService';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import ContentGallery from '@/components/creator/ContentGallery';
import CreatorStats from '@/components/creator/CreatorStats';
import Tabs, { TabPanel } from '@/components/ui/tabs/Tabs';

interface Creator {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  bio: string;
  role: string;
  createdAt: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  isPublished: boolean;
  isPremium: boolean;
  views: number;
  createdAt: string;
}

interface CreatorStats {
  subscriberCount: number;
  contentCount: number;
  totalViews: number;
  joinDate: string;
}

export default function CreatorProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated, loading } = useContext(UserContext);
  
  // States
  const [creator, setCreator] = useState<Creator | null>(null);
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [regularContent, setRegularContent] = useState<ContentItem[]>([]);
  const [vrContent, setVRContent] = useState<ContentItem[]>([]);
  const [photoContent, setPhotoContent] = useState<ContentItem[]>([]);
  const [videoContent, setVideoContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const [tipAmount, setTipAmount] = useState<number>(5);
  const [tipMessage, setTipMessage] = useState<string>('');
  const [isSendingTip, setIsSendingTip] = useState(false);
  const [showTipForm, setShowTipForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch extended creator profile
        const response = await userService.getCreatorProfile(id as string);
        
        if (response.success) {
          setCreator(response.data.creator);
          setStats(response.data.stats);
          setIsSubscribed(response.data.isSubscribed);
          
          // If user is subscribed or is the creator, fetch all content
          if (response.data.isSubscribed || 
              (user && (user.id.toString() === id || user.role === 'admin'))) {
            await fetchAllContent();
          } else {
            // Otherwise, fetch only non-premium content
            await fetchPublicContent();
          }
        } else {
          setError('Failed to load creator profile');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching creator profile');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllContent = async () => {
      try {
        // Fetch regular content
        const regularResponse = await contentService.getCreatorContent(id as string);
        if (regularResponse.success) {
          setRegularContent(regularResponse.data);
          
          // Filter content by type
          setPhotoContent(regularResponse.data.filter(item => item.contentType === 'image'));
          setVideoContent(regularResponse.data.filter(item => item.contentType === 'video'));
        }
        
        // Fetch VR content
        const vrResponse = await vrContentService.getAllVRContent({ creatorId: id });
        if (vrResponse.success) {
          setVRContent(vrResponse.data);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
      }
    };

    const fetchPublicContent = async () => {
      try {
        // Fetch only non-premium regular content
        const regularResponse = await contentService.getCreatorContent(id as string, { isPremium: false });
        if (regularResponse.success) {
          setRegularContent(regularResponse.data);
          
          // Filter content by type
          setPhotoContent(regularResponse.data.filter(item => item.contentType === 'image'));
          setVideoContent(regularResponse.data.filter(item => item.contentType === 'video'));
        }
        
        // Fetch only non-premium VR content
        const vrResponse = await vrContentService.getAllVRContent({ 
          creatorId: id,
          isPremium: false
        });
        if (vrResponse.success) {
          setVRContent(vrResponse.data);
        }
      } catch (err) {
        console.error('Error fetching public content:', err);
      }
    };

    if (id && (!loading || isAuthenticated)) {
      fetchCreatorProfile();
    }
  }, [id, isAuthenticated, loading, user]);

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please sign in to send a tip');
      return;
    }
    
    if (!tipAmount || tipAmount <= 0) {
      setError('Please enter a valid tip amount');
      return;
    }
    
    try {
      setIsSendingTip(true);
      setError(null);
      
      const response = await paymentService.sendTip(
        id as string,
        tipAmount,
        tipMessage || undefined
      );
      
      if (response.success) {
        setSuccessMessage('Tip sent successfully!');
        setTipAmount(5);
        setTipMessage('');
        setShowTipForm(false);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        setError('Failed to send tip');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending tip');
    } finally {
      setIsSendingTip(false);
    }
  };

  const contentTabs = [
    { id: 'all', label: 'All Content' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Videos' },
    { id: 'vr', label: 'VR Content' }
  ];

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      {/* Banner and profile section */}
      <div className="relative bg-blue-600 h-60">
        {/* Banner image could be added here as a background image */}
        <div className="absolute -bottom-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {/* Profile picture */}
            <div className="h-40 w-40 relative rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {creator.profileImage ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${creator.profileImage}`}
                  alt={creator.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <span className="text-4xl text-gray-600">
                    {creator.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {creator.fullName || creator.username}
            </h1>
            <p className="text-gray-500">@{creator.username}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {!isAuthenticated ? (
              <Link href="/login">
                <Button>Sign in to Subscribe</Button>
              </Link>
            ) : isSubscribed ? (
              <>
                <Button variant="outline" onClick={() => setShowTipForm(!showTipForm)}>
                  Send a Tip
                </Button>
                <Link href="/subscriptions">
                  <Button>Manage Subscription</Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowTipForm(!showTipForm)}>
                  Send a Tip
                </Button>
              </>
            )}
          </div>
        </div>
        
        {successMessage && (
          <div className="mt-4 bg-green-50 p-4 rounded-md">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}
        
        {/* Tip form */}
        {showTipForm && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Send a Tip</h3>
            <form onSubmit={handleSendTip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={tipMessage}
                  onChange={(e) => setTipMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSendingTip}
                >
                  {isSendingTip ? 'Sending...' : 'Send Tip'}
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Creator bio */}
        {creator.bio && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-600">{creator.bio}</p>
          </div>
        )}
        
        {/* Creator stats */}
        {stats && (
          <div className="mt-6">
            <CreatorStats
              subscriberCount={stats.subscriberCount}
              contentCount={stats.contentCount}
              totalViews={stats.totalViews}
              joinDate={stats.joinDate}
            />
          </div>
        )}
        
        {/* Subscription plans */}
        {!isSubscribed && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Plans</h2>
            <SubscriptionPlans creatorId={id as string} />
          </div>
        )}
        
        {/* Content tabs */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Content</h2>
          
          {!isSubscribed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-yellow-700">
                <span className="font-medium">Subscribe to see all content. </span>
                You are currently viewing free content only.
              </p>
            </div>
          )}
          
          <Tabs tabs={contentTabs} defaultTab="all">
            <TabPanel id="all">
              <ContentGallery 
                contents={[...regularContent, ...vrContent]}
                emptyMessage="This creator hasn't posted any content yet."
              />
            </TabPanel>
            <TabPanel id="photos">
              <ContentGallery 
                contents={photoContent}
                emptyMessage="This creator hasn't posted any photos yet."
              />
            </TabPanel>
            <TabPanel id="videos">
              <ContentGallery 
                contents={videoContent}
                emptyMessage="This creator hasn't posted any videos yet."
              />
            </TabPanel>
            <TabPanel id="vr">
              <ContentGallery 
                contents={vrContent}
                emptyMessage="This creator hasn't posted any VR content yet."
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}