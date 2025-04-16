/**
 * Button Component
 * 
 * Reusable button component with configurable appearance.
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'medium',
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  style,
  textStyle
}) => {
  // Determine button styles based on props
  const buttonStyles = [
    styles.button,
    styles[`${type}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style
  ];
  
  // Determine text styles based on props
  const textStyles = [
    styles.text,
    styles[`${type}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={type === 'outline' ? Colors.primary : Colors.textLight} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={type === 'outline' ? Colors.primary : Colors.textLight}
              style={styles.leftIcon} 
            />
          )}
          
          <Text style={textStyles}>{title}</Text>
          
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={type === 'outline' ? Colors.primary : Colors.textLight}
              style={styles.rightIcon} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  
  // Button types
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  
  // Button sizes
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.textLight,
  },
  secondaryText: {
    color: Colors.textLight,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.textLight,
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Icon styles
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  
  // Disabled state
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
