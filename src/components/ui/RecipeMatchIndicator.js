/**
 * Recipe Match Indicator Component
 * 
 * This component displays a visual indicator of how well a recipe
 * matches with the user's pantry ingredients.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecipeMatchIndicator = ({ percentage }) => {
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 75) return '#4CAF50'; // Green
    if (percentage >= 50) return '#FFC107'; // Yellow
    if (percentage >= 25) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };
  
  // Get label based on percentage
  const getLabel = () => {
    if (percentage >= 75) return 'Excellent match';
    if (percentage >= 50) return 'Good match';
    if (percentage >= 25) return 'Fair match';
    return 'Poor match';
  };
  
  // Background color with transparency
  const backgroundColor = getColor() + '20'; // Add 20% opacity
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Circle indicator */}
      <View style={[styles.circle, { borderColor: getColor() }]}>
        <Text style={[styles.percentage, { color: getColor() }]}>
          {percentage}%
        </Text>
      </View>
      
      {/* Label */}
      <Text style={[styles.label, { color: getColor() }]}>
        {getLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  percentage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default RecipeMatchIndicator;
