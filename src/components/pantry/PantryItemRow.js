/**
 * PantryItemRow Component
 * 
 * Displays a single pantry item with expiration date indicators.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Card from '../ui/Card';
import { getExpiryStatus, formatDisplayDate } from '../../utils/dateUtils';

// Map status to colors
const STATUS_COLORS = {
  expired: Colors.error,
  expiring: Colors.warning,
  warning: Colors.warning,
  good: Colors.secondary,
};

const PantryItemRow = ({ 
  item, 
  onPress, 
  onEdit, 
  onDelete,
  showCategory = true
}) => {
  // Get expiry status info
  const expiryInfo = getExpiryStatus(item.expiry);
  
  // Generate border color based on status
  const borderColor = STATUS_COLORS[expiryInfo.status];
  
  return (
    <Card 
      onPress={onPress}
      borderLeft={true}
      borderColor={borderColor}
      padded={false}
      style={styles.card}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{item.name}</Text>
          
          <View style={styles.detailsContainer}>
            {item.quantity && (
              <View style={styles.quantityContainer}>
                <Text style={styles.quantity}>{item.quantity}</Text>
              </View>
            )}
            
            {showCategory && item.categoryId && (
              <View style={styles.categoryContainer}>
                <Ionicons 
                  name="pricetag-outline" 
                  size={14} 
                  color={Colors.textSecondary} 
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>
                  {item.categoryName || 'Uncategorized'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.expiryContainer}>
            <Ionicons 
              name="calendar-outline" 
              size={14} 
              color={borderColor} 
              style={styles.expiryIcon}
            />
            <Text 
              style={[
                styles.expiryText,
                { color: borderColor }
              ]}
            >
              {expiryInfo.label} ({formatDisplayDate(item.expiry)})
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity 
              onPress={onEdit}
              style={styles.actionButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              onPress={onDelete}
              style={styles.actionButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>
            {item.notes}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  quantityContainer: {
    backgroundColor: Colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryIcon: {
    marginRight: 4,
  },
  expiryText: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  notesContainer: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    marginTop: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default PantryItemRow;
