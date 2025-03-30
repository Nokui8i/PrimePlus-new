import type { SubscriptionPlan } from './subscription';

export interface Profile {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  isVerified?: boolean;
  isCreator?: boolean;
  joinDate: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  subscriptionPlans?: SubscriptionPlan[];
  discounts: any[]; // TODO: Replace with proper type
  defaultSubscriptionPrice: number;
  freeAccessList: any[]; // TODO: Replace with proper type
  subscribedTo: string[];
  createdAt?: string;
  updatedAt?: string;
} 