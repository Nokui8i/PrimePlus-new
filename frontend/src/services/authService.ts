import axios from 'axios';
import { API_URL } from '@/config/constants';

const USERS_API_URL = `${API_URL}/users`;

/**
 * Register a new user
 * @param userData - User registration data
 * @returns 
 */
const register = async (userData: any) => {
  return axios.post(`${USERS_API_URL}/register`, userData);
};

/**
 * Login user
 * @param credentials - User login credentials
 * @returns 
 */
const login = async (credentials: { email: string; password: string }) => {
  try {
    // Only use real server authentication
    const response = await axios.post(`${USERS_API_URL}/login`, credentials);
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user by removing stored data
 */
const logout = () => {
  localStorage.removeItem('user');
};

/**
 * Get current user data from localStorage
 * @returns 
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Get authorization header with JWT token
 * @returns 
 */
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};

/**
 * Update user profile
 * @param profileData - Updated profile data
 * @returns 
 */
const updateProfile = async (profileData: any) => {
  return axios.put(`${USERS_API_URL}/profile`, profileData, {
    headers: getAuthHeader()
  });
};

/**
 * Get user profile
 * @returns 
 */
const getProfile = async () => {
  return axios.get(`${USERS_API_URL}/profile`, {
    headers: getAuthHeader()
  });
};

/**
 * Check if user is authenticated
 * @returns 
 */
const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user;
};

/**
 * Check if user has a specific role
 * @param role - Role to check
 * @returns 
 */
const hasRole = (role: string) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthHeader,
  updateProfile,
  getProfile,
  isAuthenticated,
  hasRole
};

export { getAuthHeader };
export default AuthService;