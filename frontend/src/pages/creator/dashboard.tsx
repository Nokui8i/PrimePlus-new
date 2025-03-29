import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/providers/AuthProvider';
import MainLayout from '@/components/layouts/MainLayout';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  VideoCameraIcon,
  PhotoIcon,
  CubeIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  GiftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubscriptionPlan, ContentTypeAccess } from '@/services/subscriptionService';
import { getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '@/services/subscriptionService';
import { toast } from 'react-hot-toast';
import type { MonetizationSettingsData, PayoutSettingsData } from '@/types/settings';
import type { PrivacySettingsData } from '@/types/privacy';
import type { User } from '@/types/user';

// Types
interface DashboardStats {
  totalRevenue: number;
  totalSubscribers: number;
  totalPosts: number;
  totalViews: number;
}

interface LocalDiscount {
  id: string;
  code: string;
  percentage: number;
  validUntil: string;
  isActive: boolean;
}

interface PlanEditForm {
  name: string;
  price: number;
  description: string;
  features: string[];
  contentAccess: ContentTypeAccess;
  intervalInDays: number;
  isActive: boolean;
}

interface PayoutSettings {
  payoutMethod: 'bank' | 'paypal' | 'stripe';
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  paypalEmail?: string;
  minimumPayout: number;
  autoPayoutThreshold: number;
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
}

const defaultContentAccess: ContentTypeAccess = {
  regularContent: true,
  premiumVideos: false,
  vrContent: false,
  threeSixtyContent: false,
  liveRooms: false,
  interactiveModels: false
};

const defaultMonetizationSettings: MonetizationSettingsData = {
  enableTips: true,
  minTipAmount: 1,
  maxTipAmount: 1000,
  enablePayPerView: true,
  minPrice: 1,
  maxPrice: 100
};

const defaultPrivacySettings: PrivacySettingsData = {
  profileVisibility: 'public',
  showActivity: true,
  showFollowers: true,
  showFollowing: true,
  allowMessages: 'everyone',
  allowComments: 'everyone',
  blockList: []
};

const defaultPlanForm: PlanEditForm = {
  name: 'New Plan',
  price: 9.99,
  description: 'Access to exclusive content',
  features: ['Access to basic content', 'Early access to new content'],
  contentAccess: defaultContentAccess,
  intervalInDays: 30,
  isActive: true
};

const defaultPayoutSettings: PayoutSettings = {
  payoutMethod: 'bank',
  bankInfo: {
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    accountHolderName: ''
  },
  minimumPayout: 50,
  autoPayoutThreshold: 100,
  payoutSchedule: 'monthly'
};

const CreatorDashboard: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'monetization'>('overview');
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editForm, setEditForm] = useState<PlanEditForm>(defaultPlanForm);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalSubscribers: 0,
    totalPosts: 0,
    totalViews: 0
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>(defaultPayoutSettings);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!authLoading && user && user.role !== 'creator') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, authLoading, router, user]);

  useEffect(() => {
    loadSubscriptionPlans();
    // Load other initial data here
  }, []);

  const loadSubscriptionPlans = async () => {
    try {
      const plans = await getSubscriptionPlans();
      setSubscriptionPlans(plans);
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      toast.error('Failed to load subscription plans');
    }
  };

  const handleAddPlan = async (newPlan: PlanEditForm) => {
    try {
      // Create a new plan with mock data for development
      const createdPlan: SubscriptionPlan = {
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID
        name: newPlan.name,
        price: newPlan.price,
        description: newPlan.description,
        features: newPlan.features,
        intervalInDays: newPlan.intervalInDays,
        isActive: newPlan.isActive,
        contentAccess: newPlan.contentAccess,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSubscriptionPlans(prev => [...prev, createdPlan]);
      toast.success('Subscription plan created successfully');
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast.error('Failed to create subscription plan');
    }
  };

  const handleUpdatePlan = async (planId: string, updates: Partial<SubscriptionPlan>) => {
    try {
      await updateSubscriptionPlan(planId, updates);
      setSubscriptionPlans(plans =>
        plans.map(plan =>
          plan.id === planId
            ? { ...plan, ...updates, updatedAt: new Date().toISOString() }
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
      await deleteSubscriptionPlan(planId);
      setSubscriptionPlans(plans => plans.filter(plan => plan.id !== planId));
      toast.success('Subscription plan deleted successfully');
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      toast.error('Failed to delete subscription plan');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Subscribers</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalSubscribers}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Posts</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalPosts}</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Views</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalViews}</h3>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {/* Add recent activity content here */}
      </div>
    </div>
  );

  const renderMonetizationSettings = () => (
    <div className="space-y-8">
      {/* Subscription Plans */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Subscription Plans</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your subscription tiers and pricing</p>
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              setEditForm(defaultPlanForm);
              setShowEditModal(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span>Add Plan</span>
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <div key={plan.id} className="group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200/50 dark:border-neutral-700/50">
              {/* Popular badge */}
              {plan.name.toLowerCase().includes('premium') && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-medium rounded-full">
                  Popular
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{plan.name}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">{plan.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setEditForm({
                          name: plan.name,
                          price: plan.price,
                          description: plan.description,
                          features: plan.features,
                          contentAccess: plan.contentAccess,
                          intervalInDays: plan.intervalInDays,
                          isActive: plan.isActive
                        });
                        setShowEditModal(true);
                      }}
                      className="p-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">${plan.price.toFixed(2)}</span>
                  <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Features</h5>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-neutral-600 dark:text-neutral-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Content Access</h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(plan.contentAccess)
                        .filter(([_, value]) => value)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="px-2 py-1 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
                          >
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Updated {new Date(plan.updatedAt || new Date()).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    plan.isActive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {subscriptionPlans.length === 0 && (
          <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100 mb-1">No Subscription Plans</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first subscription plan to start monetizing your content</p>
          </div>
        )}
      </div>

      {/* Payout Settings */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Payout Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payout Method</label>
            <div className="grid gap-4 md:grid-cols-3">
              <button
                onClick={() => setPayoutSettings(prev => ({ ...prev, payoutMethod: 'bank' }))}
                className={`flex items-center p-4 rounded-lg border-2 ${
                  payoutSettings.payoutMethod === 'bank'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <BuildingLibraryIcon className="w-6 h-6 mr-3" />
                <span>Bank Account</span>
              </button>
              <button
                onClick={() => setPayoutSettings(prev => ({ ...prev, payoutMethod: 'paypal' }))}
                className={`flex items-center p-4 rounded-lg border-2 ${
                  payoutSettings.payoutMethod === 'paypal'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <CreditCardIcon className="w-6 h-6 mr-3" />
                <span>PayPal</span>
              </button>
              <button
                onClick={() => setPayoutSettings(prev => ({ ...prev, payoutMethod: 'stripe' }))}
                className={`flex items-center p-4 rounded-lg border-2 ${
                  payoutSettings.payoutMethod === 'stripe'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <BanknotesIcon className="w-6 h-6 mr-3" />
                <span>Stripe</span>
              </button>
            </div>
          </div>

          {payoutSettings.payoutMethod === 'bank' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <input
                  type="text"
                  value={payoutSettings.bankInfo?.accountNumber || ''}
                  onChange={(e) => setPayoutSettings(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo!,
                      accountNumber: e.target.value
                    }
                  }))}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Routing Number</label>
                <input
                  type="text"
                  value={payoutSettings.bankInfo?.routingNumber || ''}
                  onChange={(e) => setPayoutSettings(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo!,
                      routingNumber: e.target.value
                    }
                  }))}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bank Name</label>
                <input
                  type="text"
                  value={payoutSettings.bankInfo?.bankName || ''}
                  onChange={(e) => setPayoutSettings(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo!,
                      bankName: e.target.value
                    }
                  }))}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={payoutSettings.bankInfo?.accountHolderName || ''}
                  onChange={(e) => setPayoutSettings(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo!,
                      accountHolderName: e.target.value
                    }
                  }))}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
                />
              </div>
            </div>
          )}

          {payoutSettings.payoutMethod === 'paypal' && (
            <div>
              <label className="block text-sm font-medium mb-2">PayPal Email</label>
              <input
                type="email"
                value={payoutSettings.paypalEmail || ''}
                onChange={(e) => setPayoutSettings(prev => ({ ...prev, paypalEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
              />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Payout Amount</label>
              <input
                type="number"
                value={payoutSettings.minimumPayout}
                onChange={(e) => setPayoutSettings(prev => ({ ...prev, minimumPayout: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Auto-Payout Threshold</label>
              <input
                type="number"
                value={payoutSettings.autoPayoutThreshold}
                onChange={(e) => setPayoutSettings(prev => ({ ...prev, autoPayoutThreshold: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payout Schedule</label>
            <select
              value={payoutSettings.payoutSchedule}
              onChange={(e) => setPayoutSettings(prev => ({ ...prev, payoutSchedule: e.target.value as 'weekly' | 'biweekly' | 'monthly' }))}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Creator Dashboard</h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your content, earnings, and creator settings</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('monetization')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monetization'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Monetization
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'monetization' && renderMonetizationSettings()}
        </div>
      </div>

      {/* Edit Plan Modal */}
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
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-lg w-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Plan Edit Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
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
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg h-24"
                      placeholder="Enter plan description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                    <textarea
                      value={editForm.features.join('\n')}
                      onChange={(e) => setEditForm({ ...editForm, features: e.target.value.split('\n').filter(f => f.trim()) })}
                      className="w-full px-3 py-2 border rounded-lg h-24"
                      placeholder="Enter features (one per line)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content Access</label>
                    <div className="space-y-2">
                      {Object.entries(editForm.contentAccess).map(([key, value]) => (
                        <label key={key} className="flex items-center">
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
                            className="mr-2"
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
                    className="px-4 py-2 text-neutral-600 hover:bg-neutral-100"
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
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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

export default CreatorDashboard; 