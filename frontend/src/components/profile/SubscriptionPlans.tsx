import React from 'react';
import { StarIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SubscriptionPack {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  features: string[];
}

interface Discount {
  id: string;
  code: string;
  percentage: number;
  validUntil: Date;
  isActive: boolean;
}

interface SubscriptionPlansProps {
  plans: SubscriptionPack[];
  discounts?: Discount[];
  defaultPrice?: number;
  onSubscribe?: (packId: string) => void;
  isSubscribed?: boolean;
  onAddPlan: (newPack: Partial<SubscriptionPack>) => void;
  onUpdatePlan: (packId: string, updates: Partial<SubscriptionPack>) => void;
  onDeletePlan: (packId: string) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  discounts = [],
  defaultPrice = 9.99,
  onSubscribe = () => {},
  isSubscribed = false,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan
}) => {
  const activePlans = plans.filter(plan => plan.isActive);
  const activeDiscounts = discounts.filter(discount => 
    discount.isActive && new Date(discount.validUntil) > new Date()
  );

  const getBestDiscount = () => {
    if (activeDiscounts.length === 0) return null;
    return activeDiscounts.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    );
  };

  const bestDiscount = getBestDiscount();

  const getDiscountedPrice = (price: number) => {
    if (!bestDiscount) return price;
    return price * (1 - bestDiscount.percentage / 100);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Subscription Plans
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Choose the plan that works best for you
        </p>
      </div>

      {bestDiscount && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-900 dark:text-primary-100 font-medium">
                Special Offer!
              </p>
              <p className="text-primary-700 dark:text-primary-300 text-sm">
                {bestDiscount.percentage}% off all plans with code: <span className="font-mono font-medium">{bestDiscount.code}</span>
              </p>
            </div>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Valid until {new Date(bestDiscount.validUntil).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Plan */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 bg-white dark:bg-neutral-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Monthly
            </h3>
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">$</span>
              <span className="text-5xl font-bold text-neutral-900 dark:text-white">
                {defaultPrice.toFixed(2)}
              </span>
              <span className="text-neutral-500 ml-2">/mo</span>
            </div>
            {bestDiscount && (
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Save {bestDiscount.percentage}%
                </span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  ${getDiscountedPrice(defaultPrice).toFixed(2)}/mo with code
                </p>
              </div>
            )}
            <button
              onClick={() => onSubscribe('monthly')}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isSubscribed
                  ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isSubscribed ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-neutral-600 dark:text-neutral-400">Full access to all content</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-neutral-600 dark:text-neutral-400">Direct messaging</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-neutral-600 dark:text-neutral-400">HD video streaming</span>
            </div>
          </div>
        </div>

        {/* Custom Plans */}
        {activePlans.map(plan => (
          <div 
            key={plan.id}
            className={`border rounded-xl p-6 ${
              plan.features.length > 3
                ? 'border-primary-200 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20'
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">$</span>
                <span className="text-5xl font-bold text-neutral-900 dark:text-white">
                  {(plan.price / (plan.features.length / 30)).toFixed(2)}
                </span>
                <span className="text-neutral-500 ml-2">/mo</span>
              </div>
              {bestDiscount && (
                <div className="mb-4">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    Save {bestDiscount.percentage}%
                  </span>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    ${getDiscountedPrice(plan.price / (plan.features.length / 30)).toFixed(2)}/mo with code
                  </p>
                </div>
              )}
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                {plan.description}
              </p>
              <button
                onClick={() => onSubscribe(plan.id)}
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                {isSubscribed ? 'Change Plan' : 'Subscribe'}
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  {plan.features.length} days of access
                </span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-neutral-600 dark:text-neutral-400">Full access to all content</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-neutral-600 dark:text-neutral-400">Direct messaging</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-neutral-600 dark:text-neutral-400">HD video streaming</span>
              </div>
              {plan.features.length > 3 && (
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-neutral-600 dark:text-neutral-400">Priority support</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>All plans include access to all public content and features.</p>
        <p className="mt-1">Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans; 