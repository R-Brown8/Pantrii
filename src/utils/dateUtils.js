/**
 * Date Utility Functions
 * 
 * This file provides helper functions for working with dates
 * throughout the app, especially for expiration date handling.
 */

import { logDate } from './debug/logger';

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export const formatDateString = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Format a date for display to users
 * @param {string|Date} date - Date to format (Date object or ISO string)
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate days remaining until a date
 * @param {string|Date} date - Target date (Date object or ISO string)
 * @returns {number} Days remaining (negative if date is in the past)
 */
export const getDaysRemaining = (date) => {
  if (!date) {
    logDate('getDaysRemaining received null/undefined date', date);
    return 0;
  }
  
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const currentDate = new Date();
  
  // Log date information for debugging
  logDate('getDaysRemaining input date', {
    originalDate: date,
    parsedDate: targetDate.toISOString(),
    currentDate: currentDate.toISOString()
  });
  
  // Reset time components to compare dates only
  targetDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.round(timeDiff / (1000 * 60 * 60 * 24));
  
  logDate('getDaysRemaining result', daysRemaining);
  return daysRemaining;
};

/**
 * Create a relative time description
 * @param {string|Date} date - Target date (Date object or ISO string)
 * @returns {string} Human-readable description of time remaining
 */
export const getRelativeTimeDescription = (date) => {
  const days = getDaysRemaining(date);
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  
  if (days > 1 && days < 7) return `In ${days} days`;
  if (days >= 7 && days < 14) return 'In 1 week';
  if (days >= 14 && days < 30) return `In ${Math.floor(days / 7)} weeks`;
  if (days >= 30 && days < 60) return 'In 1 month';
  if (days >= 60) return `In ${Math.floor(days / 30)} months`;
  
  if (days < -1 && days > -7) return `${Math.abs(days)} days ago`;
  if (days <= -7 && days > -14) return '1 week ago';
  if (days <= -14 && days > -30) return `${Math.floor(Math.abs(days) / 7)} weeks ago`;
  if (days <= -30 && days > -60) return '1 month ago';
  if (days <= -60) return `${Math.floor(Math.abs(days) / 30)} months ago`;
  
  return '';
};

/**
 * Get formatted expiry status
 * @param {string|Date} expiryDate - Expiry date
 * @returns {Object} Status information
 */
export const getExpiryStatus = (expiryDate) => {
  logDate('getExpiryStatus called with', expiryDate);
  
  const days = getDaysRemaining(expiryDate);
  let status;
  
  if (days < 0) {
    status = {
      status: 'expired',
      label: `Expired ${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} ago`,
      critical: true
    };
  } else if (days === 0) {
    status = {
      status: 'expiring',
      label: 'Expires today',
      critical: true
    };
  } else if (days <= 3) {
    status = {
      status: 'warning',
      label: days === 1 ? 'Expires tomorrow' : `Expires in ${days} days`,
      critical: false
    };
  } else {
    status = {
      status: 'good',
      label: `Expires in ${days} days`,
      critical: false
    };
  }
  
  logDate('getExpiryStatus result', {
    input: expiryDate,
    daysRemaining: days,
    status: status
  });
  
  return status;
};

/**
 * Calculate a default expiry date
 * @param {number} daysToAdd - Days to add to current date
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export const getDefaultExpiryDate = (daysToAdd = 14) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return formatDateString(date);
};
