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
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PantryStatusView from '../components/meal/PantryStatusView';
import AppContext from '../context/AppContext';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const { colors } = useTheme();
  const { addMealPlan } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients', 'instructions', 'nutrition'
  
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
        </View>
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
});

export default RecipeDetailScreen;
