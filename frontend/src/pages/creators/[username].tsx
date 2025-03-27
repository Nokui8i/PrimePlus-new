import React, { useState, useEffect } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CreditCardIcon, 
  UserGroupIcon,
  CalendarIcon,
  CheckIcon,
  StarIcon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatDate } from '@/lib/utils';

// ממשק ליוצר תוכן
interface Creator {
  username: string;
  fullName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  isVerified: boolean;
  location: string;
  joinedDate: string;
  stats: {
    subscribers: number;
    posts: number;
    likes: number;
  };
  subscriptionPlans: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    isPopular?: boolean;
  }[];
}

// ממשק לפוסט/תוכן
interface Post {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  type: 'photo' | 'video' | 'text';
  isPremium: boolean;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: string;
  tags: string[];
}

// דף פרופיל יוצר
const CreatorProfilePage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  
  // סטייט לטאבים פעילים
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'plans'>('posts');
  
  // נתונים לדוגמה של היוצר (יבואו מהשרת בעתיד)
  const [creator, setCreator] = useState<Creator>({
    username: 'emily_photos',
    fullName: 'Emily Johnson',
    bio: 'Professional photographer specializing in landscape and portrait photography. Sharing my creative process, behind-the-scenes content, and exclusive photo collections with my subscribers.',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    coverImage: 'https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=2070',
    isVerified: true,
    location: 'Tel Aviv, Israel',
    joinedDate: '2022-06-15',
    stats: {
      subscribers: 1458,
      posts: 287,
      likes: 15420
    },
    subscriptionPlans: [
      {
        id: 'basic',
        name: 'Basic',
        price: 5.99,
        description: 'Access to regular content and updates',
        features: [
          'Full access to public posts',
          'Weekly photo collections',
          'Comment on posts',
          'Basic support'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 14.99,
        description: 'Full access with exclusive benefits',
        features: [
          'All Basic plan features',
          'Exclusive photo collections',
          'Behind-the-scenes content',
          'Early access to new content',
          'Direct messaging',
          'Priority support'
        ],
        isPopular: true
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 29.99,
        description: 'Ultimate experience with premium perks',
        features: [
          'All Premium plan features',
          'Custom photo requests',
          'Monthly digital downloads',
          'Exclusive VR content',
          'Video tutorials and guides',
          'One-on-one virtual sessions'
        ]
      }
    ]
  });
  
  // נתוני דוגמה של פוסטים (יבואו מהשרת בהמשך)
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post1',
      title: 'Sunset at Tel Aviv Beach',
      description: 'Captured this breathtaking sunset yesterday at Tel Aviv beach. The colors were absolutely magical!',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?q=80&w=2070',
      type: 'photo',
      isPremium: false,
      likes: 245,
      comments: 32,
      isLiked: false,
      timestamp: '2024-03-20T18:30:00Z',
      tags: ['sunset', 'beach', 'photography']
    },
    {
      id: 'post2',
      title: 'Advanced Portrait Lighting Techniques',
      description: 'In this premium tutorial, I break down my approach to portrait lighting in difficult environments.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070',
      type: 'video',
      isPremium: true,
      likes: 189,
      comments: 48,
      isLiked: true,
      timestamp: '2024-03-18T14:15:00Z',
      tags: ['tutorial', 'portrait', 'lighting']
    },
    {
      id: 'post3',
      title: 'Jerusalem Old City Collection',
      description: 'My latest photo collection from the historic streets of Jerusalem. Exploring ancient architecture and the vibrant culture.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=2074',
      type: 'photo',
      isPremium: true,
      likes: 312,
      comments: 65,
      isLiked: false,
      timestamp: '2024-03-15T10:45:00Z',
      tags: ['jerusalem', 'travel', 'architecture']
    },
    {
      id: 'post4',
      title: 'Behind the Scenes: Desert Photoshoot',
      description: 'Take a look at my recent photoshoot process in the Negev Desert. Sharing my equipment setup and challenges.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021',
      type: 'video',
      isPremium: false,
      likes: 178,
      comments: 29,
      isLiked: true,
      timestamp: '2024-03-10T09:20:00Z',
      tags: ['behindthescenes', 'desert', 'photoshoot']
    }
  ]);
  
  // לייק לפוסט
  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };
  
  // פורמט לזמן הפוסט
  const formatPostDate = (dateString: string): string => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return formatDate(postDate);
    }
  };
  
  // נגישות לקוד לסוגי פוסטים
  const getPostTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon className="w-5 h-5" />;
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />;
      case 'text':
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };
  
  // תוכן הטאב פוסטים
  const renderPostsTab = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="card overflow-hidden flex flex-col">
            {/* טמבנייל הפוסט */}
            <div className="relative">
              <img 
                src={post.thumbnailUrl} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              
              {/* אינדיקטור של תוכן פרימיום */}
              {post.isPremium && (
                <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
                  Premium
                </div>
              )}
              
              {/* אינדיקטור לסוג תוכן */}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                {getPostTypeIcon(post.type)}
                <span className="ml-1 capitalize">{post.type}</span>
              </div>
            </div>
            
            {/* תוכן הפוסט */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2 line-clamp-1">
                {post.title}
              </h3>
              
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2">
                {post.description}
              </p>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>{formatPostDate(post.timestamp)}</span>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center"
                    >
                      {post.isLiked ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                      <span className="ml-1">{post.likes}</span>
                    </button>
                    
                    <div className="flex items-center">
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span className="ml-1">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* כפתור צפייה */}
            <Link 
              href={`/posts/${post.id}`}
              className={`w-full py-2 text-center ${
                post.isPremium 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white'
              }`}
            >
              {post.isPremium ? 'Subscribe to View' : 'View Post'}
            </Link>
          </div>
        ))}
      </div>
    );
  };
  
  // תוכן הטאב אודות
  const renderAboutTab = () => {
    return (
      <div className="card">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">About {creator.fullName}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-3">Bio</h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              {creator.bio}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-3">Location</h3>
              <div className="flex items-center text-neutral-700 dark:text-neutral-300">
                <UserIcon className="w-5 h-5 text-neutral-500 mr-2" />
                <span>{creator.location}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-3">Joined</h3>
              <div className="flex items-center text-neutral-700 dark:text-neutral-300">
                <CalendarIcon className="w-5 h-5 text-neutral-500 mr-2" />
                <span>{formatDate(creator.joinedDate, 'en-US')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-3">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="font-bold text-2xl text-primary-600">{creator.stats.subscribers}</div>
                <div className="text-neutral-500 text-sm">Subscribers</div>
              </div>
              
              <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="font-bold text-2xl text-primary-600">{creator.stats.posts}</div>
                <div className="text-neutral-500 text-sm">Posts</div>
              </div>
              
              <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="font-bold text-2xl text-primary-600">{creator.stats.likes}</div>
                <div className="text-neutral-500 text-sm">Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // תוכן הטאב של תוכניות מנויים
  const renderPlansTab = () => {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">Subscription Plans</h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Choose a plan that works for you and get exclusive access to {creator.fullName}'s content.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creator.subscriptionPlans.map(plan => (
              <div 
                key={plan.id} 
                className={`border rounded-xl p-6 relative ${
                  plan.isPopular 
                    ? 'border-primary-500 dark:border-primary-500' 
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 right-4 bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">${plan.price}</span>
                  <span className="text-neutral-500 text-sm">/month</span>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-2 rounded-lg font-medium ${
                    plan.isPopular 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                      : 'border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                  }`}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card bg-neutral-50 dark:bg-neutral-800">
          <div className="flex items-start">
            <div className="mr-4 text-primary-600">
              <StarIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                All subscriptions include:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-neutral-700 dark:text-neutral-300">Cancel anytime</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-neutral-700 dark:text-neutral-300">Secure payment processing</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-neutral-700 dark:text-neutral-300">Support the creator directly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout title={`${creator.fullName} - PrimePlus+`}>
      <div>
        {/* Cover Image */}
        <div className="h-60 md:h-80 w-full relative">
          <img 
            src={creator.coverImage} 
            alt={`${creator.fullName}'s cover`} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Creator basic info on cover */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
            <div className="flex items-center">
              <div className="mr-4 relative">
                <img 
                  src={creator.avatar} 
                  alt={creator.fullName} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"
                />
                {creator.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-1 border-2 border-white">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                  {creator.fullName}
                  {creator.isVerified && (
                    <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                      <CheckIcon className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  )}
                </h1>
                <p className="text-white/80">@{creator.username}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Stats and Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <UserGroupIcon className="w-5 h-5 text-neutral-500 mr-2" />
                <span className="font-semibold">{creator.stats.subscribers}</span>
                <span className="text-neutral-500 ml-1">Subscribers</span>
              </div>
              
              <div className="flex items-center">
                <DocumentTextIcon className="w-5 h-5 text-neutral-500 mr-2" />
                <span className="font-semibold">{creator.stats.posts}</span>
                <span className="text-neutral-500 ml-1">Posts</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="btn-primary py-2 px-6 flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Message
              </button>
              
              <button className="btn-outline py-2 px-6">
                Subscribe
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`pb-4 px-1 font-medium ${
                  activeTab === 'posts' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                Posts
              </button>
              
              <button 
                onClick={() => setActiveTab('about')}
                className={`pb-4 px-1 font-medium ${
                  activeTab === 'about' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                About
              </button>
              
              <button 
                onClick={() => setActiveTab('plans')}
                className={`pb-4 px-1 font-medium ${
                  activeTab === 'plans' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                Subscription Plans
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === 'posts' && renderPostsTab()}
            {activeTab === 'about' && renderAboutTab()}
            {activeTab === 'plans' && renderPlansTab()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorProfilePage; 