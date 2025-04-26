/**
 * Recipe Context Provider
 * 
 * This file implements a React Context that provides state management
 * for recipe matching functionality in the Pantrii app.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import AppContext from './AppContext';
import { calculateRecipeMatches } from '../utils/recipeMatchingUtils';
import { getRecipesByIngredient } from '../api/apiManager';

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
      
      // Log all pantry items for debugging
      console.log('[SmartSuggestions] Current pantryItems:', pantryItems);
      // Use the first pantry item as the ingredient, or 'chicken' as default
      const rawIngredient = pantryItems && pantryItems.length > 0 ? pantryItems[0].name : 'chicken';
      console.log('[SmartSuggestions] Raw ingredient:', rawIngredient);
      // Normalize: lowercase and trim
      const ingredient = typeof rawIngredient === 'string'
        ? rawIngredient.trim().toLowerCase()
        : 'chicken';
      console.log('[SmartSuggestions] Normalized ingredient for TheMealDB search:', ingredient);
      // Fetch recipes from TheMealDB API
      const recipes = await getRecipesByIngredient(ingredient);
      console.log('[SmartSuggestions] Recipes fetched from TheMealDB:', recipes);
      
      // Use matching algorithm to calculate matches
      const matched = calculateRecipeMatches(recipes, pantryItems);
      console.log('[SmartSuggestions] Matched recipes after algorithm:', matched);
      
      setSuggestions(matched);
    } catch (err) {
      console.error('[SmartSuggestions] Error getting recipe suggestions:', err);
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
