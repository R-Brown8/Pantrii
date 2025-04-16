/**
 * Debug Constants
 * 
 * Centralized debug configuration for the FlavorMind app.
 * Set ENABLE_DEBUG to false in production builds.
 */

const Debug = {
  // Master debug switch (set to false for production)
  ENABLE_DEBUG: true,
  
  // Debugging categories
  LOG_STATE: true,
  LOG_FILTERS: true, 
  LOG_DATES: true,
  LOG_UI: true,
  LOG_STORAGE: true,
  LOG_LIFECYCLE: true,
  
  // Specific debugging flags
  TRACK_EXPIRING_ITEMS: true,
  FORCE_REFRESH_ON_ADD: true,
  VERBOSE_DATE_LOGS: true,
  
  // Limits to prevent excessive logging
  MAX_ARRAY_LOG_LENGTH: 50,
  MAX_OBJECT_LOG_DEPTH: 2,
};

export default Debug;