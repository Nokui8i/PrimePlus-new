import React from 'react';
import type { SecuritySettingsData } from '@/types/settings';

interface SecuritySettingsProps {
  settings: SecuritySettingsData;
  onUpdate: (updates: Partial<SecuritySettingsData>) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Security Settings</h3>

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.twoFactorEnabled}
              onChange={(e) => onUpdate({ twoFactorEnabled: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {settings.twoFactorEnabled && (
          <div>
            <label className="block text-sm font-medium mb-2">Authentication Method</label>
            <select
              value={settings.twoFactorMethod}
              onChange={(e) => onUpdate({ twoFactorMethod: e.target.value as SecuritySettingsData['twoFactorMethod'] })}
              className="select w-full"
            >
              <option value="app">Authenticator App</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
        )}
      </div>

      {/* Login Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Login Notifications</h4>
          <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.loginNotifications}
            onChange={(e) => onUpdate({ loginNotifications: e.target.checked })}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Trusted Devices */}
      <div>
        <h4 className="font-medium mb-2">Trusted Devices</h4>
        <div className="space-y-2">
          {settings.trustedDevices.length > 0 ? (
            settings.trustedDevices.map((deviceId) => (
              <div key={deviceId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{deviceId}</span>
                <button
                  onClick={() => onUpdate({
                    trustedDevices: settings.trustedDevices.filter(id => id !== deviceId)
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No trusted devices</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 