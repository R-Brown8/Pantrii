/**
 * Flavor Combinations Utility
 * 
 * Functions for tracking and suggesting flavor combinations based on user preferences.
 * Part of MVP 4 enhanced features.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../constants/config';

// Storage key for flavor combinations
const FLAVOR_COMBINATIONS_KEY = 'flavormind_flavor_combinations';

/**
 * Tracks a meal's flavor combination in user history
 * 
 * @param {string[]} flavors - Array of flavor IDs in the meal
 * @param {boolean} liked - Whether the user liked the combination (default: true)
 * @returns {Promise<boolean>} Success status
 */
export const trackFlavorCombination = async (flavors, liked = true) => {
  try {
    // Need at least 2 flavors to be a combination
    if (!flavors || flavors.length < 2) {
      return false;
    }
    
    // Sort flavors for consistent storage (order doesn't matter)
    const sortedFlavors = [...flavors].sort();
    const combinationKey = sortedFlavors.join(',');
    
    // Get existing combinations
    const storedData = await AsyncStorage.getItem(FLAVOR_COMBINATIONS_KEY);
    let combinations = storedData ? JSON.parse(storedData) : {};
    
    // Update or add the combination
    if (combinations[combinationKey]) {
      combinations[combinationKey] = {
        flavors: sortedFlavors,
        count: combinations[combinationKey].count + 1,
        liked: liked ? combinations[combinationKey].liked + 1 : combinations[combinationKey].liked,
        lastUsed: new Date().toISOString()
      };
    } else {
      combinations[combinationKey] = {
        flavors: sortedFlavors,
        count: 1,
        liked: liked ? 1 : 0,
        lastUsed: new Date().toISOString()
      };
    }
    
    // Save updated combinations
    await AsyncStorage.setItem(FLAVOR_COMBINATIONS_KEY, JSON.stringify(combinations));
    return true;
  } catch (error) {
    console.error('Error tracking flavor combination:', error);
    return false;
  }
};

/**
 * Retrieves user's tracked flavor combinations
 * 
 * @returns {Promise<Object>} Object containing flavor combinations data
 */
export const getFlavorCombinations = async () => {
  try {
    const storedData = await AsyncStorage.getItem(FLAVOR_COMBINATIONS_KEY);
    return storedData ? JSON.parse(storedData) : {};
  } catch (error) {
    console.error('Error retrieving flavor combinations:', error);
    return {};
  }
};

/**
 * Recommends flavor combinations based on user history
 * 
 * @param {string} baseFlavorId - Flavor ID to find combinations for
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Promise<Array>} Array of recommended flavor combinations
 */
export const recommendCombinations = async (baseFlavorId, limit = 3) => {
  try {
    if (!baseFlavorId) return [];
    
    // Get stored combinations
    const combinations = await getFlavorCombinations();
    if (Object.keys(combinations).length === 0) {
      return getDefaultCombinations(baseFlavorId, limit);
    }
    
    // Filter combinations that include the base flavor
    const relevantCombinations = Object.values(combinations).filter(
      combo => combo.flavors.includes(baseFlavorId)
    );
    
    // Sort by user preference (liked ratio) and usage count
    const sortedCombinations = relevantCombinations.sort((a, b) => {
      // Calculate liked ratio (liked / count)
      const aRatio = a.liked / a.count;
      const bRatio = b.liked / b.count;
      
      // Primary sort by ratio, secondary by count
      if (bRatio !== aRatio) {
        return bRatio - aRatio;
      }
      
      return b.count - a.count;
    });
    
    // Return the top combinations (excluding the base flavor)
    return sortedCombinations.slice(0, limit).map(combo => {
      return {
        baseFlavor: baseFlavorId,
        pairedFlavors: combo.flavors.filter(f => f !== baseFlavorId),
        score: (combo.liked / combo.count) * Math.min(1, combo.count / 5) // Scale by usage count
      };
    });
  } catch (error) {
    console.error('Error recommending combinations:', error);
    return getDefaultCombinations(baseFlavorId, limit);
  }
};

/**
 * Provides default flavor combinations when user has no history
 * 
 * @param {string} baseFlavorId - Base flavor ID
 * @param {number} limit - Maximum number of recommendations
 * @returns {Array} Default recommended combinations
 */
const getDefaultCombinations = (baseFlavorId, limit = 3) => {
  // Classic flavor pairs that work well together
  const defaultPairings = {
    'sweet': ['sour', 'salty', 'bitter', 'creamy'],
    'salty': ['sweet', 'sour', 'umami', 'smoky'],
    'sour': ['sweet', 'salty', 'spicy', 'aromatic'],
    'bitter': ['sweet', 'salty', 'creamy', 'aromatic'],
    'umami': ['salty', 'sour', 'aromatic', 'spicy'],
    'spicy': ['sweet', 'sour', 'creamy', 'tangy'],
    'aromatic': ['salty', 'sweet', 'bitter', 'umami'],
    'creamy': ['sweet', 'sour', 'spicy', 'tangy'],
    'smoky': ['sweet', 'spicy', 'salty', 'tangy'],
    'tangy': ['sweet', 'spicy', 'creamy', 'salty']
  };
  
  // Check if base flavor has default pairings
  if (!defaultPairings[baseFlavorId]) {
    return [];
  }
  
  // Return default pairings
  return defaultPairings[baseFlavorId].slice(0, limit).map(flavorId => {
    return {
      baseFlavor: baseFlavorId,
      pairedFlavors: [flavorId],
      score: 0.5 // Default score for predefined combinations
    };
  });
};

/**
 * Resets all tracked flavor combinations
 * 
 * @returns {Promise<boolean>} Success status
 */
export const resetFlavorCombinations = async () => {
  try {
    await AsyncStorage.removeItem(FLAVOR_COMBINATIONS_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting flavor combinations:', error);
    return false;
  }
};
