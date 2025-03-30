/**
 * Format utility functions for consistent date and number formatting
 */

/**
 * Format a date according to the application standard
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatStandardDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date to include time
 * @param date Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a price for display
 * @param amount Price amount
 * @returns Formatted price string
 */
export const formatPrice = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined) return '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numAmount);
};

/**
 * Format a number as an integer with comma separators
 * @param num Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('en-US').format(numValue);
};

/**
 * Format a percent value
 * @param percent Percent value (0-100)
 * @returns Formatted percent string with % symbol
 */
export const formatPercent = (percent: number | string | null | undefined): string => {
  if (percent === null || percent === undefined) return '0%';
  
  const numValue = typeof percent === 'string' ? parseFloat(percent) : percent;
  
  if (isNaN(numValue)) return '0%';
  
  return `${numValue.toFixed(1)}%`;
};

/**
 * Format a subscription status for display
 * @param status Status value
 * @returns Formatted status string
 */
export const formatSubscriptionStatus = (status: string | null | undefined): string => {
  if (!status) return 'Unknown';
  
  const statusMap: Record<string, string> = {
    'active': 'Active',
    'canceled': 'Canceled',
    'expired': 'Expired',
    'trial': 'Trial',
    'past_due': 'Past Due',
    'unpaid': 'Unpaid',
    'pending': 'Pending'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Get class name for status
 * @param status Status value
 * @returns Class name for styling the status
 */
export const getStatusClassName = (status: string | null | undefined): string => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusClasses: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'canceled': 'bg-red-100 text-red-800',
    'expired': 'bg-gray-100 text-gray-800',
    'trial': 'bg-blue-100 text-blue-800',
    'past_due': 'bg-yellow-100 text-yellow-800',
    'unpaid': 'bg-red-100 text-red-800',
    'pending': 'bg-purple-100 text-purple-800'
  };
  
  return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Format file size for display
 * @param bytes Size in bytes
 * @returns Human-readable file size
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format duration in seconds to MM:SS format
 * @param seconds Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format long duration in seconds to hours, minutes, seconds
 * @param seconds Duration in seconds
 * @returns Formatted duration string
 */
export const formatLongDuration = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined) return '0h 0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

/**
 * Truncate text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string | null | undefined, maxLength: number = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Format a name for display (first letter of each word capitalized)
 * @param name Name to format
 * @returns Formatted name
 */
export const formatName = (name: string | null | undefined): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get initials from name (up to 2 characters)
 * @param name Full name
 * @returns Initials
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}; 