import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { subscriptionService } from '@/services/subscriptionService';
import Button from '@/components/ui/Button';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  tier: string;
  features: string[];
}

interface SubscriptionPlansProps {
  creatorId: string;
}

export default function SubscriptionPlans({ creatorId }: SubscriptionPlansProps) {
  const { user, isAuthenticated } = useContext(UserContext);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'subscribed' | 'pending'>('none');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await subscriptionService.getCreatorSubscriptionPlans(creatorId);
        if (response.success) {
          setPlans(response.data);
        } else {
          setError('Failed to load subscription plans');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching subscription plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [creatorId]);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to subscribe');
      return;
    }

    // בדיקה שהמשתמש אינו מנסה להירשם לעצמו
    if (user?.id.toString() === creatorId) {
      alert('You cannot subscribe to yourself');
      return;
    }
    
    try {
      setSubscribing(true);
      setError(null);
      
      const response = await subscriptionService.subscribeToCreator(creatorId, planId);
      
      if (response.success) {
        setSubscriptionStatus('subscribed');
      } else {
        setError('Failed to complete subscription');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 text-center p-6 bg-gray-50 rounded-lg">
        <p>Loading subscription options...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscription Plans</h3>
        <p className="text-gray-500">This creator doesn't have any subscription plans yet.</p>
      </div>
    );
  }

  if (subscriptionStatus === 'subscribed') {
    return (
      <div className="mt-8 p-6 bg-green-50 rounded-lg text-center">
        <h3 className="text-lg font-medium text-green-900 mb-2">Subscription Complete!</h3>
        <p className="text-green-700">You have successfully subscribed to this creator.</p>
        <p className="text-green-700 mt-2">You now have access to all their premium content.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white border rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                ${plan.price}<span className="text-sm font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              {/* רשימת תכונות */}
              {plan.features && plan.features.length > 0 && (
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              <Button
                fullWidth
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing}
              >
                {subscribing ? 'Processing...' : 'Subscribe Now'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}