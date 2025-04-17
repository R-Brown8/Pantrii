/**
 * Recipe Detail Screen
 *
 * This screen displays detailed information about a recipe,
 * including ingredients, instructions, and pantry status.
 */

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PantryStatusView from '../components/meal/PantryStatusView';
import AppContext from '../context/AppContext';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe: initialRecipe } = route.params;
  // Use customized recipe if available, otherwise use the initial recipe
  const recipe = customizedRecipe || initialRecipe;
  const { colors } = useTheme();
  const { addMealPlan } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients', 'instructions', 'nutrition'
  const [customizing, setCustomizing] = useState(false); // Added for MVP 5.5.2
  const [customizedRecipe, setCustomizedRecipe] = useState(null); // Store customized recipe

  // Function to handle customization save
  const handleSaveCustomization = (customizedData) => {
    // Create a new recipe object with customized data
    const updatedRecipe = {
      ...recipe,
      ...customizedData,
      // Keep existing match data
      matchPercentage: recipe.matchPercentage,
      availableIngredients: recipe.availableIngredients,
      missingIngredients: recipe.missingIngredients,
      canMake: recipe.canMake
    };

    setCustomizedRecipe(updatedRecipe);
    setCustomizing(false);

    // Show success message
    alert('Recipe customized successfully!');
  };

  // Function to add recipe to meal plan
  const handleAddToMealPlan = async () => {
    const mealPlan = {
      id: Date.now().toString(),
      recipeId: recipe.id,
      recipeName: recipe.title,
      date: new Date().toISOString().split('T')[0], // Today
      servings: recipe.servings,
      notes: ''
    };

    const success = await addMealPlan(mealPlan);

    if (success) {
      // Show success message
      alert('Added to meal plan!');
    } else {
      // Show error message
      alert('Failed to add to meal plan. Please try again.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Recipe image placeholder */}
      <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="restaurant-outline" size={80} color={colors.primary} />
      </View>

      {/* Recipe basic info */}
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {recipe.description}
        </Text>

        {/* Recipe details row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color={colors.text} />
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Prep Time</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{recipe.prepTime} min</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="flame-outline" size={20} color={colors.text} />
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Cook Time</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{recipe.cookTime} min</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={20} color={colors.text} />
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Servings</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{recipe.servings}</Text>
            </View>
          </View>
        </View>

        {/* Match percentage indicator */}
        {recipe.matchPercentage !== undefined && (
          <View style={[styles.matchContainer, { backgroundColor: colors.primary + '10' }]}>
            <Text style={[styles.matchLabel, { color: colors.primary }]}>
              Pantry Match
            </Text>
            <Text style={[styles.matchValue, { color: colors.primary }]}>
              {recipe.matchPercentage}%
            </Text>
            {recipe.canMake && (
              <View style={styles.readyBadge}>
                <Ionicons name="checkmark-circle" size={16} color="white" />
                <Text style={styles.readyText}>Ready to cook</Text>
              </View>
            )}
          </View>
        )}

        {/* Tab navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'ingredients' && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ingredients' && [styles.activeTabText, { color: colors.primary }]
              ]}
            >
              Ingredients
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'instructions' && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('instructions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'instructions' && [styles.activeTabText, { color: colors.primary }]
              ]}
            >
              Instructions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'nutrition' && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'nutrition' && [styles.activeTabText, { color: colors.primary }]
              ]}
            >
              Nutrition
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab content */}
        <View style={styles.tabContent}>
          {/* Ingredients tab */}
          {activeTab === 'ingredients' && (
            <View>
              <PantryStatusView
                availableIngredients={recipe.availableIngredients || []}
                missingIngredients={recipe.missingIngredients || []}
              />
            </View>
          )}

          {/* Instructions tab */}
          {activeTab === 'instructions' && (
            <View>
              {recipe.instructions && recipe.instructions.map((step, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.instructionText, { color: colors.text }]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Nutrition tab - placeholder for now */}
          {activeTab === 'nutrition' && (
            <View style={styles.placeholderContainer}>
              <Ionicons name="nutrition-outline" size={48} color={colors.text} />
              <Text style={[styles.placeholderText, { color: colors.text }]}>
                Nutrition information not available yet.
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleAddToMealPlan}
          >
            <Ionicons name="calendar-outline" size={20} color="white" />
            <Text style={styles.actionButtonText}>Add to Meal Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.primary }]}
              onPress={() => setCustomizing(true)}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Customize</Text>
            </TouchableOpacity>
          </View>

          {/* Recipe Customizer Modal */}
          {customizing && (
            <Modal
              visible={customizing}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setCustomizing(false)}
            >
              <View style={styles.customizeModalOverlay}>
                <View style={[styles.customizeModalContainer, { backgroundColor: colors.card }]}>
                  <View style={styles.customizeModalHeader}>
                    <Text style={[styles.customizeModalTitle, { color: colors.text }]}>Customize Recipe</Text>
                    <TouchableOpacity onPress={() => setCustomizing(false)}>
                      <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  {/* Simple customization form */}
                  <ScrollView style={styles.customizeFormContainer}>
                    <View style={styles.customizeFormGroup}>
                      <Text style={[styles.customizeLabel, { color: colors.text }]}>Recipe Name</Text>
                      <TextInput
                        style={[styles.customizeInput, {
                          color: colors.text,
                          backgroundColor: colors.background,
                          borderColor: colors.border
                        }]}
                        value={recipe.title}
                        onChangeText={(text) => {
                          // Create a temporary recipe object for user input
                          setCustomizedRecipe(prev => ({ ...(prev || recipe), title: text }));
                        }}
                        placeholder="Recipe name"
                        placeholderTextColor={colors.text + '80'}
                      />
                    </View>

                    <View style={styles.customizeFormGroup}>
                      <Text style={[styles.customizeLabel, { color: colors.text }]}>Description</Text>
                      <TextInput
                        style={[styles.customizeInput, styles.customizeTextarea, {
                          color: colors.text,
                          backgroundColor: colors.background,
                          borderColor: colors.border
                        }]}
                        value={recipe.description}
                        onChangeText={(text) => {
                          setCustomizedRecipe(prev => ({ ...(prev || recipe), description: text }));
                        }}
                        placeholder="Recipe description"
                        placeholderTextColor={colors.text + '80'}
                        multiline
                        numberOfLines={4}
                      />
                    </View>

                    <View style={styles.customizeRowFormGroup}>
                      <View style={[styles.customizeFormGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={[styles.customizeLabel, { color: colors.text }]}>Prep Time (min)</Text>
                        <TextInput
                          style={[styles.customizeInput, {
                            color: colors.text,
                            backgroundColor: colors.background,
                            borderColor: colors.border
                          }]}
                          value={String(recipe.prepTime)}
                          onChangeText={(text) => {
                            const prepTime = parseInt(text) || 0;
                            setCustomizedRecipe(prev => ({ ...(prev || recipe), prepTime }));
                          }}
                          placeholder="Prep time"
                          placeholderTextColor={colors.text + '80'}
                          keyboardType="number-pad"
                        />
                      </View>

                      <View style={[styles.customizeFormGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={[styles.customizeLabel, { color: colors.text }]}>Cook Time (min)</Text>
                        <TextInput
                          style={[styles.customizeInput, {
                            color: colors.text,
                            backgroundColor: colors.background,
                            borderColor: colors.border
                          }]}
                          value={String(recipe.cookTime)}
                          onChangeText={(text) => {
                            const cookTime = parseInt(text) || 0;
                            setCustomizedRecipe(prev => ({ ...(prev || recipe), cookTime }));
                          }}
                          placeholder="Cook time"
                          placeholderTextColor={colors.text + '80'}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>

                    <View style={styles.customizeFormGroup}>
                      <Text style={[styles.customizeLabel, { color: colors.text }]}>Servings</Text>
                      <TextInput
                        style={[styles.customizeInput, {
                          color: colors.text,
                          backgroundColor: colors.background,
                          borderColor: colors.border
                        }]}
                        value={String(recipe.servings)}
                        onChangeText={(text) => {
                          const servings = parseInt(text) || 1;
                          setCustomizedRecipe(prev => ({ ...(prev || recipe), servings }));
                        }}
                        placeholder="Number of servings"
                        placeholderTextColor={colors.text + '80'}
                        keyboardType="number-pad"
                      />
                    </View>

                    {/* Custom notes field */}
                    <View style={styles.customizeFormGroup}>
                      <Text style={[styles.customizeLabel, { color: colors.text }]}>Your Notes</Text>
                      <TextInput
                        style={[styles.customizeInput, styles.customizeTextarea, {
                          color: colors.text,
                          backgroundColor: colors.background,
                          borderColor: colors.border
                        }]}
                        value={recipe.customNotes || ''}
                        onChangeText={(text) => {
                          setCustomizedRecipe(prev => ({ ...(prev || recipe), customNotes: text }));
                        }}
                        placeholder="Add your custom notes about this recipe"
                        placeholderTextColor={colors.text + '80'}
                        multiline
                        numberOfLines={4}
                      />
                    </View>
                  </ScrollView>

                  <View style={styles.customizeButtonContainer}>
                    <TouchableOpacity
                      style={[styles.customizeCancelButton, { borderColor: colors.border }]}
                      onPress={() => {
                        setCustomizing(false);
                        // Reset any temporary changes if canceled
                        if (!customizedRecipe) {
                          setCustomizedRecipe(null);
                        }
                      }}
                    >
                      <Text style={[styles.customizeCancelButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.customizeSaveButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleSaveCustomization(customizedRecipe || recipe)}
                    >
                      <Text style={styles.customizeSaveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              </Modal>
          )}
        </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTextContainer: {
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  matchLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  matchValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  readyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    fontWeight: '500',
  },
  tabContent: {
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 24,
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },

  // Customization modal styles
  customizeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  customizeModalContainer: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  customizeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  customizeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customizeFormContainer: {
    maxHeight: 450,
  },
  customizeFormGroup: {
    marginBottom: 16,
  },
  customizeRowFormGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  customizeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  customizeInput: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  customizeTextarea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  customizeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  customizeCancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  customizeCancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  customizeSaveButton: {
    flex: 2,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  customizeSaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RecipeDetailScreen;
