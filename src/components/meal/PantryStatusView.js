/**
 * Pantry Status View Component
 * 
 * This component displays the status of ingredients for a recipe,
 * showing which are available in the pantry and which are missing.
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PantryStatusView = ({ 
  availableIngredients = [], 
  missingIngredients = [],
  onAddToGrocery
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Available ingredients section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            In Your Pantry ({availableIngredients.length})
          </Text>
        </View>
        
        {availableIngredients.length > 0 ? (
          availableIngredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={[styles.ingredientText, { color: colors.text }]}>
                {ingredient.amount} {ingredient.name}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.text }]}>
            None of the ingredients are in your pantry.
          </Text>
        )}
      </View>
      
      {/* Missing ingredients section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="add-circle-outline" size={20} color="#FF5722" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Missing Ingredients ({missingIngredients.length})
          </Text>
          
          {/* Add to grocery button */}
          {missingIngredients.length > 0 && onAddToGrocery && (
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => onAddToGrocery(missingIngredients)}
            >
              <Text style={styles.addButtonText}>Add All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {missingIngredients.length > 0 ? (
          missingIngredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={[styles.missingDot, { borderColor: colors.border }]} />
              <Text style={[styles.ingredientText, { color: colors.text }]}>
                {ingredient.amount} {ingredient.name}
              </Text>
              
              {/* Individual add button */}
              {onAddToGrocery && (
                <TouchableOpacity 
                  style={styles.addSingleButton}
                  onPress={() => onAddToGrocery([ingredient])}
                >
                  <Ionicons name="add" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.text }]}>
            You have all the ingredients for this recipe!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  ingredientText: {
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
  },
  missingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyText: {
    fontStyle: 'italic',
    opacity: 0.7,
    marginLeft: 24,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  addSingleButton: {
    padding: 4,
  },
});

export default PantryStatusView;
