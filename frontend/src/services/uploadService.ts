import axios from 'axios';
import { getAuthHeader } from './authService';
import { API_URL } from '@/config/constants';

/**
 * Upload content media files (images, videos, etc.)
 * @param formData - FormData with files
 * @param onUploadProgress - Progress callback
 * @returns 
 */
const uploadContentMedia = async (formData: FormData, onUploadProgress?: (progressEvent: any) => void) => {
  const config = {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  };
  
  return axios.post(`${API_URL}/upload/content`, formData, config);
};

/**
 * Check processing status of media item
 * @param mediaId - Media item ID
 * @returns 
 */
const getMediaStatus = async (mediaId: string) => {
  return axios.get(`${API_URL}/upload/status/${mediaId}`, {
    headers: getAuthHeader()
  });
};

/**
 * Get storage statistics for the current user
 * @returns Storage stats including usage by media type
 */
const getStorageStats = async () => {
  return axios.get(`${API_URL}/upload/storage-stats`, {
    headers: getAuthHeader()
  });
};

/**
 * Associate media items with content
 * @param contentId - Content ID
 * @param mediaIds - Array of media IDs to associate
 * @returns 
 */
const associateMediaWithContent = async (contentId: string, mediaIds: string[]) => {
  return axios.put(
    `${API_URL}/upload/associate`,
    { contentId, mediaIds },
    { headers: getAuthHeader() }
  );
};

/**
 * Delete a media item
 * @param mediaId - Media item ID to delete
 * @returns 
 */
const deleteMedia = async (mediaId: string) => {
  return axios.delete(`${API_URL}/upload/media/${mediaId}`, {
    headers: getAuthHeader()
  });
};

/**
 * Retry processing a failed media item
 * @param mediaId - Media item ID to retry
 * @returns 
 */
const retryProcessing = async (mediaId: string) => {
  return axios.post(`${API_URL}/upload/retry/${mediaId}`, {}, {
    headers: getAuthHeader()
  });
};

/**
 * Delete multiple media items at once
 * @param mediaIds - Array of media IDs to delete
 * @returns 
 */
const batchDeleteMedia = async (mediaIds: string[]) => {
  return axios.delete(`${API_URL}/upload/batch-delete`, {
    headers: getAuthHeader(),
    data: { mediaIds }
  });
};

const UploadService = {
  uploadContentMedia,
  getMediaStatus,
  getStorageStats,
  associateMediaWithContent,
  deleteMedia,
  retryProcessing,
  batchDeleteMedia
};

export default UploadService;