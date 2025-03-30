import { Subscriber } from '@/types/subscription';
import api from './api';
import mockStorage from './mockStorage';
import { mockSubscriptionPlans } from '@/mocks/data';
import type { ServiceSubscriptionPlan, Subscription } from '@/types/subscription';

export interface ContentTypeAccess {
  regularContent: boolean;
  premiumVideos: boolean;
  vrContent: boolean;
  threeSixtyContent: boolean;
  liveRooms: boolean;
  interactiveModels: boolean;
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

export interface Subscription {
  id: string;
  creator?: {
    username?: string;
    fullName?: string;
    profileImage?: string;
  };
  plan?: {
    name?: string;
    price?: number;
  };
  price: number;
  interval: 'monthly' | 'quarterly' | 'biannual' | 'yearly';
  status: 'active' | 'trial' | 'cancelled' | 'past_due' | 'unpaid';
  renewalDate?: string;
  startDate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  intervalInDays: number;
  isActive: boolean;
  contentAccess: ContentTypeAccess;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionPlanDto {
  name: string;
  price: number;
  description: string;
  features: string[];
  intervalInDays: number;
  isActive: boolean;
  contentAccess: ContentTypeAccess;
}

export interface UpdateSubscriptionPlanDto {
  name?: string;
  price?: number;
  description?: string;
  features?: string[];
  intervalInDays?: number;
  isActive?: boolean;
  contentAccess?: ContentTypeAccess;
}

/**
 * Get all subscription plans
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await api.get('/subscription/plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
};

/**
 * Get a specific subscription plan by ID
 */
export const getSubscriptionPlan = async (planId: string): Promise<SubscriptionPlan | null> => {
  try {
    const response = await api.get(`/subscription/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subscription plan ${planId}:`, error);
    return null;
  }
};

/**
 * Create a new subscription plan
 */
export const createSubscriptionPlan = async (
  plan: CreateSubscriptionPlanDto
): Promise<SubscriptionPlan | null> => {
  try {
    const response = await api.post('/subscription/plans', plan);
    return response.data;
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return null;
  }
};

/**
 * Update an existing subscription plan
 */
export const updateSubscriptionPlan = async (
  planId: string,
  plan: UpdateSubscriptionPlanDto
): Promise<SubscriptionPlan | null> => {
  try {
    const response = await api.put(`/subscription/plans/${planId}`, plan);
    return response.data;
  } catch (error) {
    console.error(`Error updating subscription plan ${planId}:`, error);
    return null;
  }
};

/**
 * Delete a subscription plan
 */
export const deleteSubscriptionPlan = async (planId: string): Promise<boolean> => {
  try {
    await api.delete(`/subscription/plans/${planId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting subscription plan ${planId}:`, error);
    return false;
  }
};

/**
 * Get subscribers with pagination
 */
export const getSubscribers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ subscribers: Subscriber[]; total: number; totalPages: number }> => {
  try {
    const response = await api.get(
      `/subscription/subscribers?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return { subscribers: [], total: 0, totalPages: 0 };
  }
};

/**
 * Get a specific subscriber by ID
 */
export const getSubscriber = async (subscriberId: string): Promise<Subscriber | null> => {
  try {
    const response = await api.get(`/subscription/subscribers/${subscriberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subscriber ${subscriberId}:`, error);
    return null;
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (subscriberId: string): Promise<boolean> => {
  try {
    await api.post(`/subscription/subscribers/${subscriberId}/cancel`);
    return true;
  } catch (error) {
    console.error(`Error cancelling subscription for ${subscriberId}:`, error);
    return false;
  }
};

/**
 * Get subscription analytics
 */
export const getSubscriptionAnalytics = async (): Promise<SubscriptionAnalytics> => {
  try {
    const response = await api.get('/subscription/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription analytics:', error);
    return {
      totalSubscribers: 0,
      activeSubscribers: 0,
      churnRate: 0,
      monthlyRecurringRevenue: 0,
      averageRevenuePerUser: 0,
      conversionRate: 0,
      retentionRate: 0,
      totalRevenue: 0
    };
  }
};

export const subscriptionService = {
  async getActiveSubscriptions(): Promise<Subscription[]> {
    const response = await api.get('/subscriptions/active');
    return response.data;
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await api.post(`/subscriptions/${subscriptionId}/cancel`);
  },

  getPlans: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSubscriptionPlans;
  },

  getCurrentSubscription: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const subscriptions = mockStorage.getSubscriptions() as Subscription[];
    const currentUser = mockStorage.getCurrentUser();
    
    if (!currentUser) return null;
    
    return subscriptions.find(sub => 
      sub.userId === currentUser.id && 
      sub.status === 'active'
    );
  },

  subscribe: async (planId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = mockStorage.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');

    const subscription: Subscription = {
      id: String(Date.now()),
      userId: currentUser.id,
      planId: plan.id,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.intervalInDays * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true
    };

    const subscriptions = mockStorage.getSubscriptions() as Subscription[];
    mockStorage.set('primePlus_subscriptions', [...subscriptions, subscription]);

    return subscription;
  },

  cancelSubscription: async (subscriptionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockStorage.update('primePlus_subscriptions', (subscriptions: Subscription[]) => {
      return subscriptions.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'cancelled' as const, autoRenew: false }
          : sub
      );
    });
  },

  createPlan: async (planData: Partial<ServiceSubscriptionPlan>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = mockStorage.getCurrentUser();
    if (currentUser?.role !== 'admin') throw new Error('Unauthorized');

    const newPlan: ServiceSubscriptionPlan = {
      ...planData,
      id: String(Date.now()),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as ServiceSubscriptionPlan;

    const plans = mockStorage.get('primePlus_subscription_plans') || mockSubscriptionPlans;
    mockStorage.set('primePlus_subscription_plans', [...plans, newPlan]);

    return newPlan;
  },

  updatePlan: async (planId: string, updates: Partial<ServiceSubscriptionPlan>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentUser = mockStorage.getCurrentUser();
    if (currentUser?.role !== 'admin') throw new Error('Unauthorized');

    return mockStorage.update('primePlus_subscription_plans', (plans: ServiceSubscriptionPlan[]) => {
      return plans.map(plan => 
        plan.id === planId 
          ? { ...plan, ...updates, updatedAt: new Date().toISOString() }
          : plan
      );
    });
  },

  deletePlan: async (planId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentUser = mockStorage.getCurrentUser();
    if (currentUser?.role !== 'admin') throw new Error('Unauthorized');

    return mockStorage.update('primePlus_subscription_plans', (plans: ServiceSubscriptionPlan[]) => {
      return plans.filter(plan => plan.id !== planId);
    });
  }
};

export default subscriptionService;
