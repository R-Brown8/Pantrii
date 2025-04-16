/**
 * FlavorTag Component
 * 
 * Displays flavor preferences as interactive tags.
 * Used in FlavorProfileScreen and MealLogging.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

const FlavorTag = ({ 
  flavor, 
  liked = false, 
  disliked = false, 
  onPress, 
  disabled = false,
  mini = false
}) => {
  // Determine the appropriate style based on flavor preference
  const getTagStyle = () => {
    if (liked) return styles.likedTag;
    if (disliked) return styles.dislikedTag;
    return styles.neutralTag;
  };

  // Determine appropriate text style
  const getTextStyle = () => {
    if (liked) return styles.likedText;
    if (disliked) return styles.dislikedText;
    return styles.neutralText;
  };

  // Determine appropriate icon
  const getIconName = () => {
    if (liked) return 'thumbs-up';
    if (disliked) return 'thumbs-down';
    return null;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        getTagStyle(),
        mini && styles.miniContainer,
        disabled && styles.disabledContainer
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text, 
        getTextStyle(),
        mini && styles.miniText
      ]}>
        {flavor.name}
      </Text>
      
      {getIconName() && !mini && (
        <Ionicons 
          name={getIconName()} 
          size={16} 
          color={liked ? Colors.success : disliked ? Colors.error : Colors.textPrimary} 
          style={styles.icon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  miniContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  neutralTag: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  likedTag: {
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  dislikedTag: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  miniText: {
    fontSize: 12,
  },
  neutralText: {
    color: Colors.textPrimary,
  },
  likedText: {
    color: Colors.success,
  },
  dislikedText: {
    color: Colors.error,
  },
  icon: {
    marginLeft: 4,
  },
});

export default FlavorTag;