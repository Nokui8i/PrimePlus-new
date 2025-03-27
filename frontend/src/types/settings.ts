import type { PrivacySettingsData } from './privacy';

export interface MonetizationSettingsData {
  enableTips: boolean;
  minTipAmount: number;
  maxTipAmount: number;
  enablePayPerView: boolean;
  minPrice: number;
  maxPrice: number;
}

export interface BankInfo {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
}

export interface PayoutSettingsData {
  payoutMethod: 'bank' | 'paypal' | 'crypto';
  payoutThreshold: number;
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  bankInfo?: BankInfo;
  paypalEmail?: string;
  cryptoAddress?: string;
}

export interface NotificationSettingsData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyOnNewFollower: boolean;
  notifyOnNewComment: boolean;
  notifyOnNewLike: boolean;
  notifyOnNewMessage: boolean;
  notifyOnNewPurchase: boolean;
  notifyOnNewTip: boolean;
  notifyOnPayout: boolean;
}

export interface SecuritySettingsData {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email';
  loginNotifications: boolean;
  trustedDevices: string[]; // Array of device IDs
}

export interface SettingsData {
  monetization: MonetizationSettingsData;
  payout: PayoutSettingsData;
  notifications: NotificationSettingsData;
  privacy: PrivacySettingsData;
  security: SecuritySettingsData;
} 