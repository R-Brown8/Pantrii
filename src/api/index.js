/**
 * API Service Layer
 * 
 * This file provides a centralized interface for all API operations,
 * whether they use the real backend or mock data.
 */

import { MOCK_PANTRY_ITEMS, MOCK_MEALS, MOCK_CATEGORIES } from './mockData';
import { getRecipes, getRecipeById } from './recipes';
import Config from '../constants/config';

// Export the recipe functions
export { getRecipes, getRecipeById };

// Simulate API delay for more realistic development
const apiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all pantry items
 * @returns {Promise<Array>} List of pantry items
 */
export const getPantryItems = async () => {
  await apiDelay();
  
  // Use mock data if configured
  if (Config.api.useMockData) {
    return [...MOCK_PANTRY_ITEMS];
  }
  
  // Real API implementation would go here
  try {
    // const response = await fetch(`${Config.api.baseUrl}/pantry`);
    // return await response.json();
    throw new Error('Real API not implemented');
  } catch (error) {
    console.warn('Error fetching pantry items from API, using mock data instead');
    return [...MOCK_PANTRY_ITEMS];
  }
};

/**
 * Add or update a pantry item
 * @param {Object} item - The pantry item to save
 * @returns {Promise<Object>} The saved item
 */
export const savePantryItem = async (item) => {
  await apiDelay();
  
  // In a real app, this would call the API
  // For this MVP, we'll just return the item as if it was saved
  
  return { ...item, updatedAt: new Date().toISOString() };
};

/**
 * Delete a pantry item
 * @param {String} itemId - ID of item to delete
 * @returns {Promise<boolean>} Success indicator
 */
export const deletePantryItem = async (itemId) => {
  await apiDelay();
  
  // In a real app, this would call the API
  // For this MVP, we'll just return success
  
  return true;
};

/**
 * Get all meals
 * @returns {Promise<Array>} List of meals
 */
export const getMeals = async () => {
  await apiDelay();
  
  // Use mock data if configured
  if (Config.api.useMockData) {
    return [...MOCK_MEALS];
  }
  
  // Real API implementation would go here
  try {
    // const response = await fetch(`${Config.api.baseUrl}/meals`);
    // return await response.json();
    throw new Error('Real API not implemented');
  } catch (error) {
    console.warn('Error fetching meals from API, using mock data instead');
    return [...MOCK_MEALS];
  }
};

/**
 * Get all pantry categories
 * @returns {Promise<Array>} List of categories
 */
export const getCategories = async () => {
  await apiDelay();
  
  // Use mock data if configured
  if (Config.api.useMockData) {
    return [...MOCK_CATEGORIES];
  }
  
  // Real API implementation would go here
  try {
    // const response = await fetch(`${Config.api.baseUrl}/categories`);
    // return await response.json();
    throw new Error('Real API not implemented');
  } catch (error) {
    console.warn('Error fetching categories from API, using mock data instead');
    return [...MOCK_CATEGORIES];
  }
};
