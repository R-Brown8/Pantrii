/**
 * Weekly Meal Planner Component
 * 
 * This component displays a weekly view of planned meals,
 * allowing users to see what meals are scheduled for each day,
 * add new meals to the plan, and view meal ingredients.
 * 
 * MVP 3 functionality includes:
 * - Day selection mechanism
 * - Ability to assign meals to specific days
 * - View meals scheduled for each day
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/colors';

// Props interface for the component
const WeeklyPlanner = ({ mealPlans, onAddMeal, onRemoveMeal }) => {
  // Track which day is selected
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  // Get unique days from the meal plans
  const days = [...new Set(mealPlans.map(plan => plan.day))];
  
  // If no days in the data, use default week days
  const weekDays = days.length > 0
    ? days
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Get the plans for the selected day
  const selectedPlans = mealPlans.filter(plan => plan.day === selectedDay);
  
  return (
    <View style={styles.container}>
      {/* Horizontal scrolling day selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText
              ]}
            >
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Meal plans for the selected day */}
      <View style={styles.planContainer}>
        {selectedPlans.length > 0 ? (
          selectedPlans.map((plan) => (
            <View key={plan.id} style={styles.mealPlan}>
              {/* Meal title */}
              <View style={styles.mealHeader}>
                <Ionicons 
                  name="restaurant" 
                  size={20} 
                  color={Colors.primary} 
                  style={styles.mealIcon} 
                />
                <Text style={styles.mealTitle}>{plan.meal}</Text>
              </View>
              
              {/* Ingredients list */}
              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsLabel}>Ingredients:</Text>
                <Text style={styles.ingredients}>
                  {plan.ingredients.join(', ')}
                </Text>
              </View>
              
              {/* Action buttons */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={18} 
                    color={Colors.success} 
                  />
                  <Text style={[styles.actionText, { color: Colors.success }]}>Mark as Cooked</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons 
                    name="list" 
                    size={18} 
                    color={Colors.primary} 
                  />
                  <Text style={[styles.actionText, { color: Colors.primary }]}>Shopping List</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: Colors.danger + '20' }]}
                  onPress={() => onRemoveMeal && onRemoveMeal(plan.id)}
                >
                  <Ionicons 
                    name="trash-outline" 
                    size={18} 
                    color={Colors.danger} 
                  />
                  <Text style={[styles.actionText, { color: Colors.danger }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          // Empty state when no meals are planned for the day
          <View style={styles.emptyDayContainer}>
            <Ionicons 
              name="calendar-outline" 
              size={48} 
              color={Colors.textTertiary} 
            />
            <Text style={styles.emptyDayText}>
              No meals planned for {selectedDay}
            </Text>
            <TouchableOpacity 
              style={styles.emptyDayButton}
              onPress={() => onAddMeal && onAddMeal(selectedDay)}
            >
              <Text style={styles.emptyDayButtonText}>Add Meal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  daysContainer: {
    padding: 12,
    backgroundColor: Colors.background,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.input,
  },
  selectedDayButton: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  selectedDayText: {
    color: Colors.textLight,
  },
  planContainer: {
    padding: 16,
  },
  mealPlan: {
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealIcon: {
    marginRight: 8,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  ingredientsContainer: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  ingredientsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.background,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyDayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyDayText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDayButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyDayButtonText: {
    color: Colors.textLight,
    fontWeight: '600',
  },
});

export default WeeklyPlanner;