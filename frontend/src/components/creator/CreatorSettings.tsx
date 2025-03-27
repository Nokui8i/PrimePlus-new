import React, { useState, useEffect } from 'react';
import { useCreator } from '@/context/CreatorContext';
import { UpdateSettingsData } from '@/services/creatorService';

const CreatorSettings: React.FC = () => {
  const { creator, updateSettings, loading } = useCreator();
  const [settings, setSettings] = useState<UpdateSettingsData>({
    hideSubscriberCount: false,
    allowComments: true,
    allowDMs: true,
    contentVisibility: 'subscribers'
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Update settings form when creator data changes
  useEffect(() => {
    if (creator?.creatorSettings) {
      setSettings({
        hideSubscriberCount: creator.creatorSettings.hideSubscriberCount,
        allowComments: creator.creatorSettings.allowComments,
        allowDMs: creator.creatorSettings.allowDMs,
        contentVisibility: creator.creatorSettings.contentVisibility
      });
    }
  }, [creator]);

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    try {
      const success = await updateSettings(settings);
      if (success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Creator Settings</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Privacy Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="hideSubscriberCount"
                  name="hideSubscriberCount"
                  type="checkbox"
                  checked={settings.hideSubscriberCount}
                  onChange={handleCheckboxChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="hideSubscriberCount" className="font-medium text-gray-700">
                  Hide Subscriber Count
                </label>
                <p className="text-gray-500">
                  Don't display the number of subscribers on your public profile
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Interaction Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Interaction Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="allowComments"
                  name="allowComments"
                  type="checkbox"
                  checked={settings.allowComments}
                  onChange={handleCheckboxChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="allowComments" className="font-medium text-gray-700">
                  Allow Comments
                </label>
                <p className="text-gray-500">
                  Let subscribers comment on your content
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="allowDMs"
                  name="allowDMs"
                  type="checkbox"
                  checked={settings.allowDMs}
                  onChange={handleCheckboxChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="allowDMs" className="font-medium text-gray-700">
                  Allow Direct Messages
                </label>
                <p className="text-gray-500">
                  Let subscribers send you private messages
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Visibility Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Content Visibility</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="visibility-public"
                  name="contentVisibility"
                  type="radio"
                  value="public"
                  checked={settings.contentVisibility === 'public'}
                  onChange={handleRadioChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="visibility-public" className="font-medium text-gray-700">
                  Public
                </label>
                <p className="text-gray-500">
                  Anyone can see previews of your content (full content still requires subscription)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="visibility-subscribers"
                  name="contentVisibility"
                  type="radio"
                  value="subscribers"
                  checked={settings.contentVisibility === 'subscribers'}
                  onChange={handleRadioChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="visibility-subscribers" className="font-medium text-gray-700">
                  Subscribers Only
                </label>
                <p className="text-gray-500">
                  Only subscribers can see your content
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="visibility-tiered"
                  name="contentVisibility"
                  type="radio"
                  value="tiered"
                  checked={settings.contentVisibility === 'tiered'}
                  onChange={handleRadioChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="visibility-tiered" className="font-medium text-gray-700">
                  Tiered Access
                </label>
                <p className="text-gray-500">
                  Different content visible to different subscription tiers
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex items-center">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading || saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
          </button>
          
          {saveStatus === 'success' && (
            <span className="ml-4 text-green-600">Settings updated successfully!</span>
          )}
          
          {saveStatus === 'error' && (
            <span className="ml-4 text-red-600">Failed to update settings</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatorSettings;