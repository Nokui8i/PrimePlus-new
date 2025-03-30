import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  UserIcon,
  PencilIcon,
  CloudArrowUpIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  LockClosedIcon,
  StarIcon,
  ArrowPathIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import MainLayout from '../../components/layouts/MainLayout';
import { useAuth } from '../../components/providers/AuthProvider';
import { toast } from 'react-hot-toast';

// Types
type ProfileTab = 'posts' | 'media' | 'subscriptions';

interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  coverImage?: string;
}

interface ContentTypeAccess {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  contentAccess: ContentTypeAccess;
  position: number;
  benefits: string[];
  tier: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: number;
    features: string[];
    contentAccess: ContentTypeAccess;
    position: number;
    benefits: string[];
  };
  paymentOptions: Array<{
    id: string;
    name: string;
    description: string;
    processingFee: number;
    isEnabled: boolean;
    icon: string;
  }>;
}

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

interface ProfileWithStats {
  id: string;
  username: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  socialLinks?: Record<string, string>;
  stats: {
    postsCount: number;
    mediaCount: number;
    subscribersCount: number;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    totalViews: number;
    responseRate: number;
    subscriberTrend: number;
    engagement: {
      likeRate: number;
      commentRate: number;
      shareRate: number;
      saveRate: number;
    };
    revenue: {
      total: number;
      thisMonth: number;
      lastMonth: number;
      currency: string;
    };
  };
  subscriptionPlans?: SubscriptionPlan[];
}

interface EditFormState {
  name: string;
  price: number;
  description: string;
  features: string[];
  contentAccess: ContentTypeAccess;
  file: File | null;
  previewUrl: string;
}

interface ProfilePageProps {
  creator?: ProfileWithStats;
  initialPosts?: ContentItem[];
  tiers?: SubscriptionPlan[];
  isSubscribed?: boolean;
}

const defaultContentAccess: ContentTypeAccess = {
  id: 'default',
  name: 'Default Access',
  description: 'Access to regular content',
  isEnabled: true
};

