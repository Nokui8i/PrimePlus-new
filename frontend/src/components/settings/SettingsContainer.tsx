import React, { useState } from 'react';
import type { SettingsData } from '@/types/settings';
import MonetizationSettings from './MonetizationSettings';
import PayoutSettings from './PayoutSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import SecuritySettings from './SecuritySettings';
import '@/styles/switch.css';

interface SettingsContainerProps {
  initialSettings: SettingsData;
  onSave: (settings: SettingsData) => Promise<void>;
}

const SettingsContainer: React.FC<SettingsContainerProps> = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [activeTab, setActiveTab] = useState<keyof SettingsData>('monetization');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await onSave(settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = <T extends keyof SettingsData>(section: T) => (
    updates: Partial<SettingsData[T]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  const tabs: { key: keyof SettingsData; label: string }[] = [
    { key: 'monetization', label: 'Monetization' },
    { key: 'payout', label: 'Payout' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'privacy', label: 'Privacy' },
    { key: 'security', label: 'Security' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'monetization' && (
          <MonetizationSettings
            settings={settings.monetization}
            onUpdate={handleUpdate('monetization')}
          />
        )}
        {activeTab === 'payout' && (
          <PayoutSettings
            settings={settings.payout}
            onUpdate={handleUpdate('payout')}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationSettings
            settings={settings.notifications}
            onUpdate={handleUpdate('notifications')}
          />
        )}
        {activeTab === 'privacy' && (
          <PrivacySettings
            settings={settings.privacy}
            onUpdate={handleUpdate('privacy')}
          />
        )}
        {activeTab === 'security' && (
          <SecuritySettings
            settings={settings.security}
            onUpdate={handleUpdate('security')}
          />
        )}

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-end space-x-4">
          {saveStatus === 'success' && (
            <span className="text-green-600">Settings saved successfully!</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600">Failed to save settings</span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`
              px-6 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 disabled:opacity-50
              ${isSaving ? 'cursor-not-allowed' : ''}
            `}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContainer; 