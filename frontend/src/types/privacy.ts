export type ProfileVisibility = 'public' | 'private' | 'followers';
export type AccessLevel = 'everyone' | 'followers' | 'none';

export interface PrivacySettingsData {
  profileVisibility: ProfileVisibility;
  showActivity: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
  allowMessages: AccessLevel;
  allowComments: AccessLevel;
  blockList: string[]; // Array of user IDs
} 