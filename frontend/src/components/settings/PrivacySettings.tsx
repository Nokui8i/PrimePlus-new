import React from 'react';
import type { PrivacySettingsData, ProfileVisibility, AccessLevel } from '@/types/privacy';

interface PrivacySettingsProps {
  settings: PrivacySettingsData;
  onUpdate: (updates: Partial<PrivacySettingsData>) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Privacy Settings</h3>

      {/* Profile Visibility */}
      <div>
        <label className="block text-sm font-medium mb-2">Profile Visibility</label>
        <select
          value={settings.profileVisibility}
          onChange={(e) => {
            const value = e.target.value as ProfileVisibility;
            onUpdate({ profileVisibility: value });
          }}
          className="select w-full"
        >
          <option value="public">Public - Anyone can view your profile</option>
          <option value="followers">Followers Only - Only your followers can view your profile</option>
          <option value="private">Private - Only you can view your profile</option>
        </select>
      </div>

      {/* Activity Visibility */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Show Activity</h4>
          <p className="text-sm text-gray-500">Show your activity feed to others</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.showActivity}
            onChange={(e) => onUpdate({ showActivity: e.target.checked })}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Followers Visibility */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Show Followers</h4>
          <p className="text-sm text-gray-500">Show your followers list to others</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.showFollowers}
            onChange={(e) => onUpdate({ showFollowers: e.target.checked })}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Following Visibility */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Show Following</h4>
          <p className="text-sm text-gray-500">Show who you follow to others</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.showFollowing}
            onChange={(e) => onUpdate({ showFollowing: e.target.checked })}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Message Settings */}
      <div>
        <label className="block text-sm font-medium mb-2">Who Can Message You</label>
        <select
          value={settings.allowMessages}
          onChange={(e) => {
            const value = e.target.value as AccessLevel;
            onUpdate({ allowMessages: value });
          }}
          className="select w-full"
        >
          <option value="everyone">Everyone</option>
          <option value="followers">Followers Only</option>
          <option value="none">No One</option>
        </select>
      </div>

      {/* Comment Settings */}
      <div>
        <label className="block text-sm font-medium mb-2">Who Can Comment on Your Posts</label>
        <select
          value={settings.allowComments}
          onChange={(e) => {
            const value = e.target.value as AccessLevel;
            onUpdate({ allowComments: value });
          }}
          className="select w-full"
        >
          <option value="everyone">Everyone</option>
          <option value="followers">Followers Only</option>
          <option value="none">No One</option>
        </select>
      </div>

      {/* Block List */}
      <div>
        <h4 className="font-medium mb-2">Blocked Users</h4>
        <div className="space-y-2">
          {settings.blockList.length > 0 ? (
            settings.blockList.map((userId) => (
              <div key={userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{userId}</span>
                <button
                  onClick={() => onUpdate({
                    blockList: settings.blockList.filter(id => id !== userId)
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  Unblock
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No blocked users</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings; 