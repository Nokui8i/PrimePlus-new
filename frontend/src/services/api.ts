import axios from 'axios';
import { API_URL } from '@/config/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified error handler
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with an error
    console.error('API Error:', error.response.data);
    return {
      success: false,
      message: error.response.data.error || 'An unexpected error occurred',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response received
    console.error('No response:', error.request);
    return {
      success: false,
      message: 'No response from server. Please check your connection.',
      status: 0
    };
  } else {
    // Error setting up the request
    console.error('Request setup error:', error.message);
    return {
      success: false,
      message: 'Error setting up request',
      status: -1
    };
  }
};

// User service functions
export const userService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/users/register', userData);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default api;