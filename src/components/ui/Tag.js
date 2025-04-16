/**
 * Tag Component
 * 
 * Reusable tag/chip component for displaying categories, 
 * status indicators, or labels.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

const Tag = ({ 
  label, 
  color = Colors.primary,
  textColor,
  icon,
  onPress,
  onRemove,
  small = false,
  style,
  textStyle
}) => {
  // Determine if the tag is interactive
  const isInteractive = !!onPress;
  
  // Calculate background color with reduced opacity
  const backgroundColor = color + '20'; // 20 = 12% opacity in hex
  
  // Determine text color if not explicitly provided
  const finalTextColor = textColor || color;
  
  // Determine container styles
  const containerStyles = [
    styles.container,
    small && styles.smallContainer,
    { backgroundColor },
    isInteractive && styles.interactive,
    style
  ];
  
  // Determine text styles
  const labelStyles = [
    styles.label,
    small && styles.smallLabel,
    { color: finalTextColor },
    textStyle
  ];
  
  // Render tag content
  const renderContent = () => (
    <>
      {icon && (
        <Ionicons 
          name={icon} 
          size={small ? 12 : 16} 
          color={finalTextColor} 
          style={styles.icon} 
        />
      )}
      
      <Text style={labelStyles} numberOfLines={1}>
        {label}
      </Text>
      
      {onRemove && (
        <TouchableOpacity 
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons 
            name="close-circle" 
            size={small ? 14 : 18} 
            color={finalTextColor} 
          />
        </TouchableOpacity>
      )}
    </>
  );
  
  // Render as TouchableOpacity if onPress is provided
  if (isInteractive) {
    return (
      <TouchableOpacity 
        style={containerStyles} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }
  
  // Render as View if not interactive
  return (
    <View style={containerStyles}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  smallContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  interactive: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  smallLabel: {
    fontSize: 12,
  },
  icon: {
    marginRight: 6,
  },
  removeButton: {
    marginLeft: 6,
  }
});

export default Tag;
