/**
 * Smart Recipe Button Component
 * 
 * This component displays a button to access the Smart Recipe feature.
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SmartRecipeButton = ({ onPress, style }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: colors.primary },
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={24} color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Smart Recipes</Text>
          <Text style={styles.subtitle}>Find recipes based on your pantry</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});

export default SmartRecipeButton;
