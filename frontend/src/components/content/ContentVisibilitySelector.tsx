import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { CurrencyDollarIcon, LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  intervalInDays: number;
}

interface ContentVisibilityProps {
  availablePlans: SubscriptionPlan[];
  selectedPlans: string[];
  individualPrice: number | null;
  isFreeForAll: boolean;
  onVisibilityChange: (settings: {
    selectedPlans: string[];
    individualPrice: number | null;
    isFreeForAll: boolean;
  }) => void;
}

const ContentVisibilitySelector: React.FC<ContentVisibilityProps> = ({
  availablePlans,
  selectedPlans,
  individualPrice,
  isFreeForAll,
  onVisibilityChange,
}) => {
  const [visibilityType, setVisibilityType] = React.useState<'free' | 'paid' | 'subscription'>(
    isFreeForAll ? 'free' : individualPrice !== null ? 'paid' : 'subscription'
  );

  const handleVisibilityTypeChange = (type: 'free' | 'paid' | 'subscription') => {
    setVisibilityType(type);
    
    switch (type) {
      case 'free':
        onVisibilityChange({
          selectedPlans: [],
          individualPrice: null,
          isFreeForAll: true,
        });
        break;
      case 'paid':
        onVisibilityChange({
          selectedPlans: [],
          individualPrice: individualPrice || 0.99,
          isFreeForAll: false,
        });
        break;
      case 'subscription':
        onVisibilityChange({
          selectedPlans: selectedPlans,
          individualPrice: null,
          isFreeForAll: false,
        });
        break;
    }
  };

  const handlePlanSelection = (planId: string) => {
    const newSelectedPlans = selectedPlans.includes(planId)
      ? selectedPlans.filter(id => id !== planId)
      : [...selectedPlans, planId];

    onVisibilityChange({
      selectedPlans: newSelectedPlans,
      individualPrice: null,
      isFreeForAll: false,
    });
  };

  const handleIndividualPriceChange = (price: number) => {
    onVisibilityChange({
      selectedPlans: [],
      individualPrice: price,
      isFreeForAll: false,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <RadioGroup value={visibilityType} onChange={handleVisibilityTypeChange}>
          <RadioGroup.Label className="text-lg font-medium text-gray-900 dark:text-white">
            Content Visibility
          </RadioGroup.Label>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Free for All Option */}
            <RadioGroup.Option value="free" className={({ checked }) => `
              ${checked ? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-700' : 'bg-white dark:bg-neutral-800'}
              relative rounded-lg shadow-sm px-6 py-4 cursor-pointer flex border focus:outline-none
            `}>
              {({ checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label as="p" className="font-medium text-gray-900 dark:text-white">
                          Free for All
                        </RadioGroup.Label>
                        <RadioGroup.Description as="span" className="text-gray-500">
                          <span className="block sm:inline">Available to everyone</span>
                        </RadioGroup.Description>
                      </div>
                    </div>
                    <GlobeAltIcon className={`h-6 w-6 ${checked ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                </>
              )}
            </RadioGroup.Option>

            {/* Individual Purchase Option */}
            <RadioGroup.Option value="paid" className={({ checked }) => `
              ${checked ? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-700' : 'bg-white dark:bg-neutral-800'}
              relative rounded-lg shadow-sm px-6 py-4 cursor-pointer flex border focus:outline-none
            `}>
              {({ checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label as="p" className="font-medium text-gray-900 dark:text-white">
                          Individual Purchase
                        </RadioGroup.Label>
                        <RadioGroup.Description as="span" className="text-gray-500">
                          <span className="block sm:inline">Set a one-time purchase price</span>
                        </RadioGroup.Description>
                      </div>
                    </div>
                    <CurrencyDollarIcon className={`h-6 w-6 ${checked ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                </>
              )}
            </RadioGroup.Option>

            {/* Subscription Only Option */}
            <RadioGroup.Option value="subscription" className={({ checked }) => `
              ${checked ? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-700' : 'bg-white dark:bg-neutral-800'}
              relative rounded-lg shadow-sm px-6 py-4 cursor-pointer flex border focus:outline-none
            `}>
              {({ checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label as="p" className="font-medium text-gray-900 dark:text-white">
                          Subscription Only
                        </RadioGroup.Label>
                        <RadioGroup.Description as="span" className="text-gray-500">
                          <span className="block sm:inline">Available to selected subscription plans</span>
                        </RadioGroup.Description>
                      </div>
                    </div>
                    <LockClosedIcon className={`h-6 w-6 ${checked ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                </>
              )}
            </RadioGroup.Option>
          </div>
        </RadioGroup>
      </div>

      {/* Individual Price Input */}
      {visibilityType === 'paid' && (
        <div>
          <label htmlFor="individualPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Purchase Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="individualPrice"
              id="individualPrice"
              min="0.99"
              step="0.01"
              value={individualPrice || ''}
              onChange={(e) => handleIndividualPriceChange(Number(e.target.value))}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      {/* Subscription Plans Selection */}
      {visibilityType === 'subscription' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
            Select Subscription Plans
          </label>
          <div className="space-y-2">
            {availablePlans.map((plan) => (
              <label key={plan.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedPlans.includes(plan.id)}
                  onChange={() => handlePlanSelection(plan.id)}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {plan.name} (${plan.price}/{plan.intervalInDays} days)
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentVisibilitySelector; 