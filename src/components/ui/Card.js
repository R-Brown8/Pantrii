/**
 * Card Component
 * 
 * Reusable card container with consistent styling.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';

const Card = ({ 
  children, 
  style, 
  onPress, 
  elevation = 1,
  borderLeft = false,
  borderColor,
  padded = true 
}) => {
  // Determine if the card is interactive
  const isInteractive = !!onPress;
  
  // Base styles for the card
  const cardStyles = [
    styles.card,
    padded && styles.padded,
    elevation > 0 && { 
      elevation, 
      shadowOpacity: 0.12 * elevation 
    },
    borderLeft && {
      borderLeftWidth: 4,
      borderLeftColor: borderColor || Colors.primary
    },
    style
  ];
  
  // Render as TouchableOpacity if onPress is provided
  if (isInteractive) {
    return (
      <TouchableOpacity 
        style={cardStyles} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  // Render as View if not interactive
  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  padded: {
    padding: 16,
  }
});

export default Card;
