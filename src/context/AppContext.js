/**
 * App Context Provider
 * 
 * This file implements a React Context that provides global state management
 * for the Savour app. It now includes meal planning capabilities for MVP 3.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../constants/config';
import Debug from '../constants/debug';
import { logState, logFilter, logStorage, logLifecycle } from '../utils/debug/logger';

// Create the context
const AppContext = createContext();

// Custom hook for easy context use
export const useAppContext = () => useContext(AppContext);

// Context provider component
export const AppProvider = ({ children }) => {
  // State initialization
  const [meals, setMeals] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [flavorProfile, setFlavorProfile] = useState({
    likes: [],
    dislikes: []
  });

  // Load data on app start
  useEffect(() => {
    logLifecycle('AppContext initialized');
    loadData();
  }, []);

  // Load all app data from storage
  const loadData = async () => {
    logState('Loading app data...');
    setIsLoading(true);
    try {
      // Load pantry items
      const storedPantryItems = await AsyncStorage.getItem(Config.storage.pantryItems);
      logStorage('Retrieved pantry items from storage', { rawData: storedPantryItems?.substring(0, 100) + '...' });
      
      if (storedPantryItems) {
        const parsedItems = JSON.parse(storedPantryItems);
        logState('Setting pantry items', { count: parsedItems.length });
        setPantryItems(parsedItems);
      }

      // Load meal history
      const storedMeals = await AsyncStorage.getItem(Config.storage.mealHistory);
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }

      // Load meal plans (for MVP 3)
      const storedMealPlans = await AsyncStorage.getItem(Config.storage.mealPlans);
      if (storedMealPlans) {
        setMealPlans(JSON.parse(storedMealPlans));
      }

      // Load categories (for MVP 2)
      const storedCategories = await AsyncStorage.getItem('savour_pantry_categories');
      
      // Load flavor profile (for MVP 4)
      const storedFlavorProfile = await AsyncStorage.getItem(Config.storage.flavorProfile);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // Default categories if none exist
        const defaultCategories = [
          { id: '1', name: 'Fruits & Vegetables', icon: 'leaf' },
          { id: '2', name: 'Meat & Seafood', icon: 'fish' },
          { id: '3', name: 'Dairy & Eggs', icon: 'egg' },
          { id: '4', name: 'Grains & Pasta', icon: 'basket' },
          { id: '5', name: 'Spices & Condiments', icon: 'flask' },
          { id: '6', name: 'Snacks', icon: 'pizza' },
          { id: '7', name: 'Beverages', icon: 'wine' },
          { id: '8', name: 'Other', icon: 'archive' }
        ];
        setCategories(defaultCategories);
        await AsyncStorage.setItem('savour_pantry_categories', JSON.stringify(defaultCategories));
      }
      
      // Process flavor profile data
      if (storedFlavorProfile) {
        setFlavorProfile(JSON.parse(storedFlavorProfile));
      } else {
        // Default empty flavor profile
        const defaultFlavorProfile = {
          likes: [],
          dislikes: []
        };
        setFlavorProfile(defaultFlavorProfile);
        await AsyncStorage.setItem(Config.storage.flavorProfile, JSON.stringify(defaultFlavorProfile));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      logState('Error loading data', { error: error.message });
    } finally {
      setIsLoading(false);
      logState('Finished loading data');
    }
  };

  // Force UI refresh for expiring items - this is disabled for now
  const forceExpiryRefresh = () => {
    try {
      if (Debug.FORCE_REFRESH_ON_ADD) {
        logState('Forcing expiry refresh functionality is disabled');
        // This was causing issues, so it's now disabled
        // setPantryItems([...pantryItems]);
      }
    } catch (error) {
      console.error('Error in forceExpiryRefresh:', error);
    }
  };

  // Add a new pantry item
  const addPantryItem = async (item) => {
    try {
      logState('Adding pantry item', { item });
      
      // Add ID if not present
      const newItem = {
        ...item,
        id: item.id || Date.now().toString(),
      };
      
      // Debug item expiry
      logFilter('New item expiry status', { 
        item: newItem.name,
        expiry: newItem.expiry,
        isExpired: new Date(newItem.expiry) < new Date(),
        daysUntilExpiry: Math.ceil((new Date(newItem.expiry) - new Date()) / (1000 * 60 * 60 * 24))
      });
      
      // Update state
      const updatedItems = [...pantryItems, newItem];
      logState('Setting updated pantry items', { count: updatedItems.length });
      setPantryItems(updatedItems);
      
      // Save to storage
      logStorage('Saving pantry items to storage', { count: updatedItems.length });
      await AsyncStorage.setItem(Config.storage.pantryItems, JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error('Error adding pantry item:', error);
      logState('Error adding pantry item', { error: error.message });
      return false;
    }
  };

  // Update an existing pantry item
  const updatePantryItem = async (updatedItem) => {
    try {
      logState('Updating pantry item', { itemId: updatedItem.id, item: updatedItem });
      
      const updatedItems = pantryItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      setPantryItems(updatedItems);
      
      await AsyncStorage.setItem(Config.storage.pantryItems, JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error('Error updating pantry item:', error);
      return false;
    }
  };

  // Remove a pantry item
  const removePantryItem = async (itemId) => {
    try {
      logState('Removing pantry item', { itemId });
      
      const updatedItems = pantryItems.filter(item => item.id !== itemId);
      setPantryItems(updatedItems);
      
      await AsyncStorage.setItem(Config.storage.pantryItems, JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error('Error removing pantry item:', error);
      return false;
    }
  };

  // Add a new meal
  const addMeal = async (meal) => {
    try {
      // Add ID if not present
      const newMeal = {
        ...meal,
        id: meal.id || Date.now().toString(),
      };
      
      // Update state
      const updatedMeals = [...meals, newMeal];
      setMeals(updatedMeals);
      
      // Save to storage
      await AsyncStorage.setItem(Config.storage.mealHistory, JSON.stringify(updatedMeals));
      return true;
    } catch (error) {
      console.error('Error adding meal:', error);
      return false;
    }
  };

  // Remove a meal
  const removeMeal = async (mealId) => {
    try {
      const updatedMeals = meals.filter(meal => meal.id !== mealId);
      setMeals(updatedMeals);
      
      await AsyncStorage.setItem(Config.storage.mealHistory, JSON.stringify(updatedMeals));
      return true;
    } catch (error) {
      console.error('Error removing meal:', error);
      return false;
    }
  };

  // Add a new category
  const addCategory = async (category) => {
    try {
      const newCategory = {
        ...category,
        id: category.id || Date.now().toString(),
      };
      
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      await AsyncStorage.setItem('savour_pantry_categories', JSON.stringify(updatedCategories));
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  };

  // Get expiring items (within X days)
  const getExpiringItems = (days = Config.app.expiryWarningDays) => {
    logFilter('Getting expiring items', { warningDays: days, itemCount: pantryItems.length });
    
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + days);
    
    logFilter('Date ranges for expiring items', { 
      today: today.toISOString(), 
      warningDate: warningDate.toISOString() 
    });
    
    const expiringItems = pantryItems.filter(item => {
      const expiryDate = new Date(item.expiry);
      const isExpiring = expiryDate > today && expiryDate <= warningDate;
      
      // Log detailed debugging for each item's expiry check
      logFilter('Item expiry check', { 
        name: item.name,
        expiry: item.expiry, 
        expiryDate: expiryDate.toISOString(),
        isAfterToday: expiryDate > today,
        isBeforeWarning: expiryDate <= warningDate,
        isExpiring
      });
      
      return isExpiring;
    });
    
    logFilter('Found expiring items', { count: expiringItems.length });
    return expiringItems;
  };

  // Get expired items
  const getExpiredItems = () => {
    logFilter('Getting expired items', { itemCount: pantryItems.length });
    
    const today = new Date();
    logFilter('Today date for expired check', { today: today.toISOString() });
    
    const expiredItems = pantryItems.filter(item => {
      const expiryDate = new Date(item.expiry);
      const isExpired = expiryDate < today;
      
      // Log detailed debugging for each item's expiry check
      logFilter('Item expired check', { 
        name: item.name,
        expiry: item.expiry, 
        expiryDate: expiryDate.toISOString(),
        isBeforeToday: expiryDate < today,
        isExpired
      });
      
      return isExpired;
    });
    
    logFilter('Found expired items', { count: expiredItems.length });
    return expiredItems;
  };

  // Add a new meal plan
  const addMealPlan = async (mealPlan) => {
    try {
      // Add ID if not present
      const newMealPlan = {
        ...mealPlan,
        id: mealPlan.id || Date.now().toString(),
      };
      
      // Update state
      const updatedMealPlans = [...mealPlans, newMealPlan];
      setMealPlans(updatedMealPlans);
      
      // Save to storage
      await AsyncStorage.setItem(Config.storage.mealPlans, JSON.stringify(updatedMealPlans));
      return true;
    } catch (error) {
      console.error('Error adding meal plan:', error);
      return false;
    }
  };

  // Remove a meal plan
  const removeMealPlan = async (mealPlanId) => {
    try {
      const updatedMealPlans = mealPlans.filter(plan => plan.id !== mealPlanId);
      setMealPlans(updatedMealPlans);
      await AsyncStorage.setItem(Config.storage.mealPlans, JSON.stringify(updatedMealPlans));
      return true;
    } catch (error) {
      console.error('Error removing meal plan:', error);
      return false;
    }
  };
  
  // Update flavor profile
  const updateFlavorProfile = async (updatedProfile) => {
    try {
      logState('Updating flavor profile', { profile: updatedProfile });
      
      setFlavorProfile(updatedProfile);
      await AsyncStorage.setItem(Config.storage.flavorProfile, JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error('Error updating flavor profile:', error);
      return false;
    }
  };

  // Add a flavor to likes
  const addFlavorLike = async (flavor) => {
    try {
      // Don't add duplicates
      if (flavorProfile.likes.includes(flavor)) {
        return true;
      }
      
      // Remove from dislikes if present
      const updatedDislikes = flavorProfile.dislikes.filter(item => item !== flavor);
      
      const updatedProfile = {
        likes: [...flavorProfile.likes, flavor],
        dislikes: updatedDislikes
      };
      
      return await updateFlavorProfile(updatedProfile);
    } catch (error) {
      console.error('Error adding flavor like:', error);
      return false;
    }
  };

  // Add a flavor to dislikes
  const addFlavorDislike = async (flavor) => {
    try {
      // Don't add duplicates
      if (flavorProfile.dislikes.includes(flavor)) {
        return true;
      }
      
      // Remove from likes if present
      const updatedLikes = flavorProfile.likes.filter(item => item !== flavor);
      
      const updatedProfile = {
        likes: updatedLikes,
        dislikes: [...flavorProfile.dislikes, flavor]
      };
      
      return await updateFlavorProfile(updatedProfile);
    } catch (error) {
      console.error('Error adding flavor dislike:', error);
      return false;
    }
  };

  // Remove a flavor preference
  const removeFlavorPreference = async (flavor) => {
    try {
      const updatedProfile = {
        likes: flavorProfile.likes.filter(item => item !== flavor),
        dislikes: flavorProfile.dislikes.filter(item => item !== flavor)
      };
      
      return await updateFlavorProfile(updatedProfile);
    } catch (error) {
      console.error('Error removing flavor preference:', error);
      return false;
    }
  };

  // Context value to be provided
  const contextValue = {
    // State
    meals,
    pantryItems,
    mealPlans,
    isLoading,
    categories,
    flavorProfile,
    
    // Actions
    loadData,
    addPantryItem,
    updatePantryItem,
    removePantryItem,
    addMeal,
    removeMeal,
    addCategory,
    addMealPlan,
    removeMealPlan,
    forceExpiryRefresh,
    
    // Helper functions
    getExpiringItems,
    getExpiredItems,
    
    // Flavor profile functions
    updateFlavorProfile,
    addFlavorLike,
    addFlavorDislike,
    removeFlavorPreference,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;