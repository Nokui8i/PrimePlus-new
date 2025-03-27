import { FC } from 'react';

export interface MonetizationSettingsData {
  enableTips: boolean;
  enablePPV: boolean;
  tipMinAmount: number;
  tipMaxAmount: number;
  ppvMinPrice: number;
  ppvMaxPrice: number;
}

export interface MonetizationSettingsProps {
  settings: MonetizationSettingsData;
  onUpdate: (updates: Partial<MonetizationSettingsData>) => void;
}

export interface PrivacySettingsData {
  hideSubscriberCount: boolean;
  hideFromSearch: boolean;
  allowComments: boolean;
  allowDMs: boolean;
  contentVisibility: 'public' | 'subscribers' | 'private';
}

export interface PrivacySettingsProps {
  settings: PrivacySettingsData;
  onUpdate: (updates: Partial<PrivacySettingsData>) => void;
}

export interface PayoutSettingsData {
  payoutMethod: 'bank' | 'paypal' | 'crypto';
  payoutThreshold: number;
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  bankInfo?: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
  };
  paypalEmail?: string;
  cryptoAddress?: string;
}

export interface PayoutSettingsProps {
  settings: PayoutSettingsData;
  onUpdate: (updates: Partial<PayoutSettingsData>) => void;
}

export type MonetizationSettingsComponent = FC<MonetizationSettingsProps>;
export type PrivacySettingsComponent = FC<PrivacySettingsProps>;
export type PayoutSettingsComponent = FC<PayoutSettingsProps>; 