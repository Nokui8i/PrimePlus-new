import api from './api';

export const feedService = {
  // Get main content feed - content from creators that the user is subscribed to
  getFeedContent: async (page = 1, limit = 10) => {
    const response = await api.get(`/feed?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Get recommended content for users who are not subscribed to any creators
  getRecommendedContent: async (page = 1, limit = 10) => {
    const response = await api.get(`/feed/recommended?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Interact with feed content (like)
  likeContent: async (contentId) => {
    const response = await api.post(`/content/${contentId}/like`);
    return response.data;
  },
  
  // Add comment to content
  addComment: async (contentId, comment) => {
    const response = await api.post(`/content/${contentId}/comment`, { comment });
    return response.data;
  },
  
  // Save content to favorites
  saveContent: async (contentId) => {
    const response = await api.post(`/content/${contentId}/save`);
    return response.data;
  }
};

export default feedService;