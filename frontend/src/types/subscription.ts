export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  features: string[];
  intervalInDays: number;
}

export interface Discount {
  id: string;
  code: string;
  percentage: number;
  validUntil: Date;
  isActive: boolean;
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

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing' | 'unpaid';

export interface SubscriptionEvent {
  id: string;
  subscriberId: string;
  type: 'created' | 'renewed' | 'cancelled' | 'payment_failed' | 'plan_changed';
  date: string;
  metadata: Record<string, any>;
} 