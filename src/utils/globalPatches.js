/**
 * globalPatches.js
 * 
 * A consolidated utility file that handles all necessary runtime patches
 * for the FlavorMind MVP 3 application.
 * 
 * This file combines functionality from:
 * - fix-activity-indicator-imports.js
 * - fix-activity-indicator-patch.js
 * - fix-activity-indicator.js
 * - fix-node-modules.js
 * - fix-all-issues.js
 * - src/utils/patchDateTimePicker.js
 * - src/utils/stringToNumberPatch.js
 */

import { ActivityIndicator, Animated } from 'react-native';

// Try to import DateTimePicker - wrapped in try/catch in case it's not installed
let DateTimePicker;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (error) {
  console.log('[Patch] DateTimePicker not available, skipping specific patch');
}

/**
 * Recursively process style objects to convert string values to numbers where appropriate
 */
const processStyleObject = (style) => {
  if (!style || typeof style !== 'object') return style;
  
  // Handle array of styles
  if (Array.isArray(style)) {
    return style.map(processStyleObject);
  }
  
  // List of style properties that should be numbers, not strings
  const numericProperties = [
    'width', 'height', 'top', 'left', 'right', 'bottom',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'marginHorizontal', 'marginVertical',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'paddingHorizontal', 'paddingVertical',
    'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
    'fontSize', 'lineHeight', 'letterSpacing', 'flex', 'flexGrow', 'flexShrink',
    'zIndex', 'opacity', 'elevation',
    'size'
  ];
  
  // Process object properties
  const result = {};
  
  Object.entries(style).forEach(([key, value]) => {
    // Recursively process nested style objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = processStyleObject(value);
    } 
    // Convert numeric strings to numbers for appropriate properties
    else if (typeof value === 'string' && numericProperties.includes(key)) {
      // Special handling for size="large" or size="small"
      if (key === 'size') {
        if (value === 'large') {
          result[key] = 36;
        } else if (value === 'small') {
          result[key] = 18;
        } else if (!isNaN(parseFloat(value))) {
          result[key] = parseFloat(value);
        } else {
          result[key] = value;
        }
      }
      // Convert other numeric strings to numbers if they look like numbers
      else if (!isNaN(parseFloat(value)) && value.trim() !== '') {
        result[key] = parseFloat(value);
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

/**
 * Fix a component's props by converting string sizes to number values
 */
const fixComponentProps = (props) => {
  if (!props || typeof props !== 'object') return props;
  
  // Create a new props object to avoid mutations
  const fixedProps = { ...props };
  
  // Fix size property directly
  if (typeof fixedProps.size === 'string') {
    if (fixedProps.size === 'large') {
      fixedProps.size = 36;
    } else if (fixedProps.size === 'small') {
      fixedProps.size = 18;
    }
  }
  
  // Fix style properties
  if (fixedProps.style) {
    fixedProps.style = processStyleObject(fixedProps.style);
  }
  
  return fixedProps;
};

/**
 * Apply patch to a specific component
 */
const patchComponent = (Component, componentName = 'Unknown') => {
  if (!Component || Component._patched) return Component;
  
  try {
    // Store original render method
    const originalRender = Component.render;
    
    if (typeof originalRender !== 'function') {
      console.log(`[Patch] ${componentName} doesn't have a render method to patch`);
      return Component;
    }
    
    // Replace with patched version
    Component.render = function(...args) {
      try {
        // Fix the props before rendering
        if (args.length > 0 && args[0]) {
          args[0] = fixComponentProps(args[0]);
        }
        
        // Call the original render method
        return originalRender.apply(this, args);
      } catch (error) {
        console.error(`[Patch] Error in ${componentName} patch:`, error);
        // Fall back to the original render method in case of errors
        return originalRender.apply(this, args);
      }
    };
    
    Component._patched = true;
    console.log(`[Patch] ${componentName} successfully patched`);
  } catch (error) {
    console.error(`[Patch] Failed to patch ${componentName}:`, error);
  }
  
  return Component;
};

/**
 * Patch the Animated component creator to handle dynamic components
 */
const patchAnimatedComponentCreator = () => {
  if (!Animated || !Animated.createAnimatedComponent || Animated._patchedCreateAnimated) return;
  
  try {
    const originalCreateAnimatedComponent = Animated.createAnimatedComponent;
    
    Animated.createAnimatedComponent = function(component) {
      // Get the animated component from the original function
      const AnimatedComponent = originalCreateAnimatedComponent(component);
      
      // Patch the animated component
      return patchComponent(AnimatedComponent, 'AnimatedComponent');
    };
    
    Animated._patchedCreateAnimated = true;
    console.log('[Patch] Animated.createAnimatedComponent patched successfully');
  } catch (error) {
    console.error('[Patch] Failed to patch Animated.createAnimatedComponent:', error);
  }
};

/**
 * Main function to apply all patches
 */
export const applyAllPatches = () => {
  // 1. Patch ActivityIndicator
  patchComponent(ActivityIndicator, 'ActivityIndicator');
  
  // 2. Patch DateTimePicker if available
  if (DateTimePicker) {
    patchComponent(DateTimePicker, 'DateTimePicker');
  }
  
  // 3. Patch Animated.createAnimatedComponent
  patchAnimatedComponentCreator();
  
  console.log('[Patch] All global patches applied successfully');
};

/**
 * Create a custom ActivityIndicator component that safely handles string sizes
 */
export const createCustomActivityIndicator = () => {
  // This is an alternative approach if the patching doesn't work
  return (props) => {
    const { size, style, ...otherProps } = props;
    
    // Convert string sizes to numbers
    let numericSize = size;
    if (typeof size === 'string') {
      if (size === 'large') {
        numericSize = 36;
      } else if (size === 'small') {
        numericSize = 18;
      }
    }
    
    // Process style to ensure any size properties are numbers
    const processedStyle = processStyleObject(style);
    
    return (
      <ActivityIndicator 
        {...otherProps} 
        size={numericSize} 
        style={processedStyle} 
      />
    );
  };
};

export default applyAllPatches;
