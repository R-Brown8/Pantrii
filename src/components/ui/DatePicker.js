/**
 * DatePicker Component
 * 
 * A cross-platform date picker component with consistent UI.
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Modal 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { formatDisplayDate } from '../../utils/dateUtils';

const DatePicker = ({ 
  value,
  onChange,
  label,
  placeholder = 'Select a date',
  error,
  minimumDate,
  maximumDate
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());
  
  // Handle date selection
  const handleChange = (event, selectedDate) => {
    // Hide the picker on Android after selection
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      
      // On Android, confirm immediately
      if (Platform.OS === 'android') {
        onChange(selectedDate.toISOString().split('T')[0]);
      }
    }
  };
  
  // Cancel selection (iOS only)
  const handleCancel = () => {
    setShowPicker(false);
  };
  
  // Confirm selection (iOS only)
  const handleConfirm = () => {
    onChange(tempDate.toISOString().split('T')[0]);
    setShowPicker(false);
  };
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={[
          styles.input, 
          error && styles.inputError
        ]} 
        onPress={() => setShowPicker(true)}
      >
        <Text 
          style={[
            styles.inputText,
            !value && styles.placeholder
          ]}
        >
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {/* Date picker for Android */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate && new Date(minimumDate)}
          maximumDate={maximumDate && new Date(maximumDate)}
        />
      )}
      
      {/* Modal picker for iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                style={styles.iOSPicker}
                minimumDate={minimumDate && new Date(minimumDate)}
                maximumDate={maximumDate && new Date(maximumDate)}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textTertiary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  doneText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  iOSPicker: {
    height: 200,
  },
});

export default DatePicker;
