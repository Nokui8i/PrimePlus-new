import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Tab } from '@headlessui/react';
import SubscriptionPlanManager from './SubscriptionPlanManager';
import MonetizationSettings from './MonetizationSettings';
import PrivacySettings from './PrivacySettings';
import PayoutSettings from './PayoutSettings';
import type { MonetizationSettingsData, PayoutSettingsData } from '@/types/settings';
import type { PrivacySettingsData } from '@/types/privacy';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const CreatorSettings: React.FC = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [activeTab, setActiveTab] = useState<'subscription' | 'monetization' | 'privacy' | 'payout'>('subscription');
  const [monetizationSettings, setMonetizationSettings] = useState<MonetizationSettingsData>({
    enableTips: true,
    minTipAmount: 1,
    maxTipAmount: 1000,
    enablePayPerView: true,
    minPrice: 0.99,
    maxPrice: 999.99
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsData>({
    profileVisibility: 'public',
    showActivity: true,
    showFollowers: true,
    showFollowing: true,
    allowMessages: 'everyone',
    allowComments: 'everyone',
    blockList: []
  });
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettingsData>({
    payoutMethod: 'bank',
    payoutThreshold: 50,
    payoutSchedule: 'monthly'
  });

  const handleSaveSubscriptionPlans = async (plans: any) => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // TODO: Implement API call to save subscription plans
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMonetization = async (settings: any) => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      setMonetizationSettings(prev => ({ ...prev, ...settings }));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async (settings: any) => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      setPrivacySettings((prev: PrivacySettingsData) => ({ ...prev, ...settings }));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayout = async (settings: any) => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      setPayoutSettings(prev => ({ ...prev, ...settings }));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Creator Settings</h1>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'subscription' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          Subscription Plans
        </button>
        <button
          onClick={() => setActiveTab('monetization')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'monetization' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          Monetization
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'privacy' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          Privacy
        </button>
        <button
          onClick={() => setActiveTab('payout')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'payout' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          Payout
        </button>
      </div>

      {/* Settings Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        {activeTab === 'subscription' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscription Plans</h3>
            <SubscriptionPlanManager onSave={handleSaveSubscriptionPlans} />
          </div>
        )}

        {activeTab === 'monetization' && (
          <MonetizationSettings
            settings={monetizationSettings}
            onUpdate={(updates) => setMonetizationSettings(prev => ({ ...prev, ...updates }))}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacySettings
            settings={privacySettings}
            onUpdate={(updates) => setPrivacySettings((prev: PrivacySettingsData) => ({ ...prev, ...updates }))}
          />
        )}

        {activeTab === 'payout' && (
          <PayoutSettings
            settings={payoutSettings}
            onUpdate={(updates) => setPayoutSettings(prev => ({ ...prev, ...updates }))}
          />
        )}
      </div>

      {/* Save Status Notification */}
      {saveStatus && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            saveStatus === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}
        >
          {saveStatus === 'success' ? 'Changes saved successfully!' : 'Failed to save changes'}
        </div>
      )}
    </div>
  );
};

export default CreatorSettings; 