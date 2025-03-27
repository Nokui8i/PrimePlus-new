export interface Profile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  isCreator: boolean;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  subscriptionPlans: any[]; // TODO: Replace with proper type
  discounts: any[]; // TODO: Replace with proper type
  defaultSubscriptionPrice: number;
  freeAccessList: any[]; // TODO: Replace with proper type
  subscribedTo: string[];
} 