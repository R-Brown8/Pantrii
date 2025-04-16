/**
 * Meal Plan Screen
 * 
 * This screen allows users to view and manage their weekly meal plan.
 * Implements MVP 3 functionality:
 * - Display weekly meal plan in a calendar format
 * - Allow users to assign meals to specific days
 * - Generate new meal suggestions based on pantry and preferences
 * - Add, remove, and manage planned meals
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import WeeklyPlanner from '../components/meal/planner/WeeklyPlanner';
import MealPlanForm from '../components/meal/planner/MealPlanForm';

const MealPlanScreen = () => {
  // Access global state
  const { 
    meals, 
    mealPlans, 
    pantryItems, 
    isLoading, 
    addMealPlan,
    removeMealPlan,
    flavorProfile // Added for MVP 4
  } = useAppContext();
  
  // Local state
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  /**
   * Generate a new meal plan based on pantry items
   */
  const handleGeneratePlan = () => {
    setGeneratingPlan(true);
    
    // In a real app, this would call an API or use AI
    // For MVP 3, we'll generate some basic suggestions based on pantry
    setTimeout(() => {
      try {
        // Get available ingredients from pantry
        const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
        
        // Get user's flavor preferences (MVP 4)
        const likedFlavors = flavorProfile.likes;
        const dislikedFlavors = flavorProfile.dislikes;
        
        // Simple meal suggestions based on ingredients and flavor preferences
        let mealSuggestions = [
          {
            day: 'Monday',
            meal: 'Pasta with Tomato Sauce',
            ingredients: ['pasta', 'tomatoes', 'garlic', 'olive oil']
          },
          {
            day: 'Tuesday',
            meal: 'Vegetable Stir Fry',
            ingredients: ['rice', 'mixed vegetables', 'soy sauce']
          },
          {
            day: 'Wednesday',
            meal: 'Chicken Salad',
            ingredients: ['chicken breast', 'lettuce', 'tomatoes', 'cucumber']
          },
          {
            day: 'Thursday',
            meal: 'Bean Tacos',
            ingredients: ['tortillas', 'beans', 'cheese', 'salsa']
          },
          {
            day: 'Friday',
            meal: 'Grilled Fish',
            ingredients: ['fish', 'lemon', 'herbs', 'potatoes']
          },
          {
            day: 'Saturday',
            meal: 'Pizza Night',
            ingredients: ['pizza dough', 'cheese', 'tomato sauce', 'toppings']
          },
          {
            day: 'Sunday',
            meal: 'Roast Chicken',
            ingredients: ['chicken', 'potatoes', 'carrots', 'onions']
          }
        ];
        
        // Apply flavor preferences to meal suggestions (MVP 4)
        if (likedFlavors.length > 0 || dislikedFlavors.length > 0) {
          // Define flavor profiles for meals (in a real app, this would come from a database)
          const mealFlavorProfiles = {
            'Pasta with Tomato Sauce': ['umami', 'aromatic', 'sour'],
            'Vegetable Stir Fry': ['umami', 'salty', 'aromatic'],
            'Chicken Salad': ['creamy', 'tangy', 'salty'],
            'Bean Tacos': ['spicy', 'creamy', 'umami'],
            'Grilled Fish': ['aromatic', 'smoky', 'salty'],
            'Pizza Night': ['umami', 'creamy', 'aromatic'],
            'Roast Chicken': ['smoky', 'aromatic', 'umami']
          };
          
          // Prioritize meals matching liked flavors
          mealSuggestions = mealSuggestions.map(meal => {
            const mealFlavors = mealFlavorProfiles[meal.meal] || [];
            
            // Calculate a preference score
            let preferenceScore = 0;
            
            // Add points for liked flavors
            mealFlavors.forEach(flavor => {
              if (likedFlavors.includes(flavor)) {
                preferenceScore += 2;
              }
            });
            
            // Subtract points for disliked flavors
            mealFlavors.forEach(flavor => {
              if (dislikedFlavors.includes(flavor)) {
                preferenceScore -= 3;
              }
            });
            
            // Return meal with preference score and flavor profile
            return {
              ...meal,
              preferenceScore,
              flavorProfile: mealFlavors
            };
          });
          
          // Sort by preference score (highest first)
          mealSuggestions.sort((a, b) => b.preferenceScore - a.preferenceScore);
        }
        
        // Add each suggestion to the meal plan
        mealSuggestions.forEach(suggestion => {
          // Extract just the needed properties for the meal plan
          const { day, meal, ingredients } = suggestion;
          addMealPlan({ day, meal, ingredients });
        });
        
        alert('Meal plan generated successfully!');
      } catch (error) {
        console.error('Error generating meal plan:', error);
        alert('Failed to generate meal plan. Please try again.');
      } finally {
        setGeneratingPlan(false);
      }
    }, 1500); // Simulate API delay
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Planner</Text>
          <Text style={styles.subtitle}>
            Plan your meals for the week ahead
          </Text>
        </View>
        
        {/* Generate plan button */}
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={handleGeneratePlan}
          disabled={generatingPlan}
        >
          {generatingPlan ? (
            <ActivityIndicator size={24} color={Colors.textLight} />
          ) : (
            <>
              <Ionicons 
                name="nutrition" 
                size={22} 
                color={Colors.textLight} 
                style={styles.buttonIcon} 
              />
              <Text style={styles.generateButtonText}>
                Generate Meal Plan
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        {/* Weekly meal planner view */}
        <View style={styles.plannerSection}>
          <Text style={styles.sectionTitle}>Weekly Plan</Text>
          {isLoading ? (
            <ActivityIndicator size={36} color={Colors.primary} style={styles.loader} />
          ) : (
            <WeeklyPlanner 
              mealPlans={mealPlans}
              onAddMeal={(day) => {
                setSelectedDay(day);
                setShowAddMealModal(true);
              }}
              onRemoveMeal={(id) => removeMealPlan(id)}
            />
          )}
        </View>
        
        {/* How it works section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.infoItem}>
            <Ionicons 
              name="calendar-outline" 
              size={24} 
              color={Colors.primary} 
              style={styles.infoIcon} 
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Plan Your Week</Text>
              <Text style={styles.infoText}>
                Organize meals by day to streamline cooking and shopping
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons 
              name="basket-outline" 
              size={24} 
              color={Colors.primary} 
              style={styles.infoIcon} 
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Use Your Pantry</Text>
              <Text style={styles.infoText}>
                Suggestions based on ingredients you already have
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons 
              name="restaurant-outline" 
              size={24} 
              color={Colors.primary} 
              style={styles.infoIcon} 
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Reduce Food Waste</Text>
              <Text style={styles.infoText}>
                Use expiring items first to minimize waste
              </Text>
            </View>
          </View>
          
          {/* New info item for MVP 4 */}
          <View style={styles.infoItem}>
            <Ionicons 
              name="flame-outline" 
              size={24} 
              color={Colors.primary} 
              style={styles.infoIcon} 
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Flavor Preferences</Text>
              <Text style={styles.infoText}>
                Meal suggestions now consider your flavor profile preferences
              </Text>
            </View>
          </View>
        </View>
        
        {/* Manual add meal button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setSelectedDay('Monday');
            setShowAddMealModal(true);
          }}
        >
          <Ionicons 
            name="add-circle" 
            size={22} 
            color={Colors.textLight} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.addButtonText}>
            Add Custom Meal
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Meal plan form modal */}
      <MealPlanForm 
        visible={showAddMealModal}
        onClose={() => setShowAddMealModal(false)}
        onSave={(mealPlan) => {
          addMealPlan(mealPlan);
          setShowAddMealModal(false);
        }}
        selectedDay={selectedDay}
        recentMeals={meals.slice(0, 5)} // Show 5 most recent meals
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
  },
  generateButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  plannerSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loader: {
    alignSelf: 'center',
    marginVertical: 40,
  },
  infoSection: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginTop: 8,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MealPlanScreen;