import type { ContentTypeAccess } from './content';

export interface ContentTypeAccess {
  regularContent: boolean;
  premiumVideos: boolean;
  vrContent: boolean;
  threeSixtyContent: boolean;
  liveRooms: boolean;
  interactiveModels: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  intervalInDays: number;
  features: string[];
  isActive: boolean;
  contentAccess: ContentTypeAccess;
  createdAt?: string;
  updatedAt?: string;
}

export interface Discount {
  id: string;
  code: string;
  percentage: number;
  validUntil: string;
  isActive: boolean;
}

export interface ExtendedProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  isVerified?: boolean;
  location?: string;
  website?: string;
  isCreator?: boolean;
  joinDate?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  subscriptionPlans: SubscriptionPlan[];
  discounts: Discount[];
  defaultSubscriptionPrice: number;
  freeAccessList: Array<{ userId: string; grantedAt: string }>;
  subscribedTo: string[];
}

export interface Subscriber {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  planId: string;
  planName: string;
  planPrice: number;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  startDate: string;
  renewalDate: string;
  cancellationDate: string | null;
}

export interface SubscriptionAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  churnRate: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  conversionRate: number;
  retentionRate: number;
  totalRevenue: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  description: string;
  features: string[];
  subscriberCount: number;
  isActive: boolean;
}

export interface SubscriptionPayment {
  id: string;
  subscriberId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface ContentAccess {
  regularContent: boolean;
  premiumVideos: boolean;
  vrContent: boolean;
  threeSixtyContent: boolean;
  liveRooms: boolean;
  interactiveModels: boolean;
}

export interface ServiceSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  features: string[];
  intervalInDays: number;
  contentAccess: ContentAccess;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface SubscriptionEvent {
  id: string;
  subscriberId: string;
  type: 'created' | 'renewed' | 'cancelled' | 'payment_failed' | 'plan_changed';
  date: string;
  metadata: Record<string, any>;
} 