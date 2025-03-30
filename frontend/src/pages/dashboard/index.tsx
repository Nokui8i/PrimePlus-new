import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
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
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceSubscriptionPlan, ContentTypeAccess } from '@/services/subscriptionService';
import { getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '@/services/subscriptionService';
import { toast } from 'react-hot-toast';
import type { MonetizationSettingsData, PayoutSettingsData } from '@/types/settings';
import type { PrivacySettingsData } from '@/types/privacy';

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

const CreatorDashboard: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'subscriptions' | 'analytics' | 'settings'>('overview');
  const [subscriptionPlans, setSubscriptionPlans] = useState<ServiceSubscriptionPlan[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ServiceSubscriptionPlan | null>(null);
  const [editForm, setEditForm] = useState<PlanEditForm>({
    name: '',
    price: 0,
    description: '',
    features: [],
    contentAccess: defaultContentAccess
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalSubscribers: 0,
    totalPosts: 0,
    totalViews: 0
  });
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

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

  const handleAddPlan = async (newPlan: Partial<ServiceSubscriptionPlan>) => {
    try {
      const createdPlan = await createSubscriptionPlan(newPlan);
      setSubscriptionPlans(prev => [...prev, createdPlan]);
      toast.success('Subscription plan created successfully');
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast.error('Failed to create subscription plan');
    }
  };

  const handleUpdatePlan = async (planId: string, updates: Partial<ServiceSubscriptionPlan>) => {
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

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex flex-col items-center p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <VideoCameraIcon className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" />
            <span className="text-sm">Upload Content</span>
          </button>
          
          <button
            onClick={() => setActiveTab('subscriptions')}
            className="flex flex-col items-center p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <CurrencyDollarIcon className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" />
            <span className="text-sm">Manage Plans</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className="flex flex-col items-center p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <ArrowTrendingUpIcon className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" />
            <span className="text-sm">View Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="flex flex-col items-center p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <Cog6ToothIcon className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {/* Add recent activity content here */}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      {/* Content management section */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Content</h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          <span>Upload New</span>
        </button>
      </div>

      {/* Content grid/list will go here */}
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Subscription Plans</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your subscription tiers and pricing</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setEditForm({
              name: 'New Plan',
              price: 9.99,
              description: 'New subscription plan',
              features: ['Access to basic content'],
              contentAccess: defaultContentAccess
            });
            setShowEditModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          <span>Add New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200/50 dark:border-neutral-700/50">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{plan.name}</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{plan.description}</p>
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
                        contentAccess: plan.contentAccess
                      });
                      setShowEditModal(true);
                    }}
                    className="p-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this plan?')) {
                        handleDeletePlan(plan.id);
                      }
                    }}
                    className="p-2 text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">${plan.price}</span>
                <span className="text-neutral-500 dark:text-neutral-400">/month</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Features</h5>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                        <span>{feature}</span>
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

            <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-700/50 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Updated {new Date(plan.updatedAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  plan.isActive
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Analytics</h3>
      {/* Add analytics content here */}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Settings</h3>
      {/* Add settings content here */}
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
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Creator Dashboard</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Manage your content, subscriptions, and analytics</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white dark:bg-neutral-800 p-1 rounded-lg shadow-sm mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'content'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'subscriptions'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'analytics'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'settings'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'subscriptions' && renderSubscriptions()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </div>
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