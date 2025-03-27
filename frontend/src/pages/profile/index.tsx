import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  UserIcon,
  PencilIcon,
  CameraIcon,
  CheckBadgeIcon,
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  ShieldCheckIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  CloudArrowUpIcon,
  CubeIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import InfiniteFeed from '@/components/feed/InfiniteFeed';
import { MOCK_POSTS } from '@/services/mockData';
import SubscriptionPlans from '@/components/profile/SubscriptionPlans';
import MonetizationSettings from '@/components/settings/MonetizationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import PayoutSettings from '@/components/settings/PayoutSettings';
import CreatorSettings from '@/components/settings/CreatorSettings';
import { v4 as uuidv4 } from 'uuid';
import type { MonetizationSettingsData, PayoutSettingsData } from '@/types/settings';
import ContentUploadForm from '@/components/content/ContentUploadForm';
import type { Profile } from '@/types/profile';
import type { Post } from '@/types/post';
import { SubscriptionPlan } from '@/types/subscription';
import type { MediaItem } from '@/types/media';
import type { PrivacySettingsData, ProfileVisibility, AccessLevel } from '@/types/privacy';
import type { MediaUploadResponse } from '@/types/media';

// Replace the static VRViewer import with dynamic import
const VRViewer = dynamic(() => import('@/components/VRViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  ),
});

// Types
interface LocalSubscriptionPlan extends SubscriptionPlan {}
interface LocalMediaItem extends MediaItem {}
interface LocalPost extends Omit<Post, 'media' | 'content'> {
  media?: PostMedia[];
  content?: string;
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  discounts?: {
  id: string;
  code: string;
  percentage: number;
  validUntil: Date;
  isActive: boolean;
  }[];
  defaultPrice?: number;
  onSubscribe?: (planId: string) => void;
  isSubscribed?: boolean;
  onAddPlan: (newPlan: Partial<SubscriptionPlan>) => void;
  onUpdatePlan: (planId: string, updates: Partial<SubscriptionPlan>) => void;
  onDeletePlan: (planId: string) => void;
}

// Add subscription tier type
type SubscriptionTier = 'none' | 'basic' | 'premium' | 'vr';

// Add new creator dashboard tabs type
type CreatorDashboardTab = 'posts' | 'content' | 'live' | 'analytics' | 'settings';

interface UploadForm {
  title: string;
  description: string;
  type: 'model' | '360-video' | '360-image';
  file: File | null;
  previewUrl: string;
}

interface InfiniteFeedProps {
  initialPosts: LocalPost[];
  hasMore: boolean;
  onLoadMore: () => void;
  isSubscribed?: boolean;
  subscriptionTier?: SubscriptionTier;
  onSubscribe?: () => void;
  onPurchaseContent?: () => void;
  creatorId?: string;
}

interface PostMedia extends MediaUploadResponse {
  subscriptionPackId: string | null;
  individualPrice?: number;
  includeInSubscription: boolean;
}

interface ExtendedProfile extends Profile {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface ProfileWithStats extends ExtendedProfile {
  totalRevenue: number;
}

const defaultMonetizationSettings: MonetizationSettingsData = {
  enableTips: true,
  minTipAmount: 1,
  maxTipAmount: 1000,
  enablePayPerView: true,
  minPrice: 1,
  maxPrice: 100
};

const defaultPrivacySettings: PrivacySettingsData = {
  profileVisibility: 'public' as ProfileVisibility,
  showActivity: true,
  showFollowers: true,
  showFollowing: true,
  allowMessages: 'everyone' as AccessLevel,
  allowComments: 'everyone' as AccessLevel,
  blockList: []
};

const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic',
    price: 9.99,
    description: 'Basic subscription plan',
    isActive: true,
    features: ['Access to basic content', 'Monthly updates'],
    intervalInDays: 30
  }
];

const mockDiscounts = [
  {
    id: '1',
    code: 'WELCOME',
    percentage: 20,
    validUntil: new Date('2024-12-31'),
    isActive: true
  }
];

const mockProfile: ExtendedProfile = {
  id: '1',
  username: 'johndoe',
  fullName: 'John Doe',
  email: 'john@example.com',
  bio: 'Digital creator and photographer 📸',
  avatar: 'https://picsum.photos/200/200',
  coverImage: 'https://picsum.photos/1920/1080',
  isVerified: true,
  location: 'New York, NY',
  website: 'https://johndoe.com',
  isCreator: true,
  joinDate: new Date().toISOString(),
  followers: 1234,
  following: 567,
  posts: 42,
  postsCount: 42,
  followersCount: 1234,
  followingCount: 567,
  totalViews: 50000,
  totalLikes: 2500,
  totalComments: 750,
  subscriptionPlans: mockSubscriptionPlans,
  discounts: mockDiscounts,
  defaultSubscriptionPrice: 9.99,
  freeAccessList: [],
  subscribedTo: []
};

