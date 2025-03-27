import api from './api';

export const virtualRoomService = {
  // יצירת חדר וירטואלי חדש
  createVirtualRoom: async (roomData) => {
    const response = await api.post('/virtual-rooms/create', roomData);
    return response.data;
  },

  // קבלת כל החדרים הוירטואליים
  getAllVirtualRooms: async (filters = {}) => {
    const response = await api.get('/virtual-rooms', { params: filters });
    return response.data;
  },

  // קבלת חדר וירטואלי ספציפי
  getVirtualRoomById: async (id) => {
    const response = await api.get(`/virtual-rooms/${id}`);
    return response.data;
  },

  // הצטרפות לחדר וירטואלי
  joinVirtualRoom: async (roomId, userData) => {
    const response = await api.post(`/virtual-rooms/${roomId}/join`, userData);
    return response.data;
  },

  // עדכון הגדרות חדר וירטואלי
  updateVirtualRoomSettings: async (roomId, settingsData) => {
    const response = await api.put(`/virtual-rooms/${roomId}/settings`, settingsData);
    return response.data;
  },

  // יצירת אירוע בחדר וירטואלי
  createVirtualRoomEvent: async (roomId, eventData) => {
    const response = await api.post(`/virtual-rooms/${roomId}/events`, eventData);
    return response.data;
  },

  // קבלת אירועים בחדר וירטואלי
  getVirtualRoomEvents: async (roomId) => {
    const response = await api.get(`/virtual-rooms/${roomId}/events`);
    return response.data;
  },

  // הזמנת משתמשים לחדר וירטואלי
  inviteUsersToVirtualRoom: async (roomId, inviteeIds) => {
    const response = await api.post(`/virtual-rooms/${roomId}/invite`, { invitees: inviteeIds });
    return response.data;
  },

  // קבלת החדרים של היוצר
  getCreatorVirtualRooms: async (creatorId) => {
    const response = await api.get(`/virtual-rooms/creator/${creatorId}`);
    return response.data;
  }
};

export default virtualRoomService;