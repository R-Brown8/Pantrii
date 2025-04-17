/**
 * Recipe Context Provider
 * 
 * This file implements a React Context that provides state management
 * for recipe matching functionality in the Pantrii app.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import AppContext from './AppContext';
import { calculateRecipeMatches } from '../utils/recipeMatchingUtils';
import { getRecipes } from '../api/recipes';

// Create the context
const RecipeContext = createContext();

// Custom hook for easy context use
export const useRecipeContext = () => useContext(RecipeContext);

// Context provider component
export const RecipeProvider = ({ children }) => {
  const { pantryItems, flavorProfile } = useContext(AppContext);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get recipe suggestions based on pantry items
  const getSmartSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch recipes from API
      const recipes = await getRecipes();
      
      // Use matching algorithm to calculate matches
      const matched = calculateRecipeMatches(recipes, pantryItems);
      
      setSuggestions(matched);
    } catch (err) {
      console.error('Error getting recipe suggestions:', err);
      setError('Failed to get recipe suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pantryItems]);
  
  // Context value to be provided
  const contextValue = {
    suggestions,
    loading,
    error,
    getSmartSuggestions,
  };

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContext;
