/**
 * PantryItemForm Component
 * 
 * Form for adding or editing pantry items with validation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Button from '../ui/Button';
import DatePicker from '../ui/DatePicker';
import { getDefaultExpiryDate, getDaysRemaining } from '../../utils/dateUtils';
import { useAppContext } from '../../context/AppContext';
import { logUI, logDate, logLifecycle } from '../../utils/debug/logger';
import Config from '../../constants/config';

// Helper functions for checking expiry status
const isExpiredDate = (dateString) => {
  const today = new Date();
  const expiryDate = new Date(dateString);
  return expiryDate < today;
};

const isExpiringDate = (dateString) => {
  const days = getDaysRemaining(dateString);
  return days >= 0 && days <= Config.app.expiryWarningDays;
};

const PantryItemForm = ({ 
  initialValues = {}, 
  onSubmit, 
  onCancel 
}) => {
  // Get categories from context
  const { categories } = useAppContext();
  
  // Lifecycle logging
  useEffect(() => {
    logLifecycle(`PantryItemForm mounted ${initialValues.id ? 'for editing' : 'for adding new item'}`);
    if (initialValues.id) {
      logUI('Editing existing item', initialValues);
    }
    
    return () => {
      logLifecycle('PantryItemForm unmounted');
    };
  }, []);

  // Track expiry changes
  const prevExpiryRef = useRef(null);
  
  // Form state
  const [name, setName] = useState(initialValues.name || '');
  const [quantity, setQuantity] = useState(initialValues.quantity || '');
  const [expiry, setExpiry] = useState(() => {
    const expiryValue = initialValues.expiry || getDefaultExpiryDate();
    logDate('Initial expiry value set', { value: expiryValue });
    prevExpiryRef.current = expiryValue;
    return expiryValue;
  });
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || '');
  const [notes, setNotes] = useState(initialValues.notes || '');
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // References for scrolling
  const scrollViewRef = useRef(null);
  const notesInputRef = useRef(null);
  
  // Clear keyboard when component mounts
  useEffect(() => {
    Keyboard.dismiss();
  }, []);
  
  // Log when expiry date changes
  useEffect(() => {
    if (prevExpiryRef.current !== expiry) {
      logDate('Expiry date changed', { 
        from: prevExpiryRef.current, 
        to: expiry,
        difference: Math.round((new Date(expiry) - new Date(prevExpiryRef.current || new Date())) / (1000 * 60 * 60 * 24))
      });
      prevExpiryRef.current = expiry;
    }
  }, [expiry]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Name is required
    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    // Expiry date validation
    if (!expiry) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(expiry)) {
        newErrors.expiry = 'Invalid date format (YYYY-MM-DD)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    logUI('Attempting form submission', { name, expiry });
    if (!validateForm()) {
      logUI('Form validation failed', errors);
      return;
    }
    
    logUI('Form validation passed');
    
    setIsSubmitting(true);
    
    // Prepare item data
    const itemData = {
      id: initialValues.id || Date.now().toString(),
      name: name.trim(),
      quantity: quantity.trim(),
      expiry,
      categoryId,
      notes: notes.trim(),
    };
    
    // Log the item data being submitted
    logUI('Submitting item data', {
      item: itemData,
      isNew: !initialValues.id,
      expiryDate: new Date(expiry).toISOString(),
      isExpiringSoon: isExpiringDate(expiry),
      isExpired: isExpiredDate(expiry)
    });
    // Call onSubmit callback
    onSubmit(itemData);
    setIsSubmitting(false);
  };
  
  // Function to scroll to the notes input and ensure buttons are visible
  const scrollToNotes = () => {
    // Wait for the keyboard to appear and layout to adjust
    setTimeout(() => {
      // Scroll to the bottom to make sure action buttons are visible
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };
  
  return (
    <ScrollView 
      style={styles.container}
      ref={scrollViewRef}
      keyboardShouldPersistTaps="handled">
      {/* Item Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Apples, Chicken, Rice"
          returnKeyType="next"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      
      {/* Quantity */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="e.g., 2 lbs, 3 cups, 5 pieces"
          returnKeyType="next"
        />
      </View>
      
      {/* Expiry Date */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiry Date *</Text>
        <DatePicker
        value={expiry}
        onChange={(newDate) => {
          logDate('DatePicker onChange called', { newDate });
          setExpiry(newDate);
        }}
        error={errors.expiry}
          minimumDate={new Date().toISOString().split('T')[0]}
        />
      </View>
      
      {/* Category Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <Button
              key={category.id}
              title={category.name}
              icon={category.icon}
              type={categoryId === category.id ? 'primary' : 'outline'}
              size="small"
              onPress={() => setCategoryId(category.id)}
              style={styles.categoryButton}
            />
          ))}
        </View>
      </View>
      
      {/* Notes */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any details about this item"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          ref={notesInputRef}
          onFocus={scrollToNotes}
        />
      </View>
      
      {/* Form Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          type="outline"
          style={styles.cancelButton}
        />
        
        <Button
          title={initialValues.id ? "Update Item" : "Add Item"}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          icon={initialValues.id ? "save-outline" : "add-circle-outline"}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    minHeight: 100,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    margin: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
    marginLeft: 8,
  },
});

export default PantryItemForm;
