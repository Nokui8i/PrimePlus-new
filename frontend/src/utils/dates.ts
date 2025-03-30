/**
 * Date utility functions for manipulating and calculating dates
 */

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns True if date is in the past
 */
export const isPastDate = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  return checkDate < new Date();
};

/**
 * Check if a date is today
 * @param date Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Get difference in days between two dates
 * @param date1 First date
 * @param date2 Second date (defaults to today)
 * @returns Number of days between dates
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  // Remove time part
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  
  // Convert to days
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

/**
 * Add days to a date
 * @param date Starting date
 * @param days Number of days to add
 * @returns New date with days added
 */
export const addDays = (date: Date | string, days: number): Date => {
  const result = typeof date === 'string' ? new Date(date) : new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to a date
 * @param date Starting date
 * @param months Number of months to add
 * @returns New date with months added
 */
export const addMonths = (date: Date | string, months: number): Date => {
  const result = typeof date === 'string' ? new Date(date) : new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get start of day (00:00:00)
 * @param date Date to use
 * @returns Date set to start of day
 */
export const startOfDay = (date: Date | string): Date => {
  const result = typeof date === 'string' ? new Date(date) : new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day (23:59:59.999)
 * @param date Date to use
 * @returns Date set to end of day
 */
export const endOfDay = (date: Date | string): Date => {
  const result = typeof date === 'string' ? new Date(date) : new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Get start of month (1st day, 00:00:00)
 * @param date Date to use
 * @returns Date set to start of month
 */
export const startOfMonth = (date: Date | string): Date => {
  const result = typeof date === 'string' ? new Date(date) : new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of month (last day, 23:59:59.999)
 * @param date Date to use
 * @returns Date set to end of month
 */
export const endOfMonth = (date: Date | string): Date => {
  const result = typeof date === 'string' ? new Date(date) : new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Get date range array between two dates
 * @param startDate Start date
 * @param endDate End date
 * @returns Array of dates between start and end (inclusive)
 */
export const getDateRange = (startDate: Date | string, endDate: Date | string): Date[] => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const dateArray = [];
  let currentDate = new Date(start);
  
  // Set to start of day
  currentDate.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Loop through dates
  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dateArray;
};

/**
 * Format date as ISO string without time (YYYY-MM-DD)
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatISODate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Get relative date description
 * @param date Date to describe
 * @returns Description like "Today", "Yesterday", "Tomorrow", or formatted date
 */
export const getRelativeDateDescription = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  // Set to start of day for comparison
  d.setHours(0, 0, 0, 0);
  const compareToday = new Date(today);
  compareToday.setHours(0, 0, 0, 0);
  
  // Create yesterday and tomorrow dates
  const yesterday = new Date(compareToday);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(compareToday);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Compare
  if (d.getTime() === compareToday.getTime()) {
    return 'Today';
  } else if (d.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (d.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  
  // Format date for other cases
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate subscription renewal date
 * @param startDate Subscription start date
 * @param periodMonths Billing period in months
 * @returns Next renewal date
 */
export const calculateRenewalDate = (startDate: Date | string, periodMonths = 1): Date => {
  const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
  
  // Calculate renewal date based on periodMonths
  const renewalDate = new Date(start);
  renewalDate.setMonth(renewalDate.getMonth() + periodMonths);
  
  return renewalDate;
};

/**
 * Calculate subscription days remaining
 * @param endDate Subscription end date
 * @returns Number of days remaining (0 if expired)
 */
export const calculateDaysRemaining = (endDate: Date | string): number => {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  // If already expired, return 0
  if (end < now) return 0;
  
  // Calculate days difference
  return getDaysDifference(now, end);
};

/**
 * Check if a date falls within a range
 * @param date Date to check
 * @param startDate Start of range
 * @param endDate End of range
 * @returns True if date is within range (inclusive)
 */
export const isDateInRange = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return checkDate >= start && checkDate <= end;
}; 