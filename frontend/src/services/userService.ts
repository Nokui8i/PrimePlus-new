import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config/api';
import { User } from '@/components/providers/AuthProvider';
import { AuthResponse } from '@/types/user';
import { api } from '@/lib/api';

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  websiteUrl: string;
  amazonWishlist: string;
  profileImage: string;
  coverImage: string;
}

// Mock user data for development
const MOCK_USER: User = {
  id: '1',
  fullName: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const MOCK_TOKEN = 'mock_jwt_token';
const MOCK_REFRESH_TOKEN = 'mock_refresh_token';

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * Register new user
   */
  register: async (data: {
    email: string;
    password: string;
    username: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: ProfileData): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  updatePassword: async (data: UpdatePasswordData) => {
    try {
      const response = await api.put('/auth/password', data);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  /**
   * Forgot password
   */
  resetPassword: async (email: string): Promise<void> => {
    await api.post('/auth/reset-password', { email });
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },

  /**
   * Update user settings
   */
  updateSettings: async (settings: any): Promise<void> => {
    await api.put('/users/settings', settings);
  },

  /**
   * Delete account
   */
  deleteAccount: async () => {
    try {
      const response = await api.delete('/auth/account');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  /**
   * Update user to creator status
   */
  becomeCreator: async (): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post('/users/become-creator');
    return response.data;
  },

  /**
   * Get user's followers
   */
  getUserFollowers: async (userId: string, page = 1, limit = 20) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { followers: [], total: 0 };
  },

  /**
   * Get user's following
   */
  getUserFollowing: async (userId: string, page = 1, limit = 20) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { following: [], total: 0 };
  },

  /**
   * Follow a user
   */
  followUser: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  /**
   * Unfollow a user
   */
  unfollowUser: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  /**
   * Search for creators
   */
  searchCreators: async (query: string, page = 1, limit = 20) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { creators: [], total: 0 };
  },

  /**
   * Apply to become a creator
   */
  applyForCreator: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  /**
   * Get top creators
   */
  getTopCreators: async (limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { creators: [], total: 0 };
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { url: 'https://example.com/mock-image.jpg' };
  },
}; 