import axios from 'axios';
import { API_URL } from './config';

// Function to handle errors
const handleError = (error) => {
  console.error('Admin API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject({ message: 'No response from server' });
  } else {
    // Something happened in setting up the request that triggered an Error
    return Promise.reject({ message: error.message });
  }
};

// Get platform stats for admin dashboard
export const getPlatformStats = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get users with filtering and pagination
export const getUsers = async (token, { page = 1, limit = 20, search = '', role = '', status = '' } = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page,
        limit,
        search,
        role,
        status
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get user by ID
export const getUserById = async (token, userId) => {
  try {
    const response = await axios.get(`${API_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// Update user
export const updateUser = async (token, userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get pending creator verifications
export const getPendingVerifications = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/verifications/pending`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Approve or reject creator verification
export const reviewVerification = async (token, verificationId, status, rejectionReason = null) => {
  try {
    const response = await axios.put(
      `${API_URL}/creator-verification/${verificationId}/review`,
      { status, rejectionReason },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get pending payouts
export const getPendingPayouts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/payouts/pending`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get content with filtering and pagination
export const getContent = async (token, { page = 1, limit = 20, search = '', type = '', status = '', creatorId = '' } = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/content`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page,
        limit,
        search,
        type,
        status,
        creatorId
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get list of admin users
export const getAdmins = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/admins`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Promote user to admin
export const promoteToAdmin = async (token, userId) => {
  try {
    const response = await axios.post(`${API_URL}/admin/users/${userId}/promote`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Revoke admin privileges
export const revokeAdmin = async (token, userId) => {
  try {
    const response = await axios.post(`${API_URL}/admin/users/${userId}/revoke`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};