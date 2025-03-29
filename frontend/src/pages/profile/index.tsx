import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
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
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import InfiniteFeed from '@/components/feed/InfiniteFeed';
import { MOCK_POSTS, MOCK_CREATORS } from '@/services/mockData';
import SubscriptionPlans from '@/components/profile/SubscriptionPlans';
import type { Profile } from '@/types/profile';
import type { Post } from '@/types/post';
import type { MediaItem } from '@/types/media';
import type { MediaUploadResponse } from '@/types/media';
import CreatePostForm from '@/components/content/CreatePostForm';
import type { SubscriptionPlan as ServiceSubscriptionPlan, ContentTypeAccess, CreateSubscriptionPlanDto } from '@/services/subscriptionService';
import { getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '@/services/subscriptionService';
import { toast } from 'react-hot-toast';
import SubscriptionService from '@/services/subscriptionService';
import { defaultContentAccess } from '@/constants/content';
import { mockSubscriptionPlans } from '@/mocks/data';
import { useDropzone } from 'react-dropzone';
import { containers, typography, contentSizes, commonStyles, layout } from '@/styles/design-system';
import PlaceholderImage from '@/components/common/PlaceholderImage';

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
interface LocalSubscriptionPlan extends ServiceSubscriptionPlan {}
interface LocalMediaItem extends MediaItem {}
interface LocalPost extends Omit<Post, 'creator' | 'media'> {
  isEditing: boolean;
  creator: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  media?: {
    url: string;
    type: 'vr' | 'image' | 'video';
    thumbnail?: string;
    subscriptionPackId: string | null;
    includeInSubscription: boolean;
    individualPrice?: number;
  }[];
}

interface LocalDiscount {
  id: string;
  code: string;
  percentage: number;
  validUntil: string;
  isActive: boolean;
}

interface SubscriptionPlansProps {
  plans: ServiceSubscriptionPlan[];
  discounts: LocalDiscount[];
  defaultPrice?: number;
  onSubscribe?: (planId: string) => void;
  isSubscribed?: boolean;
  onAddPlan: (newPlan: Partial<ServiceSubscriptionPlan>) => void;
  onUpdatePlan: (planId: string, updates: Partial<ServiceSubscriptionPlan>) => void;
  onDeletePlan: (planId: string) => void;
}

type SubscriptionTier = 'none' | 'basic' | 'premium' | 'vr';
type ProfileTab = 'posts' | 'subscriptions';

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

interface Discount {
  id: string;
  code: string;
  percentage: number;
  validUntil: string;
  isActive: boolean;
}

const mockDiscounts: LocalDiscount[] = [
  {
    id: '1',
    code: 'WELCOME2024',
    percentage: 20,
    validUntil: '2024-12-31T23:59:59Z',
    isActive: true
  }
];

const mockPosts: LocalPost[] = [
  {
    id: '1',
    title: 'My First Post',
    description: 'This is my first post on the platform',
    content: 'Welcome to my profile!',
    thumbnail: '/images/post1.jpg',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    authorId: '123',
    creator: {
      id: '123',
      username: 'creator1',
      fullName: 'John Creator',
      avatar: '/images/avatar1.jpg'
    },
    likes: 10,
    comments: 5,
    views: 100,
    media: [
      {
        url: '/videos/post1.mp4',
        type: 'video',
        thumbnail: '/images/thumbnail1.jpg',
        subscriptionPackId: null,
        includeInSubscription: true,
        individualPrice: 0
      }
    ],
    isEditing: false,
    isPremium: false
  }
];

const mockProfile: ExtendedProfile = {
  id: '123',
  username: 'creator1',
  fullName: 'John Creator',
  email: 'creator1@example.com',
  bio: 'Content creator passionate about VR and interactive experiences',
  avatar: '/images/avatar1.jpg',
  coverImage: '/images/cover1.jpg',
  isVerified: true,
  isCreator: true,
  joinDate: new Date().toISOString(),
  followers: 1000,
  following: 500,
  posts: mockPosts.length,
  postsCount: mockPosts.length,
  followersCount: 1000,
  followingCount: 500,
  totalViews: 5000,
  totalLikes: 250,
  totalComments: 100,
  subscriptionPlans: mockSubscriptionPlans,
  discounts: mockDiscounts,
  defaultSubscriptionPrice: 9.99,
  freeAccessList: [],
  subscribedTo: []
};

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

// Add new interface for the plan edit form
interface PlanEditForm {
  name: string;
  price: number;
  description: string;
  features: string[];
  contentAccess: ContentTypeAccess;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState<ServiceSubscriptionPlan[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ServiceSubscriptionPlan | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceSubscriptionPlan>>({
    name: '',
    price: 9.99,
    description: '',
    features: [],
    intervalInDays: 30,
    contentAccess: defaultContentAccess
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'posts' | 'users'>('users');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with mock data immediately
    setProfile({
      id: '1',
      username: 'demo_user',
      fullName: 'Demo User',
      avatar: '/images/default-avatar.png',
      coverImage: '/images/default-cover.png',
      bio: 'This is a demo profile',
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      isCreator: false,
      isVerified: false,
      defaultSubscriptionPrice: 9.99,
      subscriptionPlans: mockSubscriptionPlans
    });
    setSubscriptionPlans(mockSubscriptionPlans);
    setIsLoading(false);
  }, []);

  const loadSubscriptionPlans = async () => {
    try {
      const fetchedPlans = await getSubscriptionPlans();
      // Ensure all plans have contentAccess
      const plansWithAccess = fetchedPlans.map(plan => ({
        ...plan,
        contentAccess: plan.contentAccess || defaultContentAccess
      }));
      setSubscriptionPlans(plansWithAccess);
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
      name: profile?.fullName,
      price: profile?.defaultSubscriptionPrice || 0,
      description: profile?.bio || '',
      features: profile?.subscriptionPlans.map(plan => plan.name) || [],
      contentAccess: profile?.subscriptionPlans.reduce((access, plan) => ({
        ...access,
        [plan.name.toLowerCase()]: plan.contentAccess.regularContent
      }), defaultContentAccess) || defaultContentAccess
    });
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (!profile) return;

    setProfile({
      ...profile,
      ...editForm,
    });
    setShowEditModal(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          avatar: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      // TODO: Implement avatar upload to server
      if (profile) {
        setProfile({ ...profile, avatar: URL.createObjectURL(profile.avatar) });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      // TODO: Show error message to user
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          coverImage: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = async () => {
    try {
      // TODO: Implement cover upload to server
      if (profile) {
        setProfile({ ...profile, coverImage: URL.createObjectURL(profile.coverImage) });
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
      }
    } catch (error) {
      console.error('Error deleting cover:', error);
      // TODO: Show error message to user
    }
  };

  const handleAddPlan = async (newPlan: Partial<ServiceSubscriptionPlan>) => {
    try {
      // Create a new plan with mock data
      const createdPlan: ServiceSubscriptionPlan = {
        id: uuidv4(),
        name: newPlan.name || 'New Plan',
        price: newPlan.price || 9.99,
        description: newPlan.description || 'New subscription plan',
        isActive: true,
        features: newPlan.features || ['Access to basic content'],
        intervalInDays: newPlan.intervalInDays || 30,
        contentAccess: newPlan.contentAccess || defaultContentAccess,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update state with new plan
      setSubscriptionPlans(prev => [...prev, createdPlan]);
      toast.success('Subscription plan created successfully');
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast.error('Failed to create subscription plan');
    }
  };

  const handleUpdatePlan = async (planId: string, updates: Partial<ServiceSubscriptionPlan>) => {
    try {
      // Update plan in state
      setSubscriptionPlans(plans =>
        plans.map(plan =>
          plan.id === planId
            ? {
                ...plan,
                ...updates,
                updatedAt: new Date().toISOString()
              }
            : plan
        )
      );
      toast.success('Subscription plan updated successfully');
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast.error('Failed to update subscription plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      // Remove plan from state
      setSubscriptionPlans(plans => plans.filter(plan => plan.id !== planId));
      toast.success('Subscription plan deleted successfully');
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      toast.error('Failed to delete subscription plan');
    }
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
      setEditForm({
        ...editForm,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleUpload = async () => {
    try {
      if (!editForm.file) {
        toast.error('Please select a file to upload');
        return;
      }

      // Handle upload logic here
      // This is a placeholder and should be replaced with actual implementation
      console.log('Uploading file:', editForm.file);

      // Simulate successful upload
      setShowEditModal(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('An error occurred while uploading the file');
    }
  };

  // Avatar upload handler
  const onAvatarDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploadingAvatar(true);
    try {
      const file = acceptedFiles[0];
      // TODO: Implement avatar upload logic
      // const response = await uploadAvatar(file);
      // setProfile(prev => prev ? { ...prev, avatar: response.url } : null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  }, []);

  // Cover photo upload handler
  const onCoverDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploadingCover(true);
    try {
      const file = acceptedFiles[0];
      // TODO: Implement cover photo upload logic
      // const response = await uploadCoverPhoto(file);
      // setProfile(prev => prev ? { ...prev, coverImage: response.url } : null);
    } catch (error) {
      console.error('Error uploading cover photo:', error);
    } finally {
      setIsUploadingCover(false);
    }
  }, []);

  // Avatar dropzone
  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: onAvatarDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false
  });

  // Cover photo dropzone
  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } = useDropzone({
    onDrop: onCoverDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false
  });

  // Filter suggestions based on search query
  const filteredSuggestions = searchType === 'users' 
    ? MOCK_CREATORS.filter(creator => 
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : MOCK_POSTS.filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderPosts = () => {
    return (
      <div className="mt-6 px-4">
        {/* Post Creation Form */}
        <div className="mb-6">
          <CreatePostForm 
            subscriptionPlans={subscriptionPlans}
            onPostCreated={() => {
              // Refresh posts after creation
              loadSubscriptionPlans();
            }}
          />
        </div>

        {/* Posts Feed */}
        <InfiniteFeed
          initialPosts={mockPosts}
          hasMore={true}
          onLoadMore={() => {}}
          isSubscribed={true}
        />
      </div>
    );
  };

  const renderAbout = () => {
    return (
      <div className="mt-6 px-4">
        {/* About section content */}
      </div>
    );
  };

  const renderMedia = () => {
    return (
      <div className="mt-6 px-4">
        {/* Media section content */}
      </div>
    );
  };

  const renderSubscriptions = () => {
    return (
      <div className="mt-6 px-4">
        {/* Subscriptions section content */}
      </div>
    );
  };

  if (isLoading) {
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
        <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Main Content - Profile */}
            <div className="md:col-span-5 lg:col-span-6 xl:col-span-7">
              {/* Cover Photo */}
              <div className="relative h-80 bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full px-4 sm:px-6 lg:px-8">
                  <div {...getCoverRootProps()} className="absolute inset-0">
                    <input {...getCoverInputProps()} />
                    {profile?.coverImage ? (
                      <>
                        <Image
                          src={profile.coverImage}
                          alt="Cover"
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, 672px"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCover();
                          }}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <PhotoIcon className="mx-auto h-10 w-10 text-neutral-400" />
                          <p className="mt-1 text-sm text-neutral-500">
                            Click or drag to upload cover photo
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="flex items-start -mt-16 relative z-10">
                    {/* Avatar */}
                    <div {...getAvatarRootProps()} className="relative">
                      <input {...getAvatarInputProps()} />
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-700">
                        {profile?.avatar ? (
                          <>
                            <Image
                              src={profile.avatar}
                              alt={profile?.username || ''}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAvatar();
                              }}
                              className="absolute top-0 right-0 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <PhotoIcon className="h-8 w-8 text-neutral-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-baseline">
                        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{profile?.username}</h1>
                        {profile?.isVerified && (
                          <span className="ml-2 text-primary-500">
                            <CheckBadgeIcon className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {profile?.bio || 'No bio yet'}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold">{profile?.postsCount || 0}</span>
                          <span className="text-xs text-neutral-500">Posts</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold">{profile?.followersCount || 0}</span>
                          <span className="text-xs text-neutral-500">Followers</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold">{profile?.followingCount || 0}</span>
                          <span className="text-xs text-neutral-500">Following</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between py-3">
                    <nav className="flex space-x-6">
                      <button
                        onClick={() => setActiveTab('posts')}
                        className={`px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'posts'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        Posts
                      </button>
                      <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'subscriptions'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        Subscriptions
                      </button>
                    </nav>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'posts' && renderPosts()}
                {activeTab === 'subscriptions' && (
                  <div className="py-6">
                    <SubscriptionPlans
                      plans={profile?.subscriptionPlans || []}
                      discounts={[]}
                      onAddPlan={() => {}}
                      onUpdatePlan={() => {}}
                      onDeletePlan={() => {}}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Search and Suggestions */}
            <div className="lg:col-span-3">
              <div className="sticky top-0 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                {/* Search Bar */}
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 relative">
                  <div className="p-2 sm:p-3">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100">Search</h2>
                        <div className="flex items-center bg-neutral-100 dark:bg-neutral-700/50 rounded-full p-0.5">
                          <button
                            onClick={() => {
                              setSearchType('users');
                              setSearchQuery('');
                              setShowSuggestions(false);
                            }}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                              searchType === 'users'
                                ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
                            }`}
                          >
                            <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Users</span>
                          </button>
                          <button
                            onClick={() => {
                              setSearchType('posts');
                              setSearchQuery('');
                              setShowSuggestions(false);
                            }}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                              searchType === 'posts'
                                ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
                            }`}
                          >
                            <DocumentTextIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Posts</span>
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          placeholder={searchType === 'users' ? "Search users..." : "Search posts..."}
                          className="w-full pl-8 pr-3 py-1.5 text-sm sm:text-base border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                        />
                        <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 sm:h-5 sm:w-5 text-primary-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested Creators */}
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="p-2 sm:p-3">
                    <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-neutral-900 dark:text-neutral-100">Suggested Creators</h2>
                    <div className="space-y-2 sm:space-y-3">
                      {MOCK_CREATORS.slice(0, 3).map((creator) => (
                        <div key={creator.id} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden mb-2">
                            <Image
                              src={`https://picsum.photos/400/225?random=${creator.id}`}
                              alt={creator.username}
                              width={400}
                              height={225}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image
                              src={creator.avatar}
                              alt={creator.username}
                              width={24}
                              height={24}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                            />
                            <div>
                              <h3 className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100">{creator.username}</h3>
                              <p className="text-xs sm:text-sm text-neutral-500">@{creator.username.toLowerCase()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
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
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                      placeholder="Enter plan name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($/month)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 h-24"
                      placeholder="Enter plan description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                    <textarea
                      value={editForm.features?.join('\n') || ''}
                      onChange={(e) => setEditForm({ ...editForm, features: e.target.value.split('\n').filter(f => f.trim()) })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 h-24"
                      placeholder="Enter features (one per line)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4">Content Access</label>
                    <div className="space-y-3">
                      {editForm.contentAccess && Object.entries(editForm.contentAccess).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setEditForm({
                              ...editForm,
                              contentAccess: {
                                ...editForm.contentAccess,
                                [key]: e.target.checked
                              }
                            })}
                            className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editingPlan) {
                        handleUpdatePlan(editingPlan.id, editForm);
                      } else {
                        handleAddPlan(editForm);
                      }
                      setShowEditModal(false);
                      setEditingPlan(null);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingPlan ? 'Save Changes' : 'Create Plan'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default ProfilePage; 