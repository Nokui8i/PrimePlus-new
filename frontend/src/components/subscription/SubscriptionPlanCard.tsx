import React from 'react';
import { useRouter } from 'next/router';
import { SubscriptionPlan as SubscriptionPlanType } from '../../services/subscriptionService';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlanType & { isPopular?: boolean };
  onSubscribe?: (planId: string) => void;
  className?: string;
  showSubscribeButton?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onSubscribe,
  className = '',
  showSubscribeButton = true
}) => {
  const router = useRouter();

  // Format interval for display
  const intervalDisplay = {
    monthly: 'month',
    quarterly: '3 months',
    biannual: '6 months',
    annual: 'year'
  };
  
  // Calculate interval discount compared to monthly
  const getDiscount = () => {
    switch (plan.interval) {
      case 'quarterly':
        return Math.round((1 - (plan.price / 3) / (plan.price * 4 / 12)) * 100);
      case 'biannual':
        return Math.round((1 - (plan.price / 6) / (plan.price * 6 / 12)) * 100);
      case 'annual':
        return Math.round((1 - (plan.price / 12) / plan.price) * 100);
      default:
        return 0;
    }
  };

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe(plan.id);
    } else {
      // Navigate to subscribe page
      router.push(`/subscriptions/subscribe?planId=${plan.id}`);
    }
  };
  
  const discount = getDiscount();
  const cardColor = plan.color || '#3B82F6'; // Default to blue if no color provided
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border overflow-hidden ${plan.isPopular ? 'ring-2 ring-blue-500' : ''} ${className}`}
      style={{ borderColor: plan.isPopular ? cardColor : '#e5e7eb' }}
    >
      {/* Card Header */}
      <div 
        className="px-6 py-4"
        style={{ backgroundColor: `${cardColor}10` }} // 10% opacity of the color
      >
        {plan.isPopular && (
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2"
            style={{ backgroundColor: `${cardColor}20`, color: cardColor }}
          >
            Most Popular
          </span>
        )}
        
        <h3 className="text-lg font-medium text-gray-900">
          {plan.name}
        </h3>
        
        {plan.description && (
          <p className="mt-1 text-sm text-gray-500">
            {plan.description}
          </p>
        )}
      </div>
      
      {/* Price */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
          <span className="ml-1 text-xl font-medium text-gray-500">
            /{intervalDisplay[plan.interval]}
          </span>
        </div>
        
        {discount > 0 && (
          <p className="mt-1 text-sm text-green-600">
            Save {discount}% compared to monthly
          </p>
        )}
        
        {plan.trialPeriodDays > 0 && (
          <p className="mt-2 text-sm font-medium text-gray-900">
            Includes {plan.trialPeriodDays}-day free trial
          </p>
        )}
      </div>
      
      {/* Features */}
      <div className="px-6 py-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg 
                className="h-5 w-5 flex-shrink-0 mr-2" 
                style={{ color: cardColor }} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Action */}
      {showSubscribeButton && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubscribe}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: cardColor, borderColor: cardColor }}
          >
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanCard;