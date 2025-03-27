import React from 'react';
import type { PayoutSettingsData } from '@/types/settings';

interface PayoutSettingsProps {
  settings: PayoutSettingsData;
  onUpdate: (updates: Partial<PayoutSettingsData>) => void;
}

const PayoutSettings: React.FC<PayoutSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payout Settings</h3>
      
      {/* Payout Method */}
      <div>
        <label className="block text-sm font-medium mb-2">Payout Method</label>
        <select
          value={settings.payoutMethod}
          onChange={(e) => onUpdate({ payoutMethod: e.target.value as PayoutSettingsData['payoutMethod'] })}
          className="select w-full"
        >
          <option value="bank">Bank Transfer</option>
          <option value="paypal">PayPal</option>
          <option value="crypto">Cryptocurrency</option>
        </select>
      </div>

      {/* Payout Threshold */}
      <div>
        <label className="block text-sm font-medium mb-2">Minimum Payout Amount</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={settings.payoutThreshold}
            onChange={(e) => onUpdate({ payoutThreshold: Number(e.target.value) })}
            min={10}
            className="input flex-1"
          />
          <span className="text-sm text-gray-500">USD</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Minimum amount required before a payout is initiated
        </p>
      </div>

      {/* Payout Schedule */}
      <div>
        <label className="block text-sm font-medium mb-2">Payout Schedule</label>
        <select
          value={settings.payoutSchedule}
          onChange={(e) => onUpdate({ payoutSchedule: e.target.value as PayoutSettingsData['payoutSchedule'] })}
          className="select w-full"
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          How often you want to receive your earnings
        </p>
      </div>

      {/* Bank Info */}
      {settings.payoutMethod === 'bank' && (
        <div className="space-y-4">
          <h4 className="font-medium">Bank Account Information</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              value={settings.bankInfo?.accountName || ''}
              onChange={(e) => onUpdate({
                bankInfo: {
                  accountName: e.target.value,
                  accountNumber: settings.bankInfo?.accountNumber || '',
                  routingNumber: settings.bankInfo?.routingNumber || ''
                }
              })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              value={settings.bankInfo?.accountNumber || ''}
              onChange={(e) => onUpdate({
                bankInfo: {
                  accountName: settings.bankInfo?.accountName || '',
                  accountNumber: e.target.value,
                  routingNumber: settings.bankInfo?.routingNumber || ''
                }
              })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Routing Number</label>
            <input
              type="text"
              value={settings.bankInfo?.routingNumber || ''}
              onChange={(e) => onUpdate({
                bankInfo: {
                  accountName: settings.bankInfo?.accountName || '',
                  accountNumber: settings.bankInfo?.accountNumber || '',
                  routingNumber: e.target.value
                }
              })}
              className="input w-full"
            />
          </div>
        </div>
      )}

      {/* PayPal Email */}
      {settings.payoutMethod === 'paypal' && (
        <div>
          <label className="block text-sm font-medium mb-1">PayPal Email</label>
          <input
            type="email"
            value={settings.paypalEmail || ''}
            onChange={(e) => onUpdate({ paypalEmail: e.target.value })}
            className="input w-full"
          />
        </div>
      )}

      {/* Crypto Address */}
      {settings.payoutMethod === 'crypto' && (
        <div>
          <label className="block text-sm font-medium mb-1">Cryptocurrency Address</label>
          <input
            type="text"
            value={settings.cryptoAddress || ''}
            onChange={(e) => onUpdate({ cryptoAddress: e.target.value })}
            className="input w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Please ensure you enter the correct address for your preferred cryptocurrency
          </p>
        </div>
      )}
    </div>
  );
};

export default PayoutSettings; 