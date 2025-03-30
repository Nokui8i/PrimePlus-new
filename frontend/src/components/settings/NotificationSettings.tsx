import React from 'react';
import type { NotificationSettingsData } from '@/types/settings';

interface NotificationSettingsProps {
  settings: NotificationSettingsData;
  onUpdate: (updates: Partial<NotificationSettingsData>) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Notification Settings</h3>

      {/* General Notification Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => onUpdate({ emailNotifications: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications on your device</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => onUpdate({ pushNotifications: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium">Notification Preferences</h4>
        
        <div className="flex items-center justify-between">
          <label className="text-sm">New Followers</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifyOnNewFollower}
              onChange={(e) => onUpdate({ notifyOnNewFollower: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">New Comments</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifyOnNewComment}
              onChange={(e) => onUpdate({ notifyOnNewComment: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">New Likes</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifyOnNewLike}
              onChange={(e) => onUpdate({ notifyOnNewLike: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">New Messages</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifyOnNewMessage}
              onChange={(e) => onUpdate({ notifyOnNewMessage: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">New Purchases</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifyOnNewPurchase}
              onChange={(e) => onUpdate({ notifyOnNewPurchase: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">New Tips</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifyOnNewTip}
              onChange={(e) => onUpdate({ notifyOnNewTip: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Payouts</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifyOnPayout}
              onChange={(e) => onUpdate({ notifyOnPayout: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 