/**
 * Debug Logger Utility
 * 
 * Provides consistent logging functions with category labels and
 * the ability to enable/disable specific log categories.
 */

import Debug from '../../constants/debug';

// Configuration for debug logging
const DEBUG_CONFIG = {
  // Master switch for all logging
  enabled: Debug.ENABLE_DEBUG,
  
  // Enable/disable specific categories
  categories: {
    state: Debug.LOG_STATE,      // State management logs
    filters: Debug.LOG_FILTERS,  // Filter-related logs
    dates: Debug.LOG_DATES,      // Date calculation logs
    ui: Debug.LOG_UI,           // UI component logs
    storage: Debug.LOG_STORAGE,  // AsyncStorage operations
    lifecycle: Debug.LOG_LIFECYCLE, // Component lifecycle logs
  }
};

/**
 * Log a debug message
 * @param {string} category - Log category
 * @param {string} message - Message to log
 * @param {any} data - Optional data to include
 */
const log = (category, message, data) => {
  // Skip if debugging is disabled
  if (!DEBUG_CONFIG.enabled) return;
  
  // Skip if category is disabled
  if (!DEBUG_CONFIG.categories[category]) return;
  
  // Format the category label
  const label = `[${category.toUpperCase()}]`;
  
  // Log message with category label
  if (data === undefined) {
    console.log(`${label} ${message}`);
  } else {
    console.log(`${label} ${message}`, data);
  }
};

/**
 * Log state-related events
 */
export const logState = (message, data) => log('state', message, data);

/**
 * Log filter-related events
 */
export const logFilter = (message, data) => log('filters', message, data);

/**
 * Log date calculation events
 */
export const logDate = (message, data) => log('dates', message, data);

/**
 * Log UI component events
 */
export const logUI = (message, data) => log('ui', message, data);

/**
 * Log storage operations
 */
export const logStorage = (message, data) => log('storage', message, data);

/**
 * Log component lifecycle events
 */
export const logLifecycle = (message, data) => log('lifecycle', message, data);

/**
 * Set debug configuration
 * @param {Object} config - New configuration
 */
export const setDebugConfig = (config) => {
  Object.assign(DEBUG_CONFIG, config);
};

/**
 * Enable or disable a specific log category
 * @param {string} category - Category name
 * @param {boolean} enabled - Whether to enable or disable
 */
export const setDebugCategory = (category, enabled) => {
  if (DEBUG_CONFIG.categories.hasOwnProperty(category)) {
    DEBUG_CONFIG.categories[category] = enabled;
  }
};

/**
 * Enable or disable all debugging
 * @param {boolean} enabled - Whether to enable or disable
 */
export const setDebugEnabled = (enabled) => {
  DEBUG_CONFIG.enabled = enabled;
};

export default {
  logState,
  logFilter,
  logDate,
  logUI,
  logStorage,
  logLifecycle,
  setDebugConfig,
  setDebugCategory,
  setDebugEnabled
};