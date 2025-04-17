/**
 * Pantry Filter Toggle Component
 * 
 * A toggle switch component that filters meal plans based on pantry availability.
 * Used in the Meal Plan screen to show only recipes that can be made with current pantry items.
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Colors from '../../../constants/colors';

const PantryFilterToggle = ({ value, onChange, style }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        style,
        value ? { backgroundColor: colors.primary + '15' } : { backgroundColor: colors.card }
      ]}
      onPress={() => onChange(!value)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <Ionicons 
          name="basket-outline" 
          size={18} 
          color={value ? colors.primary : colors.text} 
        />
        <Text 
          style={[
            styles.text, 
            { color: value ? colors.primary : colors.text }
          ]}
        >
          Show pantry-ready meals only
        </Text>
      </View>
      
      <View 
        style={[
          styles.toggleSwitch, 
          value 
            ? { backgroundColor: colors.primary } 
            : { backgroundColor: colors.border }
        ]}
      >
        <View 
          style={[
            styles.toggleKnob, 
            value 
              ? { right: 2, left: null } 
              : { left: 2, right: null },
            { backgroundColor: colors.card }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  toggleSwitch: {
    width: 36,
    height: 20,
    borderRadius: 10,
    position: 'relative',
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    top: 2,
  },
});

export default PantryFilterToggle;
