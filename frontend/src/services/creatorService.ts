import api from './api';

// Creator Profile Types
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  website?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export interface CreatorSettings {
  hideSubscriberCount: boolean;
  allowComments: boolean;
  allowDMs: boolean;
  contentVisibility: 'public' | 'subscribers' | 'tiered';
}

export interface Creator {
  id: string;
  username: string;
  fullName?: string;
  displayName?: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  extendedBio?: string;
  customUrl?: string;
  socialLinks?: SocialLinks;
  location?: string;
  tags?: string[];
  creatorSettings?: CreatorSettings;
  subscriberCount?: number;
  contentCount?: number;
  verification?: {
    status: 'pending' | 'verified' | 'rejected';
    verifiedAt?: string;
  };
}

export interface UpdateProfileData {
  fullName?: string;
  displayName?: string;
  bio?: string;
  extendedBio?: string;
  customUrl?: string;
  socialLinks?: SocialLinks;
  location?: string;
  tags?: string[];
}

export interface UpdateSettingsData {
  hideSubscriberCount?: boolean;
  allowComments?: boolean;
  allowDMs?: boolean;
  contentVisibility?: 'public' | 'subscribers' | 'tiered';
}

export interface AnalyticsData {
  subscribers: {
    total: number;
    new: number;
    growth: string;
  };
  content: {
    total: number;
    new: number;
  };
  engagement: {
    totalLikes: number;
    totalComments: number;
    averageLikes: number;
    averageComments: number;
  };
}

// Creator service functions
export const creatorService = {
  // Get public creator profile
  getPublicProfile: async (username: string) => {
    try {
      const response = await api.get(`/creators/profile/${username}`);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Error fetching public profile:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get private creator profile
  getPrivateProfile: async () => {
    try {
      const response = await api.get('/creators/profile');
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Error fetching private profile:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Update creator profile
  updateProfile: async (profileData: UpdateProfileData) => {
    try {
      const response = await api.put('/creators/profile', profileData);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Update creator settings
  updateSettings: async (settingsData: UpdateSettingsData) => {
    try {
      const response = await api.put('/creators/settings', settingsData);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Upload profile image
  uploadProfileImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await api.post('/creators/upload/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Upload cover image
  uploadCoverImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('coverImage', file);

      const response = await api.post('/creators/upload/cover-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Error uploading cover image:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get creator analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/creators/analytics');
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

export default creatorService;