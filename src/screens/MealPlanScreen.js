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
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showPantryReady, setShowPantryReady] = useState(false);
  const [filteredMealPlans, setFilteredMealPlans] = useState([]);

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
      const allIngredientsAvailable = plan.ingredients.every(ingredient => {
        // Support both string and object ingredient formats
        const ingredientName = typeof ingredient === 'object' && ingredient !== null
          ? ingredient.name
          : ingredient;
        if (typeof ingredientName !== 'string') return false;
        return availableIngredients.includes(ingredientName.toLowerCase());
      });
      
      return allIngredientsAvailable;
    });
    
    setFilteredMealPlans(filtered);
  }, [showPantryReady, mealPlans, pantryItems]);
  

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
        
        {/* Weekly meal planner view */}
        <View style={styles.plannerSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[styles.sectionTitle, {marginBottom: 0}]}>Weekly Plan</Text>
          <View style={{width: 16}} />
          <PantryFilterToggle
            value={showPantryReady}
            onChange={setShowPantryReady}
            style={styles.filterToggle}
            label="Pantry-Ready only   "
          />
        </View>
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 6,
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