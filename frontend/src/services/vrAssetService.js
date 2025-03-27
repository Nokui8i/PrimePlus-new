import api from './api';

export const vrAssetService = {
  // Upload a new VR asset
  uploadVRAsset: async (formData) => {
    try {
      const response = await api.post('/vr-assets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading VR asset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to upload VR asset' };
    }
  },
  
  // Get all VR assets with optional filters
  getAllVRAssets: async (filters = {}) => {
    try {
      const response = await api.get('/vr-assets', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching VR assets:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch VR assets' };
    }
  },
  
  // Get a specific VR asset by ID
  getVRAssetById: async (assetId) => {
    try {
      const response = await api.get(`/vr-assets/${assetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching VR asset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch VR asset' };
    }
  },
  
  // Update a VR asset
  updateVRAsset: async (assetId, data) => {
    try {
      const response = await api.put(`/vr-assets/${assetId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating VR asset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update VR asset' };
    }
  },
  
  // Delete a VR asset
  deleteVRAsset: async (assetId) => {
    try {
      const response = await api.delete(`/vr-assets/${assetId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting VR asset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to delete VR asset' };
    }
  },
  
  // Approve or reject a VR asset (admin only)
  approveVRAsset: async (assetId, isApproved) => {
    try {
      const response = await api.put(`/vr-assets/${assetId}/approve`, { isApproved });
      return response.data;
    } catch (error) {
      console.error('Error approving VR asset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to approve VR asset' };
    }
  }
};

export const virtualRoomAssetService = {
  // Add an asset to a virtual room
  addAssetToRoom: async (roomId, assetData) => {
    try {
      const response = await api.post(`/virtual-room-assets/rooms/${roomId}/assets`, assetData);
      return response.data;
    } catch (error) {
      console.error('Error adding asset to room:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to add asset to room' };
    }
  },
  
  // Get all assets in a virtual room
  getRoomAssets: async (roomId) => {
    try {
      const response = await api.get(`/virtual-room-assets/rooms/${roomId}/assets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room assets:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch room assets' };
    }
  },
  
  // Update an asset in a virtual room
  updateRoomAsset: async (roomId, assetId, assetData) => {
    try {
      const response = await api.put(`/virtual-room-assets/rooms/${roomId}/assets/${assetId}`, assetData);
      return response.data;
    } catch (error) {
      console.error('Error updating room asset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update room asset' };
    }
  },
  
  // Remove an asset from a virtual room
  removeAssetFromRoom: async (roomId, assetId) => {
    try {
      const response = await api.delete(`/virtual-room-assets/rooms/${roomId}/assets/${assetId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing asset from room:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to remove asset from room' };
    }
  },
  
  // Interact with an asset in a virtual room
  interactWithAsset: async (roomId, assetId, interactionData) => {
    try {
      const response = await api.post(`/virtual-room-assets/rooms/${roomId}/assets/${assetId}/interact`, interactionData);
      return response.data;
    } catch (error) {
      console.error('Error interacting with asset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to interact with asset' };
    }
  }
};

export default {
  vrAssetService,
  virtualRoomAssetService
};