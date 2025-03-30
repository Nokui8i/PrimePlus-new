import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
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
import SubscriptionPlans from '@/components/profile/SubscriptionPlans';
import type { Profile } from '@/types/profile';
import type { MediaItem } from '@/types/media';
import type { MediaUploadResponse } from '@/types/media';
import type { ExtendedProfile, SubscriptionPlan, Discount, ContentTypeAccess } from '@/types/subscription';
import type { Post, Creator } from '@/types/post';
import CreatePostForm from '@/components/content/CreatePostForm';
import { getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '@/services/subscriptionService';
import { toast } from 'react-hot-toast';
import SubscriptionService from '@/services/subscriptionService';
import { defaultContentAccess, mockSubscriptionPlans } from '@/mocks/data';
import { useDropzone } from 'react-dropzone';
import { containers, typography, contentSizes, commonStyles, layout } from '@/styles/design-system';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import BioEditor from '@/components/profile/BioEditor';
import { userService } from '@/services/userService';
import { v4 as uuidv4 } from 'uuid';

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
interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  username: string;
  avatar?: string;
}

interface PostMedia {
  url: string;
  type: 'vr' | 'image' | 'video';
  thumbnail: string;
  subscriptionPackId: string | null;
  includeInSubscription: boolean;
  individualPrice?: number;
}

interface BasePost {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  likes: number;
  views: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
}

interface LocalPost extends BasePost {
  isEditing: boolean;
  creator: Creator;
  media?: PostMedia[];
  comments: Comment[];
}

