import api from './api';

export const liveStreamService = {
  // יצירת שידור חי חדש
  createLiveStream: async (streamData) => {
    const response = await api.post('/live-streams/create', streamData);
    return response.data;
  },

  // קבלת כל השידורים החיים
  getAllLiveStreams: async (filters = {}) => {
    const response = await api.get('/live-streams', { params: filters });
    return response.data;
  },

  // קבלת שידור חי ספציפי
  getLiveStreamById: async (id) => {
    const response = await api.get(`/live-streams/${id}`);
    return response.data;
  },

  // הצטרפות לשידור חי
  joinLiveStream: async (streamId, userData) => {
    const response = await api.post(`/live-streams/${streamId}/join`, userData);
    return response.data;
  },

  // שליחת הודעה בצ'אט של השידור החי
  sendLiveStreamChatMessage: async (streamId, messageData) => {
    const response = await api.post(`/live-streams/${streamId}/chat`, messageData);
    return response.data;
  },

  // קבלת הודעות צ'אט של שידור חי
  getLiveStreamChatMessages: async (streamId) => {
    const response = await api.get(`/live-streams/${streamId}/chat`);
    return response.data;
  },

  // שליחת טיפ במהלך שידור חי
  sendLiveStreamTip: async (streamId, tipData) => {
    const response = await api.post(`/live-streams/${streamId}/tip`, tipData);
    return response.data;
  },

  // עדכון סטטוס שידור חי
  updateLiveStreamStatus: async (streamId, statusData) => {
    const response = await api.put(`/live-streams/${streamId}/status`, statusData);
    return response.data;
  },

  // קבלת שידורים חיים של יוצר ספציפי
  getCreatorLiveStreams: async (creatorId) => {
    const response = await api.get(`/live-streams/creator/${creatorId}`);
    return response.data;
  },

  // הזמנת משתמשים לשידור חי
  inviteUsersToLiveStream: async (streamId, inviteeIds) => {
    const response = await api.post(`/live-streams/${streamId}/invite`, { invitees: inviteeIds });
    return response.data;
  }
};

export default liveStreamService;