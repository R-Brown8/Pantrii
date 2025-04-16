/**
 * Application color palette
 * 
 * This file defines the color scheme used throughout the app.
 * Using a centralized color system helps maintain visual consistency.
 */

const Colors = {
  // Primary brand colors
  primary: '#5E72E4',      // Main brand color
  secondary: '#6EC1E4',    // Secondary accent color
  accent: '#FFC857',       // Highlight color
  
  // Status colors
  success: '#2DCE89',      // Success/confirmation
  warning: '#FB6340',      // Warning/caution
  error: '#F5365C',        // Error/danger
  danger: '#F5365C',       // Alias for error
  
  // UI Background colors
  background: '#F7FAFC',   // Main background
  card: '#FFFFFF',         // Card/element backgrounds
  input: '#F4F5F7',        // Input field backgrounds
  overlay: 'rgba(0, 0, 0, 0.3)', // Modal overlays
  
  // Border colors
  border: '#E6E8EB',       // Standard borders
  divider: '#E9ECEF',      // Divider lines
  
  // Text colors
  textPrimary: '#2D3748',  // Primary text
  textSecondary: '#718096', // Secondary/helper text
  textTertiary: '#A0AEC0',  // Less important text
  textLight: '#FFFFFF',    // Text on dark backgrounds
  
  // Grayscale
  gray100: '#F7FAFC',
  gray200: '#EDF2F7',
  gray300: '#E2E8F0',
  gray400: '#CBD5E0',
  gray500: '#A0AEC0',
  gray600: '#718096',
  gray700: '#4A5568',
  gray800: '#2D3748',
  gray900: '#1A202C',
};

export default Colors;
