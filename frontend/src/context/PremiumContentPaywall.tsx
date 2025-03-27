import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { subscriptionService } from '@/services/subscriptionService';

interface PremiumContentPaywallProps {
  contentId: string;
  contentType?: 'regular' | 'vr';
  creatorId: string;
  creatorName?: string;
  onSubscribe?: () => void;
}

export default function PremiumContentPaywall({ 
  contentId, 
  contentType = 'regular', 
  creatorId, 
  creatorName = 'this creator',
  onSubscribe 
}: PremiumContentPaywallProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await subscriptionService.getCreatorSubscriptionPlans(creatorId);
      
      if (response.success) {
        setSubscriptionPlans(response.data);
        setShowPlans(true);
      } else {
        setError('Failed to load subscription plans');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Premium Content</h3>
        <p>This content is available exclusively to subscribers</p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {contentType === 'vr' ? 'Premium VR Experience' : 'Premium Content'}
          </h4>
          
          <p className="text-gray-600 text-center mb-6">
            Subscribe to {creatorName} to unlock this content and get access to all their premium {contentType === 'vr' ? 'VR experiences' : 'content'}.
          </p>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-6 w-full">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              onClick={handleViewPlans}
              disabled={isLoading || showPlans}
              className="flex-1"
            >
              {isLoading ? 'Loading...' : 'View Subscription Plans'}
            </Button>
            
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        
        {showPlans && subscriptionPlans.length > 0 && (
          <div className="border-t pt-6">
            <h5 className="text-lg font-medium text-gray-900 mb-4">
              Choose a Subscription Plan
            </h5>
            
            <div className="space-y-4">
              {subscriptionPlans.map((plan: any) => (
                <div key={plan.id} className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h6 className="font-medium text-gray-900">{plan.name}</h6>
                      <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                      
                      {plan.features && plan.features.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {plan.features.map((feature: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${plan.price}</p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link href={`/subscribe/${creatorId}?plan=${plan.id}`}>
                      <Button fullWidth>
                        Subscribe Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showPlans && subscriptionPlans.length === 0 && (
          <div className="border-t pt-6">
            <div className="text-center py-4">
              <p className="text-gray-600">
                No subscription plans available for this creator at the moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}