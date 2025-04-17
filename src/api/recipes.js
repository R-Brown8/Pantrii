/**
 * Recipe API Integration
 * 
 * This file handles API calls related to recipe data and matching.
 * For the MVP, it uses mock data but is structured to easily
 * connect to a real API in the future.
 */

import { mockRecipes } from './mockData';

/**
 * Get all available recipes
 * @returns {Promise<Array>} Array of recipe objects
 */
export const getRecipes = async () => {
  // In a real implementation, this would fetch from an API
  // For MVP, we're using mock data
  return new Promise((resolve) => {
    // Simulate network delay for testing
    setTimeout(() => {
      resolve(mockRecipes);
    }, 500);
  });
};

/**
 * Get a single recipe by ID
 * @param {string} id Recipe ID
 * @returns {Promise<Object>} Recipe object
 */
export const getRecipeById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const recipe = mockRecipes.find(recipe => recipe.id === id);
      if (recipe) {
        resolve(recipe);
      } else {
        reject(new Error('Recipe not found'));
      }
    }, 300);
  });
};