interface EditFormState {
  name?: string;
  price?: number;
  description?: string;
  features?: string[];
  intervalInDays?: number;
  contentAccess?: ContentTypeAccess;
  file?: File;
  previewUrl?: string;
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

interface ProfileWithStats extends ExtendedProfile {
  totalRevenue: number;
}

interface UpdateProfileResponse extends Profile {}

interface MockCreator {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: number;
  posts: number;
  isVerified: boolean;
}

const mockDiscounts: Discount[] = [
  {
    id: '1',
    code: 'WELCOME2024',
    percentage: 20,
    validUntil: '2024-12-31T23:59:59Z',
    isActive: true
  }
];

const mockPosts: Post[] = [
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
      avatar: '/images/avatar1.jpg',
      followers: 1000,
      posts: 10,
      isVerified: true
    },
    likes: 10,
    comments: [],
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

const mockCreators: Creator[] = [
  {
    id: '1',
    username: 'creator1',
    fullName: 'John Creator',
    avatar: '/images/avatar1.jpg',
    followers: 1000,
    posts: 10,
    isVerified: true
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

// Update the defaultPlan type
const defaultPlan: SubscriptionPlan = {
  id: uuidv4(),
  name: 'Basic Plan',
  description: 'Access to regular content',
  price: 9.99,
  intervalInDays: 30,
  features: ['Regular content access', 'Monthly updates'],
  isActive: true,
  contentAccess: defaultContentAccess
};

const ProfilePage: FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editFormState, setEditFormState] = useState<EditFormState>({});
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'users' | 'posts'>('users');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOwnProfile = user?.username === username;
  const [error, setError] = useState<string | null>(null);

  const handleBioSave = async (newBio: string) => {
    try {
      const updatedUser = await userService.updateProfile({
        bio: newBio,
        displayName: profile?.fullName || '',
        location: profile?.location || '',
        websiteUrl: profile?.website || '',
        amazonWishlist: '',
        profileImage: profile?.avatar || '',
        coverImage: profile?.coverImage || ''
      });
      
      if (profile && updatedUser) {
        setProfile({
          ...profile,
          bio: newBio
        });
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      throw error;
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    
    try {
      const response = await userService.uploadProfileImage(file);
      if (profile && response.url) {
        setProfile({
          ...profile,
          avatar: response.url
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!file) return;
    
    try {
      const response = await userService.uploadProfileImage(file);
      if (profile && response.url) {
        setProfile({
          ...profile,
          coverImage: response.url
        });
      }
    } catch (error) {
      console.error('Error uploading cover image:', error);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!router.isReady) return;
      
      try {
        setIsLoading(true);
        if (!username) {
          setProfile(mockProfile);
          return;
        }
        
        const profileData = await userService.getCurrentUser();
        const contentAccess: ContentTypeAccess = {
          regularContent: true,
          premiumVideos: false,
          vrContent: false,
          threeSixtyContent: false,
          liveRooms: false,
          interactiveModels: false
        };

        const newProfile: ExtendedProfile = {
          id: profileData.id,
          username: profileData.username,
          fullName: profileData.fullName || '',
          email: profileData.email,
          bio: profileData.bio || '',
          avatar: profileData.avatar,
          coverImage: '',
          isVerified: profileData.isVerified,
          location: profileData.location,
          website: profileData.website,
          isCreator: profileData.role === 'creator',
          joinDate: new Date().toISOString(),
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          subscriptionPlans: [defaultPlan],
          discounts: [],
          defaultSubscriptionPrice: 0,
          freeAccessList: [],
          subscribedTo: []
        };

        setProfile(newProfile);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router.isReady, username]);

  const loadSubscriptionPlans = async () => {
    try {
      const fetchedPlans = await getSubscriptionPlans();
      const plansWithAccess = fetchedPlans.map(plan => ({
        ...plan,
        contentAccess: plan.contentAccess || { ...defaultContentAccess },
        createdAt: plan.createdAt || new Date().toISOString(),
        updatedAt: plan.updatedAt || new Date().toISOString()
      })) as SubscriptionPlan[];
      
      setSubscriptionPlans(plansWithAccess);
      setProfile(currentProfile => {
        if (!currentProfile) return currentProfile;
        return {
          ...currentProfile,
          subscriptionPlans: plansWithAccess
        };
      });
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      toast.error('Failed to load subscription plans');
    }
  };

  const handleEdit = () => {
    const activePlan = profile?.subscriptionPlans.find(plan => plan.isActive);
    if (activePlan) {
      setEditingPlan(activePlan);
      setEditFormState({
        name: activePlan.name,
        price: activePlan.price,
        description: activePlan.description,
        features: activePlan.features,
        intervalInDays: activePlan.intervalInDays,
        contentAccess: activePlan.contentAccess
      });
    }
  };

  const handleSave = () => {
    if (!profile) return;

    setProfile({
      ...profile,
      ...editFormState,
    });
    setEditingPlan(null);
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

  const handleCreatePlan = async () => {
    if (!editFormState.name || !editFormState.price || !editFormState.description || !editFormState.features || !editFormState.intervalInDays) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newPlan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      name: editFormState.name,
      price: editFormState.price,
      description: editFormState.description,
      features: editFormState.features,
      intervalInDays: editFormState.intervalInDays,
      contentAccess: editFormState.contentAccess || defaultContentAccess,
      isActive: true
    };

    try {
      const response = await createSubscriptionPlan(newPlan);
      if (response) {
        setSubscriptionPlans(prev => [...prev, response]);
        setEditFormState({});
        toast.success('Subscription plan created successfully');
      }
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast.error('Failed to create subscription plan');
    }
  };

  const handleUpdatePlan = async (planId: string) => {
    if (!editFormState.name || !editFormState.price || !editFormState.description || !editFormState.features || !editFormState.intervalInDays) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedPlan: Partial<SubscriptionPlan> = {
      name: editFormState.name,
      price: editFormState.price,
      description: editFormState.description,
      features: editFormState.features,
      intervalInDays: editFormState.intervalInDays,
      contentAccess: editFormState.contentAccess
    };

    try {
      const response = await updateSubscriptionPlan(planId, updatedPlan);
      if (response) {
        setSubscriptionPlans(prev => prev.map(plan => plan.id === planId ? response : plan));
        setEditingPlan(null);
        setEditFormState({});
        toast.success('Subscription plan updated successfully');
      }
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
      setEditFormState({
        ...editFormState,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleUpload = async () => {
    try {
      if (!editFormState.file) {
        toast.error('Please select a file to upload');
        return;
      }

      // Handle upload logic here
      // This is a placeholder and should be replaced with actual implementation
      console.log('Uploading file:', editFormState.file);

      // Simulate successful upload
      setEditingPlan(null);
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

  // Update the filtered suggestions
  const filteredSuggestions = searchType === 'users' 
    ? mockCreators.filter((creator: Creator) => 
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : mockPosts.filter((post: Post) =>
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

  const handleContentAccessChange = (key: keyof ContentTypeAccess, checked: boolean) => {
    setEditFormState(currentForm => ({
      ...currentForm,
      contentAccess: {
        ...currentForm.contentAccess,
        [key]: checked
      } as ContentTypeAccess
    }));
  };

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
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
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
              <div className="relative h-80 bg-neutral-200 dark:bg-neutral-800 rounded-t-xl overflow-hidden">
                <div className="h-full">
                  <div {...getCoverRootProps()} className="absolute inset-0">
                    <input {...getCoverInputProps()} />
                    {profile?.coverImage ? (
                      <>
                        <Image
                          src={profile.coverImage}
                          alt="Cover"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 672px"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCover();
                          }}
                          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400" />
                          <p className="mt-2 text-sm text-neutral-500">
                            Click or drag to upload cover photo
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Picture - Adjusted position */}
              <div className="relative px-4 sm:px-6 lg:px-8 -mt-28 z-10">
                <div {...getAvatarRootProps()} className="relative inline-block group">
                  <input {...getAvatarInputProps()} />
                  <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-white dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-700 shadow-lg">
                    {profile?.avatar ? (
                      <>
                        <Image
                          src={profile.avatar}
                          alt={profile?.username || ''}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAvatar();
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-neutral-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info - Connected to cover photo */}
              <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 -mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-3">
                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row items-start gap-2">
                      {/* Left side - empty space for profile picture alignment */}
                      <div className="w-40 hidden sm:block"></div>
                      
                      {/* Right side - profile info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-baseline gap-2">
                          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{profile?.username}</h1>
                          {profile?.isVerified && (
                            <span className="text-primary-500">
                              <CheckBadgeIcon className="w-6 h-6" />
                            </span>
                          )}
                        </div>
                        
                        {/* Stats */}
                        <div className="mt-1.5 flex items-center space-x-6 text-sm text-neutral-600 dark:text-neutral-400">
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white">{profile?.postsCount || 0}</span> posts
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white">{profile?.followersCount || 0}</span> followers
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white">{profile?.followingCount || 0}</span> following
                          </div>
                        </div>

                        {/* Bio section */}
                        <div className="mt-1.5 max-w-2xl">
                          <BioEditor
                            initialBio={profile?.bio || 'This is a placeholder bio for development'}
                            onSave={handleBioSave}
                            isOwnProfile={true}
                          />
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
                      {mockCreators.slice(0, 3).map((creator) => (
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
        {editingPlan && (
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
                    Edit Plan
                  </h3>
                  <button
                    onClick={() => setEditingPlan(null)}
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
                      value={editFormState.name}
                      onChange={(e) => setEditFormState({ ...editFormState, name: e.target.value })}
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
                      value={editFormState.price}
                      onChange={(e) => setEditFormState({ ...editFormState, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={editFormState.description}
                      onChange={(e) => setEditFormState({ ...editFormState, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 h-24"
                      placeholder="Enter plan description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                    <textarea
                      value={editFormState.features?.join('\n') || ''}
                      onChange={(e) => setEditFormState({ ...editFormState, features: e.target.value.split('\n').filter(f => f.trim()) })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 h-24"
                      placeholder="Enter features (one per line)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4">Content Access</label>
                    <div className="space-y-3">
                      {editFormState.contentAccess && Object.entries(editFormState.contentAccess).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleContentAccessChange(key as keyof ContentTypeAccess, e.target.checked)}
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
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUpdatePlan(editingPlan.id);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
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