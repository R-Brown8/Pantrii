/**
 * ActivityIndicator Component
 * 
 * A wrapper around React Native's ActivityIndicator that safely
 * converts string size values to numbers to avoid the
 * "Unable to convert string to floating point value: 'large'" error.
 */

import React from 'react';
import { ActivityIndicator as RNActivityIndicator, StyleSheet } from 'react-native';

/**
 * Process style objects to convert string sizes to numeric values
 */
const processStyleObject = (style) => {
  if (!style || typeof style !== 'object') return style;
  
  // Handle array of styles
  if (Array.isArray(style)) {
    return style.map(processStyleObject);
  }
  
  // Create a new style object to avoid mutations
  const result = { ...style };
  
  // Convert size property specifically
  if (typeof result.size === 'string') {
    if (result.size === 'large') {
      result.size = 36;
    } else if (result.size === 'small') {
      result.size = 18;
    }
  }
  
  return result;
};

const ActivityIndicator = (props) => {
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
    <RNActivityIndicator 
      {...otherProps} 
      size={numericSize} 
      style={processedStyle} 
    />
  );
};

export default ActivityIndicator;
