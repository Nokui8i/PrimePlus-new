import api from './api';

export const contentService = {
  // Get all content
  getAllContent: async (filters = {}) => {
    try {
      const response = await api.get('/content', { params: filters });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Get content by ID
  getContentById: async (id: string) => {
    try {
      const response = await api.get(`/content/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Create new content
  createContent: async (formData: FormData) => {
    try {
      const response = await api.post('/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Update existing content
  updateContent: async (id: string, formData: FormData) => {
    try {
      const response = await api.put(`/content/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Delete content
  deleteContent: async (id: string) => {
    try {
      const response = await api.delete(`/content/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Get creator content
  getCreatorContent: async (creatorId: string, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add any additional filters
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get(`/content/creator/${creatorId}${queryString}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Like content
  likeContent: async (contentId: string) => {
    try {
      const response = await api.post(`/content/${contentId}/like`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Unlike content
  unlikeContent: async (contentId: string) => {
    try {
      const response = await api.delete(`/content/${contentId}/like`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Add comment
  addComment: async (contentId: string, comment: string) => {
    try {
      const response = await api.post(`/content/${contentId}/comments`, { comment });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Get comments
  getComments: async (contentId: string, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/content/${contentId}/comments?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Save content
  saveContent: async (contentId: string) => {
    try {
      const response = await api.post(`/content/${contentId}/save`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Unsave content
  unsaveContent: async (contentId: string) => {
    try {
      const response = await api.delete(`/content/${contentId}/save`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Get saved content
  getSavedContent: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/content/saved?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Search content
  searchContent: async (query: string, filters = {}) => {
    try {
      const params = new URLSearchParams({ q: query, ...filters });
      const response = await api.get(`/content/search?${params}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  // Get related content
  getRelatedContent: async (contentId: string, limit = 6) => {
    try {
      const response = await api.get(`/content/${contentId}/related?limit=${limit}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  }
};

export default contentService;
