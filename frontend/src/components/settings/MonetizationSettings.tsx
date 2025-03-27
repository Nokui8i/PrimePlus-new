import React from 'react';
import type { MonetizationSettingsData } from '@/types/settings';

interface MonetizationSettingsProps {
  settings: MonetizationSettingsData;
  onUpdate: (updates: Partial<MonetizationSettingsData>) => void;
}

const MonetizationSettings: React.FC<MonetizationSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Monetization Settings</h3>
      
      {/* Tips Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">Enable Tips</label>
          <input
            type="checkbox"
            checked={settings.enableTips}
            onChange={(e) => onUpdate({ enableTips: e.target.checked })}
            className="toggle"
          />
        </div>
        
        {settings.enableTips && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Tip Amount</label>
              <input
                type="number"
                value={settings.minTipAmount}
                onChange={(e) => onUpdate({ minTipAmount: Number(e.target.value) })}
                min={1}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Tip Amount</label>
              <input
                type="number"
                value={settings.maxTipAmount}
                onChange={(e) => onUpdate({ maxTipAmount: Number(e.target.value) })}
                min={settings.minTipAmount}
                className="input w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Pay-per-view Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">Enable Pay-per-view</label>
          <input
            type="checkbox"
            checked={settings.enablePayPerView}
            onChange={(e) => onUpdate({ enablePayPerView: e.target.checked })}
            className="toggle"
          />
        </div>
        
        {settings.enablePayPerView && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Price</label>
              <input
                type="number"
                value={settings.minPrice}
                onChange={(e) => onUpdate({ minPrice: Number(e.target.value) })}
                min={0.99}
                step={0.01}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Price</label>
              <input
                type="number"
                value={settings.maxPrice}
                onChange={(e) => onUpdate({ maxPrice: Number(e.target.value) })}
                min={settings.minPrice}
                step={0.01}
                className="input w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonetizationSettings; 