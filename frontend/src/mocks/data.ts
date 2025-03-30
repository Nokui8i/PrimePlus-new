import type { SubscriptionPlan, ContentTypeAccess } from '@/types/subscription';
import type { LocalPost } from '@/types/post';

export const defaultContentAccess: ContentTypeAccess = {
  regularContent: true,
  premiumVideos: false,
  vrContent: false,
  threeSixtyContent: false,
  liveRooms: false,
  interactiveModels: false
};

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Access to basic content',
    price: 9.99,
    intervalInDays: 30,
    features: ['Access to basic content', 'HD streaming', 'No ads'],
    isActive: true,
    contentAccess: {
      ...defaultContentAccess,
      regularContent: true
    }
  },
  {
    id: '2',
    name: 'Premium',
    description: 'Access to all content including VR',
    price: 19.99,
    intervalInDays: 30,
    features: ['Access to all content', '4K streaming', 'VR content', 'Priority support'],
    isActive: true,
    contentAccess: {
      regularContent: true,
      premiumVideos: true,
      vrContent: true,
      threeSixtyContent: true,
      liveRooms: true,
      interactiveModels: true
    }
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