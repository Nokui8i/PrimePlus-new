import type { ServiceSubscriptionPlan } from '@/types/subscription';
import type { LocalPost } from '@/types/post';
import { defaultContentAccess } from '@/constants/content';

export const mockSubscriptionPlans: ServiceSubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic Plan',
    price: 9.99,
    description: 'Access to regular content',
    isActive: true,
    features: ['Regular content access', 'Monthly updates'],
    intervalInDays: 30,
    contentAccess: defaultContentAccess,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Premium Plan',
    price: 19.99,
    description: 'Access to premium and VR content',
    isActive: true,
    features: ['All Basic Plan features', 'Premium content access', 'VR content access'],
    intervalInDays: 30,
    contentAccess: {
      ...defaultContentAccess,
      premiumVideos: true,
      vrContent: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockPosts: LocalPost[] = [
  {
    id: '1',
    title: 'Welcome to my profile!',
    content: 'This is my first post on PrimePlus+',
    description: 'Welcome post',
    thumbnail: '/images/default-thumbnail.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: {
      id: '1',
      username: 'demo_user',
      fullName: 'Demo User',
      avatar: '/images/default-avatar.png'
    },
    likes: 0,
    comments: 0,
    views: 0,
    isPremium: false,
    media: [],
    isEditing: false,
    authorId: '1'
  }
]; 