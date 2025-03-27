/**
 * Application constants
 */

// API related constants
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Feature flags
export const ENABLE_DEMO_MODE = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === 'true';
export const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

// Auth related constants
export const TOKEN_KEY = 'userToken';
export const USER_KEY = 'user';
export const REFRESH_TOKEN_KEY = 'primePlus_refresh_token';

// Content related constants
export const MAX_UPLOAD_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || '100000000', 10);
export const ALLOWED_IMAGE_TYPES = (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
export const ALLOWED_VIDEO_TYPES = (process.env.NEXT_PUBLIC_ALLOWED_VIDEO_TYPES || 'video/mp4,video/webm,video/ogg').split(',');
export const ALLOWED_AUDIO_TYPES = (process.env.NEXT_PUBLIC_ALLOWED_AUDIO_TYPES || 'audio/mpeg,audio/ogg,audio/wav').split(',');

// Pagination related constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// Timeouts and intervals
export const DEBOUNCE_DELAY = 300; // 300ms for search input debounce
export const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Theme related constants
export const THEME_KEY = 'primePlus_theme';
export const DEFAULT_THEME = 'light';

// Feature flags
export const FEATURES = {
  ENABLE_VR: process.env.NEXT_PUBLIC_ENABLE_VR === 'true',
  ENABLE_AUDIO: process.env.NEXT_PUBLIC_ENABLE_AUDIO === 'true',
  ENABLE_LIVE_STREAMING: process.env.NEXT_PUBLIC_ENABLE_LIVE_STREAMING === 'true',
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_MESSAGING: true,
  ENABLE_NOTIFICATIONS: true
};

export const DEFAULT_AVATAR = '/images/default-avatar.png';
export const DEFAULT_COVER = '/images/default-cover.jpg';

export const MAX_BIO_LENGTH = 250;
export const MAX_USERNAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 8;

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'Error uploading file. Please try again.',
  FILE_TOO_LARGE: `File size exceeds ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB limit.`,
  INVALID_FILE_TYPE: 'Invalid file type. Please check allowed file types.',
}; 