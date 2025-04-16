/**
 * Storage Utilities
 * 
 * This file provides helper functions for working with AsyncStorage.
 * It includes error handling and standardized methods for CRUD operations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../constants/config';

/**
 * Save data to AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Data to store (will be JSON stringified)
 * @returns {Promise<boolean>} Success indicator
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
    return false;
  }
};

/**
 * Retrieve data from AsyncStorage
 * @param {string} key - Storage key to retrieve
 * @returns {Promise<any>} Retrieved data or null if not found
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key to remove
 * @returns {Promise<boolean>} Success indicator
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

/**
 * Append an item to an array stored in AsyncStorage
 * @param {string} key - Storage key
 * @param {any} item - Item to append to the array
 * @returns {Promise<boolean>} Success indicator
 */
export const appendToArray = async (key, item) => {
  try {
    // Get existing array or create empty array if none exists
    const existingData = await getData(key) || [];
    
    // Append new item
    const updatedData = [...existingData, item];
    
    // Save updated array
    return await storeData(key, updatedData);
  } catch (error) {
    console.error(`Error appending to array for key ${key}:`, error);
    return false;
  }
};

/**
 * Update an item in an array stored in AsyncStorage
 * @param {string} key - Storage key
 * @param {string} itemId - ID of item to update
 * @param {any} updatedItem - Updated item data
 * @returns {Promise<boolean>} Success indicator
 */
export const updateArrayItem = async (key, itemId, updatedItem) => {
  try {
    // Get existing array
    const existingData = await getData(key) || [];
    
    // Find and update the item
    const updatedData = existingData.map(item => 
      item.id === itemId ? { ...item, ...updatedItem } : item
    );
    
    // Save updated array
    return await storeData(key, updatedData);
  } catch (error) {
    console.error(`Error updating array item for key ${key}:`, error);
    return false;
  }
};

/**
 * Remove an item from an array stored in AsyncStorage
 * @param {string} key - Storage key
 * @param {string} itemId - ID of item to remove
 * @returns {Promise<boolean>} Success indicator
 */
export const removeArrayItem = async (key, itemId) => {
  try {
    // Get existing array
    const existingData = await getData(key) || [];
    
    // Filter out the item
    const updatedData = existingData.filter(item => item.id !== itemId);
    
    // Save updated array
    return await storeData(key, updatedData);
  } catch (error) {
    console.error(`Error removing array item for key ${key}:`, error);
    return false;
  }
};

/**
 * Clear all app data (for logout, etc.)
 * @returns {Promise<boolean>} Success indicator
 */
export const clearAllData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith('flavormind_'));
    await AsyncStorage.multiRemove(appKeys);
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};
