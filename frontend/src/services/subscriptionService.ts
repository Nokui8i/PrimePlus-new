import axios from 'axios';
import { 
  Subscriber, 
  SubscriptionPlan, 
  SubscriptionAnalytics 
} from '@/types/subscription';
import { API_URL } from '@/config/constants';
import api from './api';

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
  intervalInDays: number;
  description?: string;
  features?: string[];
}

interface GetPlansResponse {
  plans: SubscriptionPlan[];
}

const SubscriptionService = {
  getAvailablePlans: () => {
    return api.get<GetPlansResponse>('/api/subscription/plans');
  },
  
  createPlan: (planData: Omit<SubscriptionPlan, 'id'>) => {
    return api.post<{ plan: SubscriptionPlan }>('/api/subscription/plans', planData);
  },
  
  updatePlan: (planId: string, planData: Partial<SubscriptionPlan>) => {
    return api.put<{ plan: SubscriptionPlan }>(`/api/subscription/plans/${planId}`, planData);
  },
  
  deletePlan: (planId: string) => {
    return api.delete(`/api/subscription/plans/${planId}`);
  }
};

/**
 * Get all subscription plans
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await axios.get(`${API_URL}/subscription/plans`);
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
    const response = await axios.get(`${API_URL}/subscription/plans/${planId}`);
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
  plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SubscriptionPlan | null> => {
  try {
    const response = await axios.post(`${API_URL}/subscription/plans`, plan);
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
  plan: Partial<SubscriptionPlan>
): Promise<SubscriptionPlan | null> => {
  try {
    const response = await axios.put(`${API_URL}/subscription/plans/${planId}`, plan);
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
    await axios.delete(`${API_URL}/subscription/plans/${planId}`);
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
    const response = await axios.get(
      `${API_URL}/subscription/subscribers?page=${page}&limit=${limit}`
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
    const response = await axios.get(`${API_URL}/subscription/subscribers/${subscriberId}`);
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
    await axios.post(`${API_URL}/subscription/subscribers/${subscriberId}/cancel`);
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
    const response = await axios.get(`${API_URL}/subscription/analytics`);
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
      retentionRate: 0
    };
  }
};

export const subscriptionService = {
  async getActiveSubscriptions(): Promise<Subscription[]> {
    const response = await axios.get(`${API_URL}/subscriptions/active`);
    return response.data;
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await axios.post(`${API_URL}/subscriptions/${subscriptionId}/cancel`);
  }
};

export default SubscriptionService;