// Navigation Component
const ProfileNavigation: React.FC<{
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-8">
          <button
            onClick={() => onTabChange('posts')}
            className={`py-4 font-medium text-base relative ${
              activeTab === 'posts'
                ? 'text-neutral-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-500'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => onTabChange('media')}
            className={`py-4 font-medium text-base relative ${
              activeTab === 'media'
                ? 'text-neutral-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-500'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Media
          </button>
          <button
            onClick={() => onTabChange('subscriptions')}
            className={`py-4 font-medium text-base relative ${
              activeTab === 'subscriptions'
                ? 'text-neutral-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-500'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Subscriptions
          </button>
        </div>
      </div>
    </div>
  );
};

// Content Component
const ProfileContent: React.FC<{
  activeTab: ProfileTab;
  posts: ContentItem[];
  onCreatePost: () => void;
  profile: ProfileWithStats;
}> = ({ activeTab, posts, onCreatePost, profile }) => {
  const renderPosts = () => (
    <div>
      <div className="mb-6">
        <button
          onClick={onCreatePost}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 text-neutral-500" />
          <span className="text-neutral-500">Create Post</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            {post.mediaUrl && (
              <div className="relative aspect-[4/3]">
                <Image
                  src={post.mediaUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {post.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <HeartIcon className="w-4 h-4" />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
                <span className="text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.filter(post => post.mediaUrl).map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm"
        >
          <div className="relative aspect-[4/3]">
            {post.mediaUrl && (
              <Image
                src={post.mediaUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      {profile.subscriptionPlans?.map((plan) => (
        <div
          key={plan.id}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {plan.name}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {plan.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                ${plan.price}
              </div>
              <div className="text-sm text-neutral-500">per month</div>
            </div>
          </div>
          <div className="space-y-3">
            {plan.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-500" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'media' && renderMedia()}
      {activeTab === 'subscriptions' && renderSubscriptions()}
    </div>
  );
};

// Main Profile Page Component
const ProfilePage: React.FC<ProfilePageProps> = ({
  creator,
  initialPosts = [],
  tiers = [],
  isSubscribed = false,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileWithStats | null>(creator || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedSubscriptionTier, setSelectedSubscriptionTier] = useState<string | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [searchType, setSearchType] = useState<'users' | 'posts'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: creator?.fullName || '',
    price: creator?.subscriptionPlans?.[0]?.price || 0,
    description: creator?.bio || '',
    features: creator?.subscriptionPlans?.[0]?.features || [],
    contentAccess: defaultContentAccess,
    file: null,
    previewUrl: ''
  });
  const [posts, setPosts] = useState<ContentItem[]>(initialPosts || []);
  const [hasMore, setHasMore] = useState(true);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Initialize editForm when profile changes
  useEffect(() => {
    if (profile) {
      setEditForm(prev => ({
        ...prev,
        name: profile.fullName || prev.name,
        price: profile.subscriptionPlans?.[0]?.price || prev.price,
        description: profile.bio || prev.description,
        features: profile.subscriptionPlans?.[0]?.features || prev.features,
        contentAccess: prev.contentAccess,
        file: prev.file,
        previewUrl: prev.previewUrl
      }));
    }
  }, [profile]);

  const handleImageUpload = async (file: File, type: 'cover' | 'avatar') => {
    if (!profile) return;

    try {
      setIsLoading(true);
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);

      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [type === 'avatar' ? 'avatar' : 'coverImage']: imageUrl
        };
      });

      toast.success(`${type === 'avatar' ? 'Avatar' : 'Cover'} image updated successfully`);
    } catch (err) {
      toast.error(`Failed to update ${type === 'avatar' ? 'avatar' : 'cover'} image`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = (updates: Partial<ProfileWithStats>) => {
    if (!profile) return;

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        stats: {
          ...prev.stats,
          ...(updates.stats || {})
        }
      };
    });
  };

  const socialLinks = useMemo(() => [
    { icon: '/icons/tiktok.svg', url: profile?.socialLinks?.tiktok, name: 'TikTok' },
    { icon: '/icons/instagram.svg', url: profile?.socialLinks?.instagram, name: 'Instagram' },
    { icon: '/icons/youtube.svg', url: profile?.socialLinks?.youtube, name: 'YouTube' },
    { icon: '/icons/twitter.svg', url: profile?.socialLinks?.twitter, name: 'Twitter' },
  ].filter(link => link.url), [profile?.socialLinks]);

  const defaultBenefits = [
    { icon: <LockClosedIcon className="w-5 h-5" />, title: 'Full Access', description: 'Access all content' },
    { icon: <ChatBubbleLeftIcon className="w-5 h-5" />, title: 'Direct Messages', description: 'Chat with the creator' },
    { icon: <StarIcon className="w-5 h-5" />, title: 'Exclusive Content', description: 'Get exclusive posts' },
    { icon: <ArrowPathIcon className="w-5 h-5" />, title: 'Cancel Anytime', description: 'No commitment required' },
  ];

  const stats = useMemo(() => [
    { label: 'Posts', value: profile?.stats?.postsCount ?? 0 },
    { label: 'Subscribers', value: profile?.stats?.subscribersCount ?? 0 },
    { label: 'Revenue', value: profile?.stats?.revenue?.total ?? 0 },
    { label: 'Views', value: profile?.stats?.viewsCount ?? 0 },
  ], [profile?.stats]);

  const handleSubscribe = async (tierId: string) => {
    try {
      const selectedTier = profile.subscriptionPlans?.find(plan => plan.id === tierId);
      if (!selectedTier) {
        throw new Error('Selected tier not found');
      }

      const subscriptionData = {
        tierId,
        userId: user?.id || '',
        creatorId: profile.id,
        planId: selectedTier.id,
        price: selectedTier.price,
        currency: selectedTier.currency || 'USD',
        duration: selectedTier.duration || 30,
        paymentMethod: selectedTier.paymentOptions?.[0]?.id || ''
      };

      const response = await fetch(`/api/creators/${profile.id}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      // Refresh the page to update subscription status
      router.reload();
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const loadSubscriptionPlans = async () => {
    try {
      // Fetch subscription plans from API
      const response = await fetch('/api/subscription-plans');
      if (!response.ok) {
        throw new Error('Failed to load subscription plans');
      }
      const fetchedPlans: SubscriptionPlan[] = await response.json();
      
      // Ensure all plans have contentAccess
      const plansWithAccess = fetchedPlans.map((plan: SubscriptionPlan) => ({
        ...plan,
        contentAccess: plan.contentAccess || defaultContentAccess
      }));
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          subscriptionPlans: plansWithAccess
        };
      });
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      toast.error('Failed to load subscription plans');
    }
  };

  const handleEdit = () => {
    setEditForm({
      name: profile?.fullName || '',
      price: profile?.defaultSubscriptionPrice || 0,
      description: profile?.bio || '',
      features: profile?.subscriptionPlans?.map(plan => plan.name) || [],
      contentAccess: profile?.subscriptionPlans?.reduce((access, plan) => ({
        ...access,
        [plan.name.toLowerCase()]: plan.contentAccess
      }), defaultContentAccess) || defaultContentAccess
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const updatedProfile = {
        ...profile,
        ...editForm,
      };
      setProfile(updatedProfile);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload avatar');

      const data = await response.json();
      setProfile(prev => {
        if (!prev) return prev;
        return { ...prev, avatar: data.url };
      });
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      // TODO: Implement avatar upload to server
      if (profile?.avatar && typeof profile.avatar === 'string') {
        setProfile({ ...profile, avatar: profile.avatar });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsUploadingCover(true);
      const formData = new FormData();
      formData.append('cover', file);

      const response = await fetch('/api/profile/cover', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload cover image');

      const data = await response.json();
      setProfile(prev => {
        if (!prev) return prev;
        return { ...prev, coverImage: data.url };
      });
      toast.success('Cover image updated successfully!');
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error('Failed to upload cover image. Please try again.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleCoverUpload = async () => {
    try {
      // TODO: Implement cover upload to server
      if (profile?.coverImage && typeof profile.coverImage === 'string') {
        setProfile({ ...profile, coverImage: profile.coverImage });
      }
    } catch (error) {
      console.error('Error uploading cover:', error);
    }
  };

  const handleDeleteAvatar = () => {
    setProfile(prev => ({ ...prev, avatar: '' }));
  };

  const handleDeleteCover = () => {
    setProfile(prev => ({ ...prev, coverImage: '' }));
  };

  const handleAddPlan = () => {
    if (!profile) return;
    
    const defaultContentAccess: ContentTypeAccess = {
      id: 'default',
      name: 'Default Access',
      description: 'Access to regular content',
      isEnabled: true
    };
    
    const newPlan: SubscriptionPlan = {
      id: String(profile.subscriptionPlans?.length || 0 + 1),
      name: 'New Plan',
      description: 'Description of the new plan',
      price: 9.99,
      currency: 'USD',
      duration: 30,
      features: ['Feature 1', 'Feature 2'],
      contentAccess: defaultContentAccess,
      position: profile.subscriptionPlans?.length || 0,
      benefits: ['Benefit 1', 'Benefit 2'],
      tier: {
        id: String(profile.subscriptionPlans?.length || 0 + 1),
        name: 'New Plan',
        description: 'Description of the new plan',
        price: 9.99,
        currency: 'USD',
        duration: 30,
        features: ['Feature 1', 'Feature 2'],
        contentAccess: defaultContentAccess,
        position: profile.subscriptionPlans?.length || 0,
        benefits: ['Benefit 1', 'Benefit 2']
      },
      paymentOptions: [{
        id: 'card',
        name: 'Credit Card',
        description: 'Pay with credit card',
        processingFee: 2.9,
        isEnabled: true,
        icon: 'credit-card'
      }]
    };

    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        subscriptionPlans: [...(prev.subscriptionPlans || []), newPlan]
      };
    });
  };

  const handleBioUpdate = (newBio: string) => {
    handleUpdateProfile({ bio: newBio });
  };

  const handleLocationUpdate = (newLocation: string) => {
    handleUpdateProfile({ location: newLocation });
  };

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } = useDropzone({
    onDrop: handleCoverUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: handleAvatarUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const handleSubscriptionUpdate = (planId: string, updates: Partial<SubscriptionPlan>) => {
    setProfile((prev) => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans?.map((plan) =>
        plan.id === planId ? { ...plan, ...updates } : plan
      ),
    }));
  };

  const renderMedia = () => {
    if (!profile) return null;
    return (
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Media
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              {/* Post Media */}
              {post.mediaUrl && (
                <div className="relative aspect-video">
                  <Image
                    src={post.mediaUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleFormatText = (format: string) => {
    // Implement text formatting logic based on the format
  };

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white dark:bg-neutral-900 shadow-sm">
        {/* Cover Photo Container */}
        <div 
          className="relative w-full max-w-6xl mx-auto border-b-2 border-neutral-200 dark:border-neutral-800 group" 
          style={{ height: '300px' }}
          onMouseEnter={() => setShowCoverUpload(true)}
          onMouseLeave={() => setShowCoverUpload(false)}
        >
          <div {...getCoverRootProps()} className="w-full h-full cursor-pointer">
            <input {...getCoverInputProps()} />
            {user?.coverImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={user.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1536px) 100vw, 1536px"
                />
                {showCoverUpload && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleImageUpload(file, 'cover');
                        };
                        input.click();
                      }}
                      className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <PencilIcon className="w-5 h-5 text-neutral-700" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
            )}
            
            {/* Cover Upload Overlay */}
            {showCoverUpload && !user?.coverImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
                <div className="text-center text-white">
                  {isUploadingCover ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <CloudArrowUpIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Click or drag to upload cover photo</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info Container */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative -mt-20 pb-6">
            {/* Avatar and Name Section */}
            <div className="flex items-end gap-6 mb-6">
              {/* Avatar with Upload */}
              <div 
                className="relative"
                onMouseEnter={() => setShowAvatarUpload(true)}
                onMouseLeave={() => setShowAvatarUpload(false)}
              >
                <div {...getAvatarRootProps()} className="relative w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden bg-white dark:bg-neutral-800 shadow-lg cursor-pointer">
                  <input {...getAvatarInputProps()} />
                  {user?.avatar ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={user.avatar}
                        alt={user.name || 'Profile'}
                        fill
                        className="object-cover"
                        priority
                        sizes="128px"
                      />
                      {showAvatarUpload && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload(file, 'avatar');
                              };
                              input.click();
                            }}
                            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                          >
                            <PencilIcon className="w-5 h-5 text-neutral-700" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-neutral-400" />
                    </div>
                  )}
                  
                  {/* Avatar Upload Overlay */}
                  {showAvatarUpload && !user?.avatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
                      {isUploadingAvatar ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <CloudArrowUpIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {user?.name || 'User Name'}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Get the user ID from the query parameters or session
    const userId = context.query.id || context.req.session?.user?.id;

    if (!userId) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Fetch profile data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return {
      props: {
        creator: data.profile,
        initialPosts: data.posts || [],
        tiers: data.tiers || [],
        isSubscribed: data.isSubscribed || false,
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      props: {
        error: 'Failed to load profile',
      },
    };
  }
};

export default ProfilePage;