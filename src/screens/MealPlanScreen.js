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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import WeeklyPlanner from '../components/meal/planner/WeeklyPlanner';
import MealPlanForm from '../components/meal/planner/MealPlanForm';
import PantryFilterToggle from '../components/meal/planner/PantryFilterToggle';

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
  const [showPantryReady, setShowPantryReady] = useState(false);
  const [filteredMealPlans, setFilteredMealPlans] = useState([]);

  /**
   * Show a dialog to select a day for meal plan generation
   */
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [generatingDay, setGeneratingDay] = useState(null);
  
  /**
   * Filter meal plans based on pantry availability
   */
  useEffect(() => {
    if (!showPantryReady) {
      setFilteredMealPlans(mealPlans);
      return;
    }
    
    // Get available ingredients from pantry
    const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
    
    // Filter meal plans that can be made with available ingredients
    const filtered = mealPlans.filter(plan => {
      if (!plan.ingredients || plan.ingredients.length === 0) {
        return true; // Include plans without ingredient information
      }
      
      // Check if all ingredients are available
      const allIngredientsAvailable = plan.ingredients.every(ingredient => 
        availableIngredients.includes(ingredient.toLowerCase())
      );
      
      return allIngredientsAvailable;
    });
    
    setFilteredMealPlans(filtered);
  }, [showPantryReady, mealPlans, pantryItems]);
  
  /**
   * Generate a new meal plan for a specific day
   */
  const handleGeneratePlan = (day) => {
    if (!day) {
      setShowDaySelector(true);
      return;
    }
    
    setGeneratingDay(day);
    setGeneratingPlan(true);
    setShowDaySelector(false);
    
    // In a real app, this would call an API or use AI
    setTimeout(() => {
      try {
        // Get available ingredients from pantry
        const availableIngredients = pantryItems.map(item => item.name.toLowerCase());
        
        // Get user's flavor preferences
        const likedFlavors = flavorProfile.likes;
        const dislikedFlavors = flavorProfile.dislikes;
        
        // Meal suggestions based on the selected day
        const mealOptions = {
          'Monday': ['Pasta with Tomato Sauce', 'Veggie Pasta', 'Mushroom Risotto'],
          'Tuesday': ['Vegetable Stir Fry', 'Thai Curry', 'Tofu Bowl'],
          'Wednesday': ['Chicken Salad', 'Caesar Salad', 'Greek Salad'],
          'Thursday': ['Bean Tacos', 'Beef Burritos', 'Enchiladas'],
          'Friday': ['Grilled Fish', 'Seafood Paella', 'Shrimp Scampi'],
          'Saturday': ['Pizza Night', 'Burger Night', 'Taco Night'],
          'Sunday': ['Roast Chicken', 'Beef Roast', 'Vegetable Lasagna']
        };
        
        // Ingredients for each meal
        const mealIngredients = {
          'Pasta with Tomato Sauce': ['pasta', 'tomatoes', 'garlic', 'olive oil'],
          'Veggie Pasta': ['pasta', 'zucchini', 'peppers', 'onions', 'garlic'],
          'Mushroom Risotto': ['arborio rice', 'mushrooms', 'onions', 'vegetable broth'],
          'Vegetable Stir Fry': ['rice', 'mixed vegetables', 'soy sauce'],
          'Thai Curry': ['coconut milk', 'curry paste', 'vegetables', 'rice'],
          'Tofu Bowl': ['tofu', 'rice', 'vegetables', 'soy sauce'],
          'Chicken Salad': ['chicken breast', 'lettuce', 'tomatoes', 'cucumber'],
          'Caesar Salad': ['romaine lettuce', 'croutons', 'parmesan', 'dressing'],
          'Greek Salad': ['cucumber', 'tomatoes', 'feta', 'olives', 'olive oil'],
          'Bean Tacos': ['tortillas', 'beans', 'cheese', 'salsa'],
          'Beef Burritos': ['tortillas', 'ground beef', 'beans', 'cheese', 'salsa'],
          'Enchiladas': ['tortillas', 'enchilada sauce', 'cheese', 'beans'],
          'Grilled Fish': ['fish', 'lemon', 'herbs', 'potatoes'],
          'Seafood Paella': ['rice', 'seafood mix', 'saffron', 'tomatoes', 'peppers'],
          'Shrimp Scampi': ['shrimp', 'pasta', 'garlic', 'butter', 'lemon'],
          'Pizza Night': ['pizza dough', 'cheese', 'tomato sauce', 'toppings'],
          'Burger Night': ['ground beef', 'burger buns', 'lettuce', 'tomato', 'cheese'],
          'Taco Night': ['tortillas', 'ground beef', 'lettuce', 'tomato', 'cheese'],
          'Roast Chicken': ['chicken', 'potatoes', 'carrots', 'onions'],
          'Beef Roast': ['beef roast', 'potatoes', 'carrots', 'onions'],
          'Vegetable Lasagna': ['lasagna noodles', 'vegetables', 'tomato sauce', 'cheese']
        };
        
        // Flavor profiles for each meal
        const mealFlavorProfiles = {
          'Pasta with Tomato Sauce': ['umami', 'aromatic', 'sour'],
          'Veggie Pasta': ['aromatic', 'herbaceous', 'fresh'],
          'Mushroom Risotto': ['umami', 'creamy', 'earthy'],
          'Vegetable Stir Fry': ['umami', 'salty', 'aromatic'],
          'Thai Curry': ['spicy', 'aromatic', 'creamy'],
          'Tofu Bowl': ['umami', 'salty', 'fresh'],
          'Chicken Salad': ['creamy', 'tangy', 'salty'],
          'Caesar Salad': ['umami', 'salty', 'tangy'],
          'Greek Salad': ['sour', 'salty', 'refreshing'],
          'Bean Tacos': ['spicy', 'creamy', 'umami'],
          'Beef Burritos': ['umami', 'spicy', 'savory'],
          'Enchiladas': ['spicy', 'savory', 'umami'],
          'Grilled Fish': ['aromatic', 'smoky', 'salty'],
          'Seafood Paella': ['umami', 'aromatic', 'savory'],
          'Shrimp Scampi': ['garlicky', 'buttery', 'umami'],
          'Pizza Night': ['umami', 'creamy', 'aromatic'],
          'Burger Night': ['umami', 'savory', 'fatty'],
          'Taco Night': ['spicy', 'savory', 'umami'],
          'Roast Chicken': ['smoky', 'aromatic', 'umami'],
          'Beef Roast': ['umami', 'savory', 'rich'],
          'Vegetable Lasagna': ['umami', 'herbaceous', 'savory']
        };
        
        // Get options for the selected day
        const options = mealOptions[day] || [];
        
        // Score each option based on flavor preferences
        const scoredOptions = options.map(meal => {
          const mealFlavors = mealFlavorProfiles[meal] || [];
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
          
          return {
            meal,
            preferenceScore,
            ingredients: mealIngredients[meal] || [],
            flavorProfile: mealFlavors
          };
        });
        
        // Sort by preference score
        scoredOptions.sort((a, b) => b.preferenceScore - a.preferenceScore);
        
        // Take the best option
        const bestOption = scoredOptions[0];
        
        if (bestOption) {
          // Remove any existing meal plans for this day
          const existingPlans = mealPlans.filter(plan => plan.day === day);
          existingPlans.forEach(plan => {
            removeMealPlan(plan.id);
          });
          
          // Add the new meal plan
          addMealPlan({
            day,
            meal: bestOption.meal,
            ingredients: bestOption.ingredients,
            flavorProfile: bestOption.flavorProfile
          });
          
          alert(`Meal plan for ${day} generated successfully!`);
        } else {
          alert(`Could not generate a meal plan for ${day}.`);
        }
      } catch (error) {
        console.error('Error generating meal plan:', error);
        alert('Failed to generate meal plan. Please try again.');
      } finally {
        setGeneratingPlan(false);
        setGeneratingDay(null);
      }
    }, 1500); // Simulate API delay
  };
  
  // Render the day selector modal
  const renderDaySelectorModal = () => {
    const isForMealPlan = generatingDay === null;
    const isForCustomMeal = generatingDay === "custom";
    let title = "Select a day";
    
    if (isForMealPlan) {
      title = "Select a day to generate meal plan";
    } else if (isForCustomMeal) {
      title = "Select a day to add custom meal";
    }
    
    return (
      <Modal
        visible={showDaySelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowDaySelector(false);
          setGeneratingDay(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.daySelectorContainer}>
            <Text style={styles.daySelectorTitle}>{title}</Text>
            
            {/* Day options */}
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <TouchableOpacity 
                key={day}
                style={styles.daySelectorOption}
                onPress={() => {
                  if (isForMealPlan) {
                    handleGeneratePlan(day);
                  } else if (isForCustomMeal) {
                    setSelectedDay(day);
                    setShowAddMealModal(true);
                    setShowDaySelector(false);
                    setGeneratingDay(null);
                  }
                }}
              >
                <Text style={styles.daySelectorOptionText}>{day}</Text>
              </TouchableOpacity>
            ))}
            
            {/* Cancel button */}
            <TouchableOpacity 
              style={styles.daySelectorCancelButton}
              onPress={() => {
                setShowDaySelector(false);
                setGeneratingDay(null);
              }}
            >
              <Text style={styles.daySelectorCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <View style={styles.container}>
      {renderDaySelectorModal()}
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Planner</Text>
          <Text style={styles.subtitle}>
            Plan your meals for the week ahead
          </Text>
        </View>
        
        {/* Pantry filter toggle */}
        <View style={styles.filterContainer}>
          <PantryFilterToggle
            value={showPantryReady}
            onChange={setShowPantryReady}
            style={styles.filterToggle}
          />
        </View>
        
        {/* Generate plan button */}
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={() => handleGeneratePlan(null)}
          disabled={generatingPlan}
        >
          {generatingPlan ? (
            <>
              <ActivityIndicator size={24} color={Colors.textLight} />
              <Text style={[styles.generateButtonText, { marginLeft: 10 }]}>
                Generating for {generatingDay}...
              </Text>
            </>
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
            mealPlans={showPantryReady ? filteredMealPlans : mealPlans} 
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
    padding: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    marginTop: 6,
    padding: 14,
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
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  loader: {
    alignSelf: 'center',
    marginVertical: 40,
  },
  infoSection: {
    margin: 12,
    marginTop: 4,
    padding: 14,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Day selector modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelectorContainer: {
    width: '80%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  daySelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  daySelectorOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  daySelectorOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  daySelectorCancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: Colors.danger,
    borderRadius: 8,
  },
  filterContainer: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  filterToggle: {
    marginHorizontal: 4,
  },
  daySelectorCancelText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MealPlanScreen;