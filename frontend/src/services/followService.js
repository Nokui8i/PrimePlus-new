import api from './api';

const followService = {
  // Follow a creator
  followCreator: async (creatorId) => {
    try {
      const response = await api.post(`/follows/creator/${creatorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unfollow a creator
  unfollowCreator: async (creatorId) => {
    try {
      const response = await api.delete(`/follows/creator/${creatorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is following a creator
  checkFollowStatus: async (creatorId) => {
    try {
      const response = await api.get(`/follows/status/${creatorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get followers for a creator
  getFollowers: async (creatorId, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/follows/followers/${creatorId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get creators followed by user
  getFollowing: async (userId = null, page = 1, limit = 20) => {
    try {
      const url = userId ? `/follows/following/${userId}` : '/follows/following';
      const response = await api.get(url, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get follow counts for a creator
  getFollowCounts: async (creatorId) => {
    try {
      const response = await api.get(`/follows/counts/${creatorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default followService;