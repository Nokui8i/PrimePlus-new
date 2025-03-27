import { useState, useEffect, useCallback, useContext } from 'react';
import { analyticsService } from '../services/analyticsService';
import { UserContext } from '../context/UserContext';

/**
 * Hook for analytics tracking and data retrieval
 */
export const useAnalytics = () => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [currentEntity, setCurrentEntity] = useState(null);
  
  // Start tracking a session
  const startSession = useCallback((entityType, entityId, metadata = {}) => {
    setSessionStartTime(Date.now());
    setCurrentEntity({ type: entityType, id: entityId, metadata });
    
    // Track initial visit
    if (entityType === 'room') {
      analyticsService.trackRoomVisit(entityId, metadata);
    } else if (entityType === 'asset') {
      analyticsService.trackAssetView(entityId, metadata);
    }
  }, []);
  
  // End tracking a session
  const endSession = useCallback(() => {
    if (!sessionStartTime || !currentEntity) return;
    
    const duration = Math.round((Date.now() - sessionStartTime) / 1000); // Duration in seconds
    
    if (currentEntity.type === 'room') {
      analyticsService.trackRoomSession(
        currentEntity.id,
        duration,
        { ...currentEntity.metadata, sessionDuration: duration }
      );
    }
    
    setSessionStartTime(null);
    setCurrentEntity(null);
  }, [sessionStartTime, currentEntity]);
  
  // Track any analytics event
  const trackEvent = useCallback(async (eventType, entityType, entityId, eventData = {}) => {
    return analyticsService.trackEvent({
      eventType,
      entityType,
      entityId,
      ...eventData
    });
  }, []);
  
  // Get analytics for a specific entity
  const getEntityAnalytics = useCallback(async (entityType, entityId, params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analyticsService.getEntityAnalytics(entityType, entityId, params);
      
      if (!response.success) {
        setError(response.message || 'Failed to fetch analytics');
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get dashboard analytics
  const getDashboardAnalytics = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analyticsService.getDashboardAnalytics(params);
      
      if (!response.success) {
        setError(response.message || 'Failed to fetch dashboard analytics');
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Track page view when component mounts
  useEffect(() => {
    const trackPageView = () => {
      if (typeof window !== 'undefined') {
        analyticsService.trackPageView(window.location.pathname);
      }
    };
    
    trackPageView();
    
    // End session when component unmounts
    return () => {
      endSession();
    };
  }, [endSession]);
  
  return {
    trackEvent,
    startSession,
    endSession,
    getEntityAnalytics,
    getDashboardAnalytics,
    isLoading,
    error
  };
};

export default useAnalytics;