import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {
  StarIcon,
  CheckBadgeIcon,
  BellIcon,
  BellSlashIcon,
  CreditCardIcon,
  CalendarIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Types
interface Subscription {
  id: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    followers: number;
    posts: number;
  };
  tier: {
    id: string;
    name: string;
    price: number;
    benefits: string[];
  };
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  notifications: boolean;
}

const SubscriptionsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // TODO: Fetch subscriptions from API
    // For now, using mock data
    const mockSubscriptions: Subscription[] = [
      {
        id: '1',
        creator: {
          id: '1',
          username: 'creator1',
          avatar: 'https://picsum.photos/100/100',
          isVerified: true,
          followers: 10000,
          posts: 45,
        },
        tier: {
          id: '1',
          name: 'Premium',
          price: 9.99,
          benefits: [
            'Exclusive VR content',
            'Early access to new posts',
            'Direct messaging',
            'Custom content requests',
          ],
        },
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2024-04-01',
        autoRenew: true,
        notifications: true,
      },
      {
        id: '2',
        creator: {
          id: '2',
          username: 'creator2',
          avatar: 'https://picsum.photos/100/100',
          isVerified: false,
          followers: 5000,
          posts: 32,
        },
        tier: {
          id: '2',
          name: 'Basic',
          price: 4.99,
          benefits: [
            'Access to basic content',
            'Standard quality videos',
            'Community access',
          ],
        },
        status: 'active',
        startDate: '2024-03-15',
        endDate: '2024-04-15',
        autoRenew: true,
        notifications: false,
      },
    ];

    setSubscriptions(mockSubscriptions);
    setLoading(false);
  }, [isAuthenticated, router]);

  const filteredSubscriptions = subscriptions.filter(sub => sub.status === activeTab);

  const handleCancelSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    if (!selectedSubscription) return;

    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === selectedSubscription.id
          ? { ...sub, status: 'cancelled', autoRenew: false }
          : sub
      )
    );

    setShowCancelModal(false);
    setSelectedSubscription(null);
  };

  const toggleNotifications = (subscriptionId: string) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId
          ? { ...sub, notifications: !sub.notifications }
          : sub
      )
    );
  };

  if (loading) {
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Subscriptions</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {['active', 'cancelled', 'expired'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {filteredSubscriptions.map((subscription) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Image
                      src={subscription.creator.avatar}
                      alt={subscription.creator.username}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    {subscription.creator.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-primary-600 rounded-full p-1">
                        <CheckBadgeIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{subscription.creator.username}</h3>
                      {subscription.creator.isVerified && (
                        <span className="text-primary-600">
                          <StarIcon className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-neutral-500 mt-1">
                      {subscription.creator.followers.toLocaleString()} followers •{' '}
                      {subscription.creator.posts} posts
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleNotifications(subscription.id)}
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    {subscription.notifications ? (
                      <BellIcon className="w-5 h-5" />
                    ) : (
                      <BellSlashIcon className="w-5 h-5" />
                    )}
                  </button>
                  {subscription.status === 'active' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancelSubscription(subscription)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Subscription Details</h4>
                  <div className="space-y-2 text-sm text-neutral-500">
                    <div className="flex items-center space-x-2">
                      <CreditCardIcon className="w-4 h-4" />
                      <span>{subscription.tier.name} Tier - ${subscription.tier.price}/month</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        Started {new Date(subscription.startDate).toLocaleDateString()} •{' '}
                        {subscription.autoRenew ? 'Auto-renews' : 'Ends'}{' '}
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="space-y-1 text-sm text-neutral-500">
                    {subscription.tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckBadgeIcon className="w-4 h-4 text-primary-600" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                No {activeTab} subscriptions
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                {activeTab === 'active'
                  ? "You don't have any active subscriptions. Browse creators to find content you love!"
                  : `You don't have any ${activeTab} subscriptions.`}
              </p>
            </div>
          )}
        </div>

        {/* Cancel Subscription Modal */}
        <AnimatePresence>
          {showCancelModal && selectedSubscription && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md"
              >
                <h2 className="text-xl font-bold mb-4">Cancel Subscription</h2>
                <p className="text-neutral-500 mb-6">
                  Are you sure you want to cancel your subscription to{' '}
                  <span className="font-medium">{selectedSubscription.creator.username}</span>? You'll
                  lose access to their premium content at the end of your billing period.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white"
                  >
                    Keep Subscription
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmCancelSubscription}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel Subscription
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default SubscriptionsPage; 