const mockProfileWithStats: ProfileWithStats = {
  ...mockProfile,
  totalRevenue: 1234.56
};

const mockPosts: LocalPost[] = [
  {
    id: '1',
    title: 'Latest Work',
    description: 'Check out my latest work! 🎨',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    createdAt: new Date().toISOString(),
    creator: {
      id: '1',
      username: 'johndoe',
      avatar: 'https://picsum.photos/200/200'
    },
    media: [{
      id: '1',
      type: 'image',
      url: 'https://picsum.photos/1080/1920?random=1',
      subscriptionPackId: 'free',
      includeInSubscription: true,
      individualPrice: 0.99
    }],
    likes: 42,
    comments: 7,
    views: 150,
    isPremium: false,
    content: 'Check out my latest work! 🎨'
  }
];

const defaultProfile: ExtendedProfile = {
  id: '',
  username: '',
  fullName: '',
  email: '',
  bio: '',
  avatar: '',
  coverImage: '',
  isVerified: false,
  location: '',
  website: '',
  isCreator: true,
  joinDate: '2024-01-01',
  followers: 0,
  following: 0,
  posts: 0,
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0,
  subscriptionPlans: [],
  discounts: [],
  defaultSubscriptionPrice: 9.99,
  freeAccessList: [],
  subscribedTo: []
};

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ExtendedProfile | null>(mockProfile);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtendedProfile>>({});
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      description: 'Access to basic content and features',
      isActive: true,
      features: [
        'Access to basic content',
        'HD video streaming',
        'Direct messaging'
      ],
      intervalInDays: 30
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      description: 'Full access to all content and premium features',
      isActive: true,
      features: [
        'Access to all content',
        '4K video streaming',
        'Priority support',
        'Early access to new content',
        'Exclusive behind-the-scenes'
      ],
      intervalInDays: 30
    }
  ]);
  const [postMedia, setPostMedia] = useState<MediaItem[]>([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [showCreatorSettings, setShowCreatorSettings] = useState(false);
  const [selectedSubscriptionPack, setSelectedSubscriptionPack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [activeTab, setActiveTab] = useState<CreatorDashboardTab>('posts');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video' | 'vr' | null>(null);
  const [form, setForm] = useState<UploadForm>({
    title: '',
    description: '',
    type: 'model',
    file: null,
    previewUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'subscription' | 'monetization' | 'privacy' | 'payout'>('subscription');
  const [monetizationSettings, setMonetizationSettings] = useState<MonetizationSettingsData>(defaultMonetizationSettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsData>(defaultPrivacySettings);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettingsData>({
    payoutMethod: 'bank',
    payoutThreshold: 50,
    payoutSchedule: 'monthly'
  });
  const [showCreatorDashboard, setShowCreatorDashboard] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
    // Get the profile ID from the URL or use the current user's ID
    const profileId = (router.query.id as string) || user?.id || '';

    // TODO: Fetch profile from API
    // For now, using mock data
      const mockProfile: ExtendedProfile = {
      id: profileId,
      username: user?.username || 'johndoe',
      fullName: user?.fullName || 'John Doe',
      email: user?.email || 'john@example.com',
      avatar: user?.avatar || 'https://picsum.photos/200/200',
      coverImage: 'https://picsum.photos/1920/400',
      bio: user?.bio || 'Content creator and enthusiast. Creating amazing experiences.',
      location: user?.location || 'San Francisco, CA',
      website: user?.website || 'https://example.com',
      isVerified: true,
      isCreator: true,
      joinDate: '2024-01-01',
        followers: 0,
        following: 0,
      posts: 0,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
      subscriptionPlans: [],
      discounts: [],
      defaultSubscriptionPrice: 9.99,
      freeAccessList: [],
        subscribedTo: []
      };

      const profileWithStats = {
        ...mockProfile,
        totalRevenue: 0
    };

    // Filter posts to only show posts from this specific profile
    const profilePosts = MOCK_POSTS.filter(post => post.creator.id === profileId).map(post => ({
      ...post,
        createdAt: new Date().toISOString(),
        creator: {
          id: profileId,
          username: user.username,
          avatar: user.avatar || 'https://picsum.photos/200/200'
        },
        media: post.media?.map(media => ({
          type: media.type,
          url: media.url,
          thumbnail: media.thumbnail,
          subscriptionPackId: 'free',
          includeInSubscription: false,
          individualPrice: 0.99
        })) || []
    }));
    
    // Update the profile with the correct post count
    mockProfile.posts = profilePosts.length;
    
    setProfile(mockProfile);
    setUserPosts(profilePosts);
    setLoading(false);
    }
  }, [isAuthenticated, loading, router, user, router.query.id]);

  const handleEdit = () => {
    setEditForm({
      fullName: profile?.fullName,
      bio: profile?.bio,
      location: profile?.location,
      website: profile?.website,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!profile) return;

    setProfile({
      ...profile,
      ...editForm,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      // TODO: Implement avatar upload to server
      if (avatarPreview && profile) {
        setProfile({ ...profile, avatar: avatarPreview });
        // Reset states
        setShowAvatarUpload(false);
        setAvatarFile(null);
        setAvatarPreview('');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      // TODO: Show error message to user
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = async () => {
    try {
      // TODO: Implement cover upload to server
      if (coverPreview && profile) {
        setProfile({ ...profile, coverImage: coverPreview });
        // Reset states
        setShowCoverUpload(false);
        setCoverFile(null);
        setCoverPreview('');
      }
    } catch (error) {
      console.error('Error uploading cover:', error);
      // TODO: Show error message to user
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      // TODO: Implement avatar deletion on server
      if (profile) {
        setProfile({ ...profile, avatar: '/default-avatar.png' }); // Set to default avatar
        setShowAvatarUpload(false);
        setAvatarFile(null);
        setAvatarPreview('');
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      // TODO: Show error message to user
    }
  };

  const handleDeleteCover = async () => {
    try {
      // TODO: Implement cover deletion on server
      if (profile) {
        setProfile({ ...profile, coverImage: '/default-cover.png' }); // Set to default cover
        setShowCoverUpload(false);
        setCoverFile(null);
        setCoverPreview('');
      }
    } catch (error) {
      console.error('Error deleting cover:', error);
      // TODO: Show error message to user
    }
  };

  const loadMorePosts = () => {
    // TODO: Implement real pagination with API call
    // For now, just simulate no more posts after initial load
    setHasMorePosts(false);
  };

  const handlePostMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMedia: MediaItem = {
          file,
          preview: reader.result as string,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          subscriptionPackId: 'free',
          includeInSubscription: false,
          individualPrice: 0.99
        };
        setPostMedia(prev => [...prev, newMedia]);
        // Select the newly added media item
        setSelectedMediaIndex(prev => (prev === null ? 0 : prev));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMediaAccessChange = (index: number, subscriptionPackId: string | 'free' | 'individual' | null, includeInSubscription?: boolean) => {
    setPostMedia(prev => prev.map((item, i) => 
      i === index 
        ? { 
            ...item, 
            subscriptionPackId,
            includeInSubscription: includeInSubscription ?? item.includeInSubscription
          } 
        : item
    ));
  };

  const handleRemoveMedia = (index: number) => {
    setPostMedia(prev => prev.filter((_, i) => i !== index));
    if (selectedMediaIndex === index) {
      setSelectedMediaIndex(null);
    }
  };

  const handleCreatePost = async () => {
    if (!postText || postMedia.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate individual prices
    const hasInvalidPrice = postMedia.some(media => 
      media.subscriptionPackId === 'individual' && (!media.individualPrice || media.individualPrice < 0.99)
    );

    if (hasInvalidPrice) {
      setError('Please set valid prices for all individual content (minimum $0.99)');
      return;
    }

    const newPost: Post = {
      id: uuidv4(),
      title: '',
      content: postText,
      description: postText,
      thumbnail: '',
      createdAt: new Date().toISOString(),
      creator: {
        id: profile?.id || '',
        username: profile?.username || '',
        avatar: profile?.avatar || ''
      },
      likes: 0,
      comments: 0,
      views: 0,
      isPremium: false,
      media: postMedia.map(media => ({
        type: media.type,
        url: media.preview,
        thumbnail: media.preview,
        subscriptionPackId: media.subscriptionPackId || null,
        includeInSubscription: media.includeInSubscription,
        individualPrice: media.individualPrice
      }))
    };

    setUserPosts(prev => [newPost, ...prev]);
    if (profile) {
      setProfile({
        ...profile,
        posts: profile.posts + 1
      });
    }
    setPostText('');
    setPostMedia([]);
    setSelectedMediaIndex(null);
    setShowPostModal(false);
    setError(null);
  };

  const handleAddPlan = (newPlan: Partial<SubscriptionPlan>) => {
    const plan: SubscriptionPlan = {
      id: uuidv4(),
      name: newPlan.name || '',
      price: newPlan.price || 0,
      description: newPlan.description || '',
      isActive: true,
      features: newPlan.features || [],
      intervalInDays: newPlan.intervalInDays || 30
    };
    setSubscriptionPlans(prev => [...prev, plan]);
  };

  const handleUpdatePlan = (planId: string, updates: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans(plans =>
      plans.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              name: updates.name ?? plan.name,
              price: updates.price ?? plan.price,
              description: updates.description ?? plan.description,
              isActive: updates.isActive ?? plan.isActive,
              features: updates.features ?? plan.features,
              intervalInDays: updates.intervalInDays ?? plan.intervalInDays
            }
          : plan
      )
    );
  };

  const handleDeletePlan = (planId: string) => {
    setSubscriptionPlans(plans => plans.filter(plan => plan.id !== planId));
  };

  const handleRevokeFreeAccess = (userId: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      freeAccessList: profile.freeAccessList.filter(access => access.userId !== userId)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({
        ...form,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleUpload = async () => {
    try {
      if (!form.file) {
        setError('Please select a file to upload');
        return;
      }

      // Handle upload logic here
      // This is a placeholder and should be replaced with actual implementation
      console.log('Uploading file:', form.file);

      // Simulate successful upload
      setIsUploading(false);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('An error occurred while uploading the file');
      setIsUploading(false);
    }
  };

  // Add creator dashboard section
  const renderCreatorDashboard = () => {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <CreatorSettings />
        </div>
      </div>
    );
  };

  const handleMonetizationUpdate = (updates: Partial<MonetizationSettingsData>) => {
    setMonetizationSettings(prev => ({ ...prev, ...updates }));
  };

  const handlePrivacyUpdate = (updates: Partial<PrivacySettingsData>) => {
    setPrivacySettings(prev => ({ ...prev, ...updates }));
  };

  const handlePayoutUpdate = (updates: Partial<PayoutSettingsData>) => {
    setPayoutSettings(prev => ({ ...prev, ...updates }));
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

  if (!profile) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Profile not found
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        {/* Content Upload Button */}
          <button 
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          >
          <CloudArrowUpIcon className="w-6 h-6" />
          </button>

        {/* Content Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create New Post</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-gray-500">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                    {error}
                </div>
              )}

                <div className="space-y-6">
                  {/* Text Content */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Content</label>
                    <textarea
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full h-32 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                  {/* Media Upload */}
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
                        <PhotoIcon className="w-5 h-5" />
                        <span>Add Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePostMediaChange}
                  className="hidden"
                />
                      </label>

                      <label className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
                        <VideoCameraIcon className="w-5 h-5" />
                        <span>Add Videos</span>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handlePostMediaChange}
                  className="hidden"
                />
                      </label>
              </div>

                    {/* Media Preview */}
                    {postMedia.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {postMedia.map((media, index) => (
                          <div
                            key={index}
                            className={`relative rounded-lg overflow-hidden cursor-pointer ${
                              selectedMediaIndex === index ? 'ring-2 ring-primary-500' : ''
                            }`}
                            onClick={() => setSelectedMediaIndex(index)}
                          >
                            {media.type === 'image' ? (
                              <img
                                src={media.preview}
                                alt={`Upload preview ${index + 1}`}
                                className="w-full h-32 object-cover"
              />
            ) : (
                              <video
                                src={media.preview}
                                className="w-full h-32 object-cover"
                              />
                            )}
                  <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMedia(index);
                              }}
                              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                            >
                              <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                        ))}
          </div>
        )}

                    {/* Media Settings */}
                    {selectedMediaIndex !== null && (
                      <div className="border rounded-lg p-4 dark:border-gray-600">
                        <h3 className="font-semibold mb-3">Content Access Settings</h3>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={postMedia[selectedMediaIndex].subscriptionPackId === 'free'}
                              onChange={() => handleMediaAccessChange(selectedMediaIndex, 'free', true)}
                              className="text-primary-600"
                            />
                            <span>Free for everyone</span>
                    </label>

                          <label className="flex items-center space-x-2">
                    <input
                              type="radio"
                              checked={postMedia[selectedMediaIndex].subscriptionPackId !== 'free' && postMedia[selectedMediaIndex].includeInSubscription}
                              onChange={() => handleMediaAccessChange(selectedMediaIndex, selectedSubscriptionPack || mockSubscriptionPlans[0]?.id, true)}
                              className="text-primary-600"
                            />
                            <span>Include in subscription</span>
                      </label>

                          <label className="flex items-center space-x-2">
                          <input
                              type="radio"
                              checked={postMedia[selectedMediaIndex].subscriptionPackId === 'individual'}
                              onChange={() => {
                                handleMediaAccessChange(selectedMediaIndex, 'individual', false);
                                setShowPriceInput(true);
                              }}
                              className="text-primary-600"
                            />
                            <span>Individual purchase</span>
                          </label>

                          {postMedia[selectedMediaIndex].subscriptionPackId === 'individual' && (
                            <div className="flex items-center space-x-2 mt-2">
                              <span>$</span>
                              <input
                                type="number"
                                min="0.99"
                                step="0.01"
                                value={postMedia[selectedMediaIndex].individualPrice || ''}
                                onChange={(e) => {
                                  const price = parseFloat(e.target.value);
                                  setPostMedia(prev => prev.map((item, i) => 
                                    i === selectedMediaIndex 
                                      ? { ...item, individualPrice: price }
                                      : item
                                  ));
                                }}
                                className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                placeholder="0.99"
                              />
                          </div>
                        )}
                      </div>
                      </div>
                    )}
                    </div>

                  {/* Post Schedule */}
                  <div>
                    <h3 className="font-semibold mb-3">Post Schedule</h3>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                          <input
                          type="radio"
                          name="schedule"
                          value="now"
                          checked={!isScheduled}
                          onChange={() => setIsScheduled(false)}
                          className="text-primary-600"
                        />
                        <span>Post now</span>
                          </label>

                      <label className="flex items-center space-x-2">
                                    <input
                          type="radio"
                          name="schedule"
                          value="schedule"
                          checked={isScheduled}
                          onChange={() => setIsScheduled(true)}
                          className="text-primary-600"
                        />
                        <span>Schedule for later</span>
                                    </label>
                                  </div>

                    {isScheduled && (
                      <div className="mt-3">
                          <input
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3">
                          <button
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                      Cancel
                          </button>
                <button
                  onClick={handleCreatePost}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                      {isScheduled ? 'Schedule Post' : 'Post Now'}
                </button>
              </div>
            </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="pt-6 pb-4">
                    <div className="relative">
              {/* Cover Image */}
              <div className="h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                <Image
                  src={profile?.coverImage || ''}
                  alt="Cover"
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover brightness-90"
                />
                </div>

              {/* Profile Picture */}
              <div className="absolute -bottom-16 left-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-neutral-900 shadow-lg">
                    <Image
                      src={profile?.avatar || ''}
                      alt="Avatar"
                      width={128}
                      height={128}
                      className="brightness-95"
                    />
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                            </button>
                          </div>
                        </div>
                          </div>

            {/* Profile Info */}
            <div className="mt-20 pl-6">
              <div className="flex items-start justify-between">
                          <div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{profile?.username}</h1>
                  <p className="text-sm text-neutral-500">@{profile?.username.toLowerCase()}</p>
                          </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                    Edit Profile
                                  </button>
                  <button className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                              </button>
                            </div>
                          </div>

              {/* Bio */}
              <div className="mt-4 max-w-2xl">
                <p className="text-base text-neutral-600 dark:text-neutral-400">
                  {profile?.bio}
                </p>
                        </div>

              {/* Stats */}
              <div className="mt-6 flex items-center space-x-8 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{profile?.postsCount}</span>
                  <span className="text-neutral-500">Posts</span>
                      </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{profile?.followersCount}</span>
                  <span className="text-neutral-500">Followers</span>
                  </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{profile?.followingCount}</span>
                  <span className="text-neutral-500">Following</span>
                </div>
                  </div>
                  </div>
                </div>

          {/* Creator Settings Button */}
          {profile?.isCreator && (
            <div className="px-6 py-3 border-y border-neutral-200/50 dark:border-neutral-700/50">
                    <button
                onClick={() => setShowCreatorDashboard(!showCreatorDashboard)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700/50 transition-colors"
              >
                          <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>Creator Settings</span>
                            </div>
                <svg className={`w-5 h-5 transition-transform ${showCreatorDashboard ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                          </button>
                        </div>
          )}

          {/* Creator Dashboard */}
          {showCreatorDashboard && renderCreatorDashboard()}

          {/* Content */}
          <div className="mt-6 px-4">
            <InfiniteFeed
              initialPosts={mockPosts}
              hasMore={false}
              onLoadMore={() => {}}
              isSubscribed={true}
            />
                </div>
              </div>
            </div>
    </MainLayout>
  );
};

export default ProfilePage; 