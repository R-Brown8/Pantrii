/**
 * Component Helpers for FlavorMind MVP 3
 * 
 * Utility functions to help with component rendering
 */

/**
 * Safely converts string size values to numbers
 * Use this for any component props that need numeric sizes
 * 
 * Example usage:
 * <Component size={normalizeSize('large')} />
 * 
 * @param {string|number} size - The size value to normalize
 * @returns {number} - The normalized numeric size
 */
export const normalizeSize = (size) => {
  if (typeof size === 'string') {
    switch (size.toLowerCase()) {
      case 'large':
        return 36;
      case 'medium':
        return 24;
      case 'small':
        return 18;
      case 'tiny':
        return 12;
      default:
        // Try parsing the string as a number
        const parsed = parseFloat(size);
        return isNaN(parsed) ? 24 : parsed; // Default to medium size if parsing fails
    }
  }
  return size;
};

/**
 * Helper to safely apply style props that require numeric values
 * Use this for wrapping components that might receive string values for numeric props
 * 
 * @param {Object} props - Component props
 * @param {Array} numericProps - List of prop names that should be numeric
 * @returns {Object} - Props with numeric values
 */
export const ensureNumericProps = (props, numericProps = ['size', 'width', 'height']) => {
  const result = { ...props };
  
  numericProps.forEach(propName => {
    if (result[propName] !== undefined) {
      result[propName] = normalizeSize(result[propName]);
    }
  });
  
  return result;
};
