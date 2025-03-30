/**
 * Form field validation utility functions
 */

/**
 * Validate email format
 * @param email Email to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Validate URL format
 * @param url URL to validate
 * @returns True if valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate phone number format
 * @param phone Phone number to validate
 * @returns True if valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove spaces, dashes, and parentheses
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');
  
  // Check if it's a valid number format (at least 10 digits)
  return /^\+?[0-9]{10,15}$/.test(cleanedPhone);
};

/**
 * Validate required field
 * @param value Field value
 * @returns True if not empty, false otherwise
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * Validate number within range
 * @param value Number to validate
 * @param min Minimum value (optional)
 * @param max Maximum value (optional)
 * @returns True if within range, false otherwise
 */
export const isNumberInRange = (value: number, min?: number, max?: number): boolean => {
  if (isNaN(value)) return false;
  
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  
  return true;
};

/**
 * Validate text length
 * @param text Text to validate
 * @param minLength Minimum length (optional)
 * @param maxLength Maximum length (optional)
 * @returns True if valid length, false otherwise
 */
export const isValidLength = (text: string, minLength?: number, maxLength?: number): boolean => {
  if (!text) return minLength === undefined || minLength === 0;
  
  if (minLength !== undefined && text.length < minLength) return false;
  if (maxLength !== undefined && text.length > maxLength) return false;
  
  return true;
};

/**
 * Validate credit card number using Luhn algorithm
 * @param cardNumber Credit card number
 * @returns True if valid, false otherwise
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  if (!cardNumber) return false;
  
  // Remove spaces and dashes
  const cleanedNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleanedNumber)) return false;
  
  // Luhn algorithm validation
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate username format
 * @param username Username to validate
 * @returns True if valid, false otherwise
 */
export const isValidUsername = (username: string): boolean => {
  if (!username) return false;
  
  // Username should be 3-20 characters and contain only letters, numbers, and underscores
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param dateString Date string to validate
 * @returns True if valid, false otherwise
 */
export const isValidDateFormat = (dateString: string): boolean => {
  if (!dateString) return false;
  
  // Check if the format is YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  
  // Check if it's a valid date
  const date = new Date(dateString);
  const timestamp = date.getTime();
  
  if (isNaN(timestamp)) return false;
  
  // Check if the date matches the input
  return dateString === date.toISOString().split('T')[0];
};

/**
 * Validate file size
 * @param fileSize File size in bytes
 * @param maxSizeInBytes Maximum allowed size
 * @returns True if valid, false otherwise
 */
export const isValidFileSize = (fileSize: number, maxSizeInBytes: number): boolean => {
  return fileSize > 0 && fileSize <= maxSizeInBytes;
};

/**
 * Validate file type/extension
 * @param fileName File name
 * @param allowedExtensions Array of allowed extensions (without dots)
 * @returns True if valid, false otherwise
 */
export const isValidFileType = (fileName: string, allowedExtensions: string[]): boolean => {
  if (!fileName) return false;
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return false;
  
  return allowedExtensions.includes(extension);
}; 