import api from './api';
import { socketService } from './socketService';

export const virtualRoomService = {
  // Create a new virtual room
  createVirtualRoom: async (roomData) => {
    try {
      const response = await api.post('/virtual-rooms/create', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating virtual room:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to create virtual room' };
    }
  },
  
  // Get all virtual rooms with optional filters
  getAllVirtualRooms: async (filters = {}) => {
    try {
      const response = await api.get('/virtual-rooms', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching virtual rooms:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch virtual rooms' };
    }
  },
  
  // Get a specific virtual room by ID
  getVirtualRoomById: async (roomId) => {
    try {
      const response = await api.get(`/virtual-rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching virtual room:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch virtual room' };
    }
  },
  
  // Join a virtual room
  joinVirtualRoom: async (roomId, accessData = {}) => {
    try {
      // First send API request
      const response = await api.post(`/virtual-rooms/${roomId}/join`, accessData);
      
      if (response.data.success) {
        // Then connect to socket room
        socketService.connect();
        socketService.emit('join_virtual_room', { roomId });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error joining virtual room:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to join virtual room' };
    }
  },
  
  // Leave a virtual room
  leaveVirtualRoom: async (roomId) => {
    try {
      // First send API request
      const response = await api.post(`/virtual-rooms/${roomId}/leave`);
      
      // Then leave socket room
      socketService.emit('leave_virtual_room', { roomId });
      
      return response.data;
    } catch (error) {
      console.error('Error leaving virtual room:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to leave virtual room' };
    }
  },
  
  // Update virtual room settings
  updateVirtualRoomSettings: async (roomId, settingsData) => {
    try {
      const response = await api.put(`/virtual-rooms/${roomId}/settings`, settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating virtual room settings:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update virtual room settings' };
    }
  },
  
  // Update participant position and rotation
  updateParticipantPosition: async (roomId, positionData) => {
    try {
      // Send API request for persistence
      const response = await api.put(`/virtual-rooms/${roomId}/position`, positionData);
      
      // Also emit socket event for real-time updates
      socketService.emit('vr_position_update', { 
        roomId, 
        position: positionData.position, 
        rotation: positionData.rotation 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating position:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update position' };
    }
  },
  
  // Send a VR interaction in a room
  sendVRInteraction: async (roomId, interactionData) => {
    socketService.emit('vr_interaction', {
      roomId,
      ...interactionData,
      timestamp: Date.now()
    });
    
    return { success: true };
  },
  
  // Set up listeners for VR room events
  setupRoomEventListeners: (callbacks = {}) => {
    // Connect to socket if not already connected
    socketService.connect();
    
    // Set up event listeners
    if (callbacks.onUserJoined) {
      socketService.on('user_joined', callbacks.onUserJoined);
    }
    
    if (callbacks.onUserLeft) {
      socketService.on('user_left', callbacks.onUserLeft);
    }
    
    if (callbacks.onRoomUpdated) {
      socketService.on('room_updated', callbacks.onRoomUpdated);
    }
    
    if (callbacks.onPositionUpdate) {
      socketService.on('vr_position_update', callbacks.onPositionUpdate);
    }
    
    if (callbacks.onInteraction) {
      socketService.on('vr_interaction', callbacks.onInteraction);
    }
    
    // Return function to remove listeners
    return () => {
      socketService.off('user_joined');
      socketService.off('user_left');
      socketService.off('room_updated');
      socketService.off('vr_position_update');
      socketService.off('vr_interaction');
    };
  }
};

export default virtualRoomService;