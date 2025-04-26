/**
 * Meal Plan Form Component
 * 
 * This component provides a form for adding new meals to the weekly meal plan.
 * It allows users to:
 * - Select a meal from their meal history
 * - Enter a new custom meal
 * - Specify ingredients for the meal
 * 
 * The form is displayed in a modal and is accessed from the WeeklyPlanner.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/colors';
import Config from '../../../constants/config';
import FlavorTag from '../../flavor/FlavorTag';

const MealPlanForm = ({
  visible,
  onClose,
  onSave,
  selectedDay,
  recentMeals,
}) => {
  // Form state
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [useCustomMeal, setUseCustomMeal] = useState(true);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Reset the form when the modal becomes visible
  useEffect(() => {
    if (visible) {
      setMealName('');
      setIngredients('');
      setInstructions('');
      setImageUrl('');
      setUseCustomMeal(true);
      setSelectedMealId(null);
      setSelectedFlavors([]);
    }
  }, [visible]);

  // Select a meal from history
  const handleSelectMeal = (meal) => {
    setSelectedMealId(meal.id);
    setMealName(meal.name);
    setIngredients(meal.ingredients.join(', '));
    setUseCustomMeal(false);
    // Set flavor tags if present in the meal (MVP 4)
    if (meal.flavors && meal.flavors.length > 0) {
      setSelectedFlavors(meal.flavors);
    } else {
      setSelectedFlavors([]);
    }
  };

  // Switch to custom meal entry
  const handleUseCustomMeal = () => {
    setSelectedMealId(null);
    setMealName('');
    setIngredients('');
    setUseCustomMeal(true);
  };

  // Save the meal plan
  const handleSave = () => {
    if (!mealName.trim()) {
      alert('Please enter a meal name');
      return;
    }

    const ingredientsArray = ingredients
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (ingredientsArray.length === 0) {
      alert('Please enter at least one ingredient');
      return;
    }

    onSave({
      day: selectedDay,
      meal: mealName,
      ingredients: ingredientsArray,
      flavors: selectedFlavors,
      recipe: {
        name: mealName,
        title: mealName,
        ingredients: ingredientsArray,
        instructions: instructions,
        imageUrl: imageUrl,
        flavors: selectedFlavors,
      },
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Meal for {selectedDay}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Tabs to toggle between recent meals and custom meal */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, useCustomMeal ? {} : styles.activeTab]}
                onPress={() => setUseCustomMeal(false)}
              >
                <Text
                  style={[
                    styles.tabText,
                    useCustomMeal ? {} : styles.activeTabText,
                  ]}
                >
                  Recent Meals
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, useCustomMeal ? styles.activeTab : {}]}
                onPress={handleUseCustomMeal}
              >
                <Text
                  style={[
                    styles.tabText,
                    useCustomMeal ? styles.activeTabText : {},
                  ]}
                >
                  Custom Meal
                </Text>
              </TouchableOpacity>
            </View>

            {/* Recent meals list */}
            {!useCustomMeal && (
              <View style={styles.recentMealsContainer}>
                {recentMeals.length > 0 ? (
                  recentMeals.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      style={[
                        styles.mealOption,
                        selectedMealId === meal.id && styles.selectedMealOption,
                      ]}
                      onPress={() => handleSelectMeal(meal)}
                    >
                      <Text style={styles.mealOptionName}>{meal.name}</Text>
                      <Text style={styles.mealOptionIngredients}>
                        {meal.ingredients.join(', ')}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    No recent meals. Try logging some meals first!
                  </Text>
                )}
              </View>
            )}

            {/* Custom meal form */}
            {useCustomMeal && (
              <View style={styles.formContainer}>
                <Text style={styles.label}>Meal Name:</Text>
                <TextInput
                  style={styles.input}
                  value={mealName}
                  onChangeText={setMealName}
                  placeholder="Enter meal name"
                  placeholderTextColor={Colors.textTertiary}
                />

                <Text style={styles.label}>Ingredients:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={ingredients}
                  onChangeText={setIngredients}
                  placeholder="Enter ingredients, separated by commas"
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  numberOfLines={4}
                />
                
                {/* Instructions Field */}
                <Text style={styles.label}>Instructions:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder="Enter cooking instructions"
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  numberOfLines={4}
                />

                {/* Image URL Field */}
                <Text style={styles.label}>Image URL:</Text>
                <TextInput
                  style={styles.input}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="Paste an image URL (optional)"
                  placeholderTextColor={Colors.textTertiary}
                />

                {/* Flavor Tags Section (MVP 4) */}
                <Text style={styles.label}>Flavors:</Text>
                <Text style={styles.sublabel}>Select flavors that describe this meal:</Text>
                
                <View style={styles.flavorTagsContainer}>
                  {Config.flavors.categories.map((flavor) => (
                    <FlavorTag 
                      key={flavor.id}
                      flavor={flavor}
                      liked={selectedFlavors.includes(flavor.id)}
                      onPress={() => {
                        if (selectedFlavors.includes(flavor.id)) {
                          setSelectedFlavors(selectedFlavors.filter(id => id !== flavor.id));
                        } else {
                          setSelectedFlavors([...selectedFlavors, flavor.id]);
                        }
                      }}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Add to Plan</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  recentMealsContainer: {
    paddingHorizontal: 16,
  },
  mealOption: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedMealOption: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  mealOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealOptionIngredients: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.input,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  saveButtonText: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: Colors.textSecondary,
  },
  flavorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
  },
  sublabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
});

export default MealPlanForm;