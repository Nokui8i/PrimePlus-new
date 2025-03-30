import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import SubscriptionService, { 
  SubscriptionPlan, 
  CreateSubscriptionPlanDto, 
  UpdateSubscriptionPlanDto,
  ContentTypeAccess 
} from '@/services/subscriptionService';

interface SubscriptionPlanManagerProps {
  onPlansChange?: (plans: SubscriptionPlan[]) => void;
}

const defaultContentAccess: ContentTypeAccess = {
  regularContent: true,
  premiumVideos: false,
  vrContent: false,
  threeSixtyContent: false,
  liveRooms: false,
  interactiveModels: false
};

const SubscriptionPlanManager: React.FC<SubscriptionPlanManagerProps> = ({ onPlansChange }) => {
  const { user } = useUser();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<CreateSubscriptionPlanDto>({
    name: '',
    price: 4.99,
    description: '',
    features: [],
    intervalInDays: 30,
    isActive: true,
    contentAccess: defaultContentAccess
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const fetchedPlans = await SubscriptionService.getSubscriptionPlans();
      const extendedPlans = fetchedPlans.map(plan => ({
        ...plan,
        contentAccess: plan.contentAccess || defaultContentAccess
      }));
      setPlans(extendedPlans);
      if (onPlansChange) {
        onPlansChange(extendedPlans);
      }
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const newPlan = await SubscriptionService.createSubscriptionPlan(editingPlan);
      if (newPlan) {
        const extendedPlan = {
          ...newPlan,
          contentAccess: newPlan.contentAccess || defaultContentAccess
        };
        setPlans(prev => [...prev, extendedPlan]);
        if (onPlansChange) {
          onPlansChange([...plans, extendedPlan]);
        }
        toast.success('Subscription plan created successfully');
        setIsEditing(null);
        setEditingPlan({
          name: '',
          price: 4.99,
          description: '',
          features: [],
          intervalInDays: 30,
          isActive: true,
          contentAccess: defaultContentAccess
        });
      }
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast.error('Failed to create subscription plan');
    }
  };

  const handleUpdatePlan = async (planId: string) => {
    try {
      const updatedPlan = await SubscriptionService.updateSubscriptionPlan(planId, editingPlan);
      if (updatedPlan) {
        const extendedPlan = {
          ...updatedPlan,
          contentAccess: updatedPlan.contentAccess || defaultContentAccess
        };
        setPlans(prev => prev.map(p => p.id === planId ? extendedPlan : p));
        if (onPlansChange) {
          onPlansChange(plans.map(p => p.id === planId ? extendedPlan : p));
        }
        toast.success('Subscription plan updated successfully');
        setIsEditing(null);
      }
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast.error('Failed to update subscription plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const success = await SubscriptionService.deletePlan(planId);
      if (success) {
        setPlans(prev => prev.filter(p => p.id !== planId));
        if (onPlansChange) {
          onPlansChange(plans.filter(p => p.id !== planId));
        }
        toast.success('Subscription plan deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      toast.error('Failed to delete subscription plan');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-4">Loading subscription plans...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Subscription Plans</h2>
        <button
          onClick={() => setIsEditing('new')}
          className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Plan
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <div key={plan.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(plan.id);
                    setEditingPlan({
                      ...plan,
                      contentAccess: plan.contentAccess || defaultContentAccess
                    });
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="text-2xl font-bold mb-2">${plan.price}/mo</div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
            
            {/* Content Access Section */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Content Access:</h4>
              <ul className="space-y-1 text-sm">
                {plan.contentAccess?.regularContent && (
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✓</span> Regular Content
                  </li>
                )}
                {plan.contentAccess?.premiumVideos && (
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✓</span> Premium Videos
                  </li>
                )}
                {plan.contentAccess?.vrContent && (
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✓</span> VR Content
                  </li>
                )}
                {plan.contentAccess?.threeSixtyContent && (
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✓</span> 360° Content
                  </li>
                )}
                {plan.contentAccess?.liveRooms && (
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✓</span> Live Rooms
                  </li>
                )}
                {plan.contentAccess?.interactiveModels && (
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✓</span> Interactive 3D Models
                  </li>
                )}
              </ul>
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {isEditing === 'new' ? 'Create New Plan' : 'Edit Plan'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={e => setEditingPlan(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price ($/month)</label>
                <input
                  type="number"
                  min="0.99"
                  step="0.01"
                  value={editingPlan.price}
                  onChange={e => setEditingPlan(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingPlan.description}
                  onChange={e => setEditingPlan(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                <textarea
                  value={editingPlan.features?.join('\n')}
                  onChange={e => setEditingPlan(prev => ({ ...prev, features: e.target.value.split('\n').filter(f => f.trim()) }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  rows={4}
                />
              </div>

              {/* Content Access Settings */}
              <div>
                <label className="block text-sm font-medium mb-2">Content Access</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.contentAccess.regularContent}
                      onChange={e => setEditingPlan(prev => ({
                        ...prev,
                        contentAccess: {
                          ...prev.contentAccess,
                          regularContent: e.target.checked
                        }
                      }))}
                      className="mr-2"
                    />
                    Regular Content
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.contentAccess.premiumVideos}
                      onChange={e => setEditingPlan(prev => ({
                        ...prev,
                        contentAccess: {
                          ...prev.contentAccess,
                          premiumVideos: e.target.checked
                        }
                      }))}
                      className="mr-2"
                    />
                    Premium Videos
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.contentAccess.vrContent}
                      onChange={e => setEditingPlan(prev => ({
                        ...prev,
                        contentAccess: {
                          ...prev.contentAccess,
                          vrContent: e.target.checked
                        }
                      }))}
                      className="mr-2"
                    />
                    VR Content
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.contentAccess.threeSixtyContent}
                      onChange={e => setEditingPlan(prev => ({
                        ...prev,
                        contentAccess: {
                          ...prev.contentAccess,
                          threeSixtyContent: e.target.checked
                        }
                      }))}
                      className="mr-2"
                    />
                    360° Content
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.contentAccess.liveRooms}
                      onChange={e => setEditingPlan(prev => ({
                        ...prev,
                        contentAccess: {
                          ...prev.contentAccess,
                          liveRooms: e.target.checked
                        }
                      }))}
                      className="mr-2"
                    />
                    Live Rooms
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.contentAccess.interactiveModels}
                      onChange={e => setEditingPlan(prev => ({
                        ...prev,
                        contentAccess: {
                          ...prev.contentAccess,
                          interactiveModels: e.target.checked
                        }
                      }))}
                      className="mr-2"
                    />
                    Interactive 3D Models
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setIsEditing(null);
                    setEditingPlan({
                      name: '',
                      price: 4.99,
                      description: '',
                      features: [],
                      intervalInDays: 30,
                      isActive: true,
                      contentAccess: defaultContentAccess
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => isEditing === 'new' ? handleCreatePlan() : handleUpdatePlan(isEditing)}
                  className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  {isEditing === 'new' ? 'Create' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanManager; 