import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import { AnimatePresence } from 'framer-motion';

interface ContentType {
  id: string;
  name: string;
  description: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  intervalInDays: number;
  description: string;
  features: string[];
  includedContent: string[]; // IDs of content types included
  isPublic: boolean;
  isActive: boolean;
}

interface SubscriptionPlanManagerProps {
  onSave: (plans: SubscriptionPlan[]) => Promise<void>;
}

const CONTENT_TYPES: ContentType[] = [
  { id: 'posts', name: 'Posts', description: 'Regular posts and updates' },
  { id: 'photos', name: 'Photos', description: 'High-resolution photos and galleries' },
  { id: 'videos', name: 'Videos', description: 'Video content and live streams' },
  { id: 'exclusive', name: 'Exclusive Content', description: 'Special content for subscribers' },
  { id: 'messages', name: 'Direct Messages', description: 'Ability to send direct messages' },
  { id: 'livestreams', name: 'Live Streams', description: 'Access to live streaming content' },
];

const DEFAULT_PLAN: Omit<SubscriptionPlan, 'id'> = {
  name: '',
  price: 4.99,
  intervalInDays: 30, // Default to 30 days
  description: '',
  features: [],
  includedContent: [],
  isPublic: true,
  isActive: true,
};

// Helper function to format interval display
const formatIntervalDisplay = (days: number): string => {
  if (days === 7) return 'week';
  if (days === 30) return 'month';
  if (days === 90) return 'quarter';
  if (days === 365) return 'year';
  return `${days} days`;
};

export const SubscriptionPlanManager: React.FC<SubscriptionPlanManagerProps> = ({ onSave }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<SubscriptionPlan, 'id'>>(DEFAULT_PLAN);
  const [newFeature, setNewFeature] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, newFeature.trim()]
      });
    } else {
      setNewPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
    }
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: editingPlan.features.filter((_, i) => i !== index)
      });
    } else {
      setNewPlan(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleContentTypeToggle = (contentId: string) => {
    if (editingPlan) {
      const newIncludedContent = editingPlan.includedContent.includes(contentId)
        ? editingPlan.includedContent.filter(id => id !== contentId)
        : [...editingPlan.includedContent, contentId];
      
      setEditingPlan({
        ...editingPlan,
        includedContent: newIncludedContent
      });
    } else {
      const newIncludedContent = newPlan.includedContent.includes(contentId)
        ? newPlan.includedContent.filter(id => id !== contentId)
        : [...newPlan.includedContent, contentId];
      
      setNewPlan(prev => ({
        ...prev,
        includedContent: newIncludedContent
      }));
    }
  };

  const handleAddPlan = () => {
    if (!newPlan.name || newPlan.price <= 0) return;
    
    const plan: SubscriptionPlan = {
      ...newPlan,
      id: String(Date.now())
    };
    
    setPlans(prev => [...prev, plan]);
    setNewPlan(DEFAULT_PLAN);
    setIsAddingPlan(false);
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;
    
    setPlans(prev => prev.map(p => 
      p.id === editingPlan.id ? editingPlan : p
    ));
    setEditingPlan(null);
  };

  const handleRemovePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(plans);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  ${plan.price}/{formatIntervalDisplay(plan.intervalInDays)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="p-2 text-neutral-600 hover:text-primary-600 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRemovePlan(plan.id)}
                  className="p-2 text-neutral-600 hover:text-red-600 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-neutral-600 dark:text-neutral-400">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Included Content</h4>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map(type => (
                    <div
                      key={type.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        plan.includedContent.includes(type.id)
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400'
                      }`}
                    >
                      {type.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Plan Button */}
        <button
          onClick={() => setIsAddingPlan(true)}
          className="flex items-center justify-center h-full min-h-[200px] border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
        >
          <div className="text-center">
            <PlusIcon className="w-8 h-8 mx-auto text-neutral-400 dark:text-neutral-600" />
            <span className="mt-2 block text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Add New Plan
            </span>
          </div>
        </button>
      </div>

      {/* Plan Editor Modal */}
      <AnimatePresence>
        {(isAddingPlan || editingPlan) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-2xl m-4">
              <h2 className="text-xl font-bold mb-6">
                {editingPlan ? 'Edit Plan' : 'Add New Plan'}
              </h2>

              <div className="space-y-6">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={editingPlan?.name || newPlan.name}
                    onChange={(e) => {
                      if (editingPlan) {
                        setEditingPlan({ ...editingPlan, name: e.target.value });
                      } else {
                        setNewPlan({ ...newPlan, name: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Basic Plan"
                  />
                </div>

                {/* Price and Interval */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={editingPlan?.price || newPlan.price}
                        onChange={(e) => {
                          const price = parseFloat(e.target.value);
                          if (editingPlan) {
                            setEditingPlan({ ...editingPlan, price });
                          } else {
                            setNewPlan({ ...newPlan, price });
                          }
                        }}
                        className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Billing Interval (Days)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={editingPlan?.intervalInDays || newPlan.intervalInDays}
                        onChange={(e) => {
                          const intervalInDays = parseInt(e.target.value);
                          if (editingPlan) {
                            setEditingPlan({ ...editingPlan, intervalInDays });
                          } else {
                            setNewPlan({ ...newPlan, intervalInDays });
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="mt-1 text-sm text-neutral-500">
                      Common intervals: 7 (week), 30 (month), 90 (quarter), 365 (year)
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editingPlan?.description ?? newPlan.description}
                    onChange={e => {
                      if (editingPlan) {
                        setEditingPlan({ ...editingPlan, description: e.target.value });
                      } else {
                        setNewPlan(prev => ({ ...prev, description: e.target.value }));
                      }
                    }}
                    className="input-field"
                    rows={3}
                    placeholder="Describe what subscribers get with this plan"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-1">Features</label>
                  <div className="space-y-2">
                    {(editingPlan?.features ?? newPlan.features).map((feature, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">{feature}</span>
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={e => setNewFeature(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddFeature()}
                        className="input-field"
                        placeholder="Add a feature"
                      />
                      <button
                        onClick={handleAddFeature}
                        className="p-2 text-primary-600 hover:text-primary-700"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Types */}
                <div>
                  <label className="block text-sm font-medium mb-1">Included Content</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONTENT_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => handleContentTypeToggle(type.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          (editingPlan?.includedContent ?? newPlan.includedContent).includes(type.id)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{type.name}</span>
                          {(editingPlan?.includedContent ?? newPlan.includedContent).includes(type.id) && (
                            <CheckIcon className="w-5 h-5 text-primary-500" />
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility and Status */}
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPlan?.isPublic ?? newPlan.isPublic}
                      onChange={e => {
                        if (editingPlan) {
                          setEditingPlan({ ...editingPlan, isPublic: e.target.checked });
                        } else {
                          setNewPlan(prev => ({ ...prev, isPublic: e.target.checked }));
                        }
                      }}
                      className="form-checkbox"
                    />
                    <span className="text-sm">Public</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPlan?.isActive ?? newPlan.isActive}
                      onChange={e => {
                        if (editingPlan) {
                          setEditingPlan({ ...editingPlan, isActive: e.target.checked });
                        } else {
                          setNewPlan(prev => ({ ...prev, isActive: e.target.checked }));
                        }
                      }}
                      className="form-checkbox"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsAddingPlan(false);
                    setNewPlan(DEFAULT_PLAN);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingPlan ? handleUpdatePlan : handleAddPlan}>
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlanManager; 