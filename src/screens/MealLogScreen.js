/**
 * Meal Log Screen
 * 
 * Combined screen for viewing meal history and adding new meals.
 * Part of the Pantrii 5.5.1 update.
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const MealLogScreen = ({ navigation }) => {
  const { meals, isLoading, removeMeal } = useAppContext();
  const [groupedMeals, setGroupedMeals] = useState({});
  
  // Group meals by date when meals change
  useEffect(() => {
    const grouped = {};
    
    // Sort meals by date (latest first)
    const sortedMeals = [...meals].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    // Group by date
    sortedMeals.forEach(meal => {
      const date = meal.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(meal);
    });
    
    setGroupedMeals(grouped);
  }, [meals]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Render a meal item
  const renderMealItem = (meal) => (
    <View style={styles.mealItem}>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealIngredients}>
          {meal.ingredients.join(', ')}
        </Text>
        {meal.notes && (
          <Text style={styles.mealNotes}>Note: {meal.notes}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDeleteMeal(meal)}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );
  
  // Confirm deletion of a meal
  const confirmDeleteMeal = (meal) => {
    // Here you would normally show a confirmation dialog
    // For simplicity, we're just deleting directly
    removeMeal(meal.id);
  };
  
  // Convert grouped meals object to array for FlatList
  const sections = Object.keys(groupedMeals).map(date => ({
    date,
    data: groupedMeals[date]
  }));
  
  // Render a section header (date)
  const renderSectionHeader = (date) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {formatDate(date)}
      </Text>
    </View>
  );
  
  // Render a section (date and its meals)
  const renderSection = ({ item }) => (
    <View style={styles.section}>
      {renderSectionHeader(item.date)}
      {item.data.map(meal => renderMealItem(meal))}
    </View>
  );
  
  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={64} color={Colors.textTertiary} />
      <Text style={styles.emptyTitle}>No meals logged yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your meals to see them here.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Meal History</Text>
      </View>
      
      {/* Loading indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your meals...</Text>
        </View>
      ) : (
        /* Meal list */
        <FlatList
          data={sections}
          keyExtractor={item => item.date}
          renderItem={renderSection}
          contentContainerStyle={
            sections.length === 0 ? { flex: 1 } : styles.listContent
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
      
      {/* Add meal button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('LogMeal')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  listContent: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealIngredients: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  mealNotes: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});

export default MealLogScreen;
