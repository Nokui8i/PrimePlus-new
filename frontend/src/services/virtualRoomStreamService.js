import api from './api';
import { socketService } from './socketService';

export const virtualRoomStreamService = {
  // Start a new livestream in a virtual room
  startLivestream: async (roomId, streamData = {}) => {
    try {
      const response = await api.post(`/virtual-room-streams/room/${roomId}/start`, streamData);
      return response.data;
    } catch (error) {
      console.error('Error starting livestream:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to start livestream' };
    }
  },
  
  // Go live - transition from waiting to live
  goLive: async (streamId) => {
    try {
      const response = await api.post(`/virtual-room-streams/${streamId}/golive`);
      return response.data;
    } catch (error) {
      console.error('Error going live:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to go live' };
    }
  },
  
  // End a livestream
  endLivestream: async (streamId) => {
    try {
      const response = await api.post(`/virtual-room-streams/${streamId}/end`);
      return response.data;
    } catch (error) {
      console.error('Error ending livestream:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to end livestream' };
    }
  },
  
  // Get livestream info by ID
  getLivestreamById: async (streamId) => {
    try {
      const response = await api.get(`/virtual-room-streams/${streamId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching livestream:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch livestream' };
    }
  },
  
  // Join a livestream as a viewer
  joinLivestream: async (streamId) => {
    try {
      const response = await api.post(`/virtual-room-streams/${streamId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining livestream:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to join livestream' };
    }
  },
  
  // Leave a livestream
  leaveLivestream: async (streamId) => {
    try {
      const response = await api.post(`/virtual-room-streams/${streamId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving livestream:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to leave livestream' };
    }
  },
  
  // Get active livestreams for a room
  getRoomLivestreams: async (roomId) => {
    try {
      const response = await api.get(`/virtual-room-streams/room/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room livestreams:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch room livestreams' };
    }
  },
  
  // Send WebRTC signaling data
  sendRTCSignal: async (streamId, signalData) => {
    try {
      const response = await api.post(`/virtual-room-streams/${streamId}/signal`, signalData);
      return response.data;
    } catch (error) {
      console.error('Error sending RTC signal:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to send RTC signal' };
    }
  },
  
  // Setup WebRTC event listeners for a stream
  setupStreamEventListeners: (streamId, callbacks = {}) => {
    // Connect to socket if not already connected
    socketService.connect();
    
    // Join stream's socket room
    socketService.emit('join_stream', { streamId });
    
    // Set up event listeners
    if (callbacks.onSignalingMessage) {
      socketService.on('rtc_signaling', callbacks.onSignalingMessage);
    }
    
    if (callbacks.onIceCandidate) {
      socketService.on('rtc_ice_candidate', callbacks.onIceCandidate);
    }
    
    if (callbacks.onViewerJoined) {
      socketService.on('viewer_joined', callbacks.onViewerJoined);
    }
    
    if (callbacks.onViewerLeft) {
      socketService.on('viewer_left', callbacks.onViewerLeft);
    }
    
    if (callbacks.onStreamEnded) {
      socketService.on('livestream_ended', callbacks.onStreamEnded);
    }
    
    // Return cleanup function
    return () => {
      socketService.emit('leave_stream', { streamId });
      socketService.off('rtc_signaling');
      socketService.off('rtc_ice_candidate');
      socketService.off('viewer_joined');
      socketService.off('viewer_left');
      socketService.off('livestream_ended');
    };
  }
};

export default virtualRoomStreamService;