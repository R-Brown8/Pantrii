/**
 * Recipe Match Indicator Component
 * 
 * This component displays a visual indicator of how well a recipe
 * matches with the user's pantry ingredients.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  
  // Get icon based on percentage
  const getIcon = () => {
    if (percentage >= 75) return 'checkmark-circle';
    if (percentage >= 50) return 'thumbs-up';
    if (percentage >= 25) return 'alert-circle';
    return 'alert';
  };
  
  // Background color with transparency
  const backgroundColor = getColor() + '20'; // Add 20% opacity
  const color = getColor();
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Circle indicator */}
      <View style={[styles.circle, { borderColor: color }]}>
        <Text style={[styles.percentage, { color }]}>
          {Math.round(percentage)}%
        </Text>
      </View>
      
      {/* Label and icon */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color }]}>
          {getLabel()}
        </Text>
        <Ionicons name={getIcon()} size={14} color={color} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  icon: {
    marginLeft: 4,
  }
});

export default RecipeMatchIndicator;
