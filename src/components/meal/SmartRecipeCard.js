/**
 * Smart Recipe Card Component
 * 
 * This component displays a recipe card with matching indicators
 * for the Smart Recipe feature.
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RecipeMatchIndicator from '../ui/RecipeMatchIndicator';

const SmartRecipeCard = ({ recipe, onPress }) => {
  const { colors } = useTheme();
  
  // Ingredient status summary
  const getIngredientSummary = () => {
    const total = recipe.ingredients.length;
    const available = recipe.availableIngredients.length;
    
    return `${available}/${total} ingredients available`;
  };
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Card content */}
      <View style={styles.contentContainer}>
        {/* Recipe basic info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>
          <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
            {recipe.description}
          </Text>
          
          {/* Recipe tags - only show if tags exist and aren't empty */}
          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <View 
                  key={index} 
                  style={[styles.tag, { backgroundColor: colors.primary + '20' }]}
                >
                  <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Recipe timing */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {recipe.servings} servings
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="restaurant-outline" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {getIngredientSummary()}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Recipe image or placeholder */}
        {recipe.imageUrl ? (
          <Image 
            source={{ uri: recipe.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="restaurant-outline" size={32} color="#AAAAAA" />
          </View>
        )}
      </View>
      
      {/* Status indicators */}
      <View style={styles.indicatorsContainer}>
        {/* Match percentage */}
        <RecipeMatchIndicator percentage={recipe.matchPercentage} />
        
        {/* Ready to cook indicator */}
        {recipe.canMake && (
          <View style={[styles.statusIndicator, { backgroundColor: '#4CAF5020' }]}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>Ready to cook</Text>
          </View>
        )}
        
        {/* Uses expiring ingredients */}
        {recipe.usesExpiringItems && (
          <View style={[styles.statusIndicator, { backgroundColor: '#FF980020' }]}>
            <Ionicons name="time" size={16} color="#FF9800" />
            <Text style={[styles.statusText, { color: '#FF9800' }]}>Uses expiring items</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default SmartRecipeCard;
