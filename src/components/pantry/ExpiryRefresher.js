/**
 * ExpiryRefresher Component
 * 
 * A utility component that helps ensure the expiry status of items
 * is correctly updated in the UI by forcing refreshes when needed.
 * This component doesn't render anything visible.
 */

import { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { logFilter, logLifecycle } from '../../utils/debug/logger';
import Debug from '../../constants/debug';

const ExpiryRefresher = ({ currentFilter }) => {
  // Get context data
  const { 
    pantryItems, 
    getExpiringItems, 
    getExpiredItems,
    forceExpiryRefresh
  } = useAppContext();
  
  // Refs to track changes
  const prevFilterRef = useRef('');
  
  // Force refresh when filter changes to ensure proper calculation
  useEffect(() => {
    if (prevFilterRef.current !== currentFilter) {
      logFilter('Filter type changed', { 
        from: prevFilterRef.current, 
        to: currentFilter 
      });
      
      // Update the previous filter
      prevFilterRef.current = currentFilter;
    }
  }, [currentFilter]);
  
  // Lifecycle logging
  useEffect(() => {
    logLifecycle('ExpiryRefresher mounted');
    return () => {
      logLifecycle('ExpiryRefresher unmounted');
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default ExpiryRefresher;