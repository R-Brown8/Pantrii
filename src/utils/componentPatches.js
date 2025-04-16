/**
 * Component Patches
 * 
 * This file contains patches for React Native components to fix common issues.
 * Import this file in your App.js to apply all patches.
 */

import { ActivityIndicator } from 'react-native';

/**
 * Patch for React Native's ActivityIndicator component to fix the "size" prop issue.
 * Converts string size values ('small', 'large') to numeric values.
 * 
 * This fixes the error: "Unable to convert string to floating point value: 'large'"
 */
export const patchActivityIndicator = () => {
  if (!ActivityIndicator.originalRender) {
    // Store the original render method to avoid double patching
    ActivityIndicator.originalRender = ActivityIndicator.render;
    
    // Replace the render method with our patched version
    ActivityIndicator.render = function(...args) {
      // Get the props from the first argument
      const props = args[0] || {};
      const newProps = { ...props };
      
      // Convert string size values to numbers
      if (typeof newProps.size === 'string') {
        if (newProps.size === 'large') {
          newProps.size = 36;
        } else if (newProps.size === 'small') {
          newProps.size = 18;
        }
      }
      
      // Update the args with our new props
      args[0] = newProps;
      
      // Call the original render method with the updated args
      return ActivityIndicator.originalRender.apply(this, args);
    };
    
    console.log('ActivityIndicator component patched successfully');
  }
};

// Export a function to apply all patches
export const applyComponentPatches = () => {
  patchActivityIndicator();
};
