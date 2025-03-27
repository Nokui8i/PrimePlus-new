import api from './api';

export const analyticsService = {
  // Track an analytics event
  trackEvent: async (eventData) => {
    try {
      const response = await api.post('/analytics/track', eventData);
      return response.data;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      // Don't return error to caller - analytics should fail silently
      return { success: false };
    }
  },
  
  // Get analytics for a specific entity
  getEntityAnalytics: async (entityType, entityId, params = {}) => {
    try {
      const response = await api.get(`/analytics/entity/${entityType}/${entityId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching entity analytics:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch analytics' };
    }
  },
  
  // Get dashboard analytics
  getDashboardAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/analytics/dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch dashboard analytics' };
    }
  },
  
  // Helper functions for common events
  trackPageView: async (page, metadata = {}) => {
    return analyticsService.trackEvent({
      eventType: 'page_view',
      entityType: 'page',
      entityId: page,
      metadata
    });
  },
  
  trackRoomVisit: async (roomId, metadata = {}) => {
    return analyticsService.trackEvent({
      eventType: 'room_visit',
      entityType: 'room',
      entityId: roomId,
      metadata
    });
  },
  
  trackRoomSession: async (roomId, duration, metadata = {}) => {
    return analyticsService.trackEvent({
      eventType: 'room_session',
      entityType: 'room',
      entityId: roomId,
      duration,
      metadata
    });
  },
  
  trackAssetView: async (assetId, metadata = {}) => {
    return analyticsService.trackEvent({
      eventType: 'asset_view',
      entityType: 'asset',
      entityId: assetId,
      metadata
    });
  },
  
  trackAssetUsage: async (assetId, metadata = {}) => {
    return analyticsService.trackEvent({
      eventType: 'asset_usage',
      entityType: 'asset',
      entityId: assetId,
      metadata
    });
  },
  
  trackUserActivity: async (activityType, metadata = {}) => {
    return analyticsService.trackEvent({
      eventType: activityType,
      entityType: 'user',
      entityId: 'current', // Will be replaced with actual user ID on server
      metadata
    });
  }
};

export default analyticsService;