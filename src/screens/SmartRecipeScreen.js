/**
 * Smart Recipe Screen
 * 
 * This screen displays recipe suggestions based on pantry contents.
 */

import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRecipeContext } from '../context/RecipeContext';
import SmartRecipeCard from '../components/meal/SmartRecipeCard';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SmartRecipeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { suggestions, loading, error, getSmartSuggestions } = useRecipeContext();
  const [filterType, setFilterType] = useState('all'); // 'all', 'canMake', 'expiring'

  // Load suggestions when screen mounts
  useEffect(() => {
    getSmartSuggestions();
  }, []);

  // Filter suggestions based on selected filter
  const filteredSuggestions = () => {
    switch(filterType) {
      case 'canMake':
        return suggestions.filter(recipe => recipe.canMake);
      case 'expiring':
        return suggestions.filter(recipe => recipe.usesExpiringItems);
      default:
        return suggestions;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Pantrii Smart Recipes</Text>
      
      {/* Filter controls */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filterType === 'all' && [styles.activeFilter, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[
            styles.filterText, 
            filterType === 'all' && styles.activeFilterText
          ]}>All Recipes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filterType === 'canMake' && [styles.activeFilter, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setFilterType('canMake')}
        >
          <Text style={[
            styles.filterText, 
            filterType === 'canMake' && styles.activeFilterText
          ]}>Ready to Make</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filterType === 'expiring' && [styles.activeFilter, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setFilterType('expiring')}
        >
          <Text style={[
            styles.filterText, 
            filterType === 'expiring' && styles.activeFilterText
          ]}>Uses Expiring</Text>
        </TouchableOpacity>
      </View>

      {/* Error message if any */}
      {error && (
        <View style={styles.messageContainer}>
          <Text style={[styles.errorText, { color: colors.notification }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={getSmartSuggestions}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Finding recipes...</Text>
        </View>
      )}

      {/* Empty state */}
      {!loading && !error && filteredSuggestions().length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={64} color={colors.text} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No matching recipes found.
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text }]}>
            Try adding more items to your pantry or adjusting your filters.
          </Text>
        </View>
      )}

      {/* Recipe list */}
      {!loading && !error && filteredSuggestions().length > 0 && (
        <FlatList
          data={filteredSuggestions()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SmartRecipeCard
              recipe={item}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Refresh button */}
      <TouchableOpacity 
        style={[styles.refreshButton, { backgroundColor: colors.primary }]}
        onPress={getSmartSuggestions}
        disabled={loading}
      >
        <Ionicons name="refresh-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeFilter: {
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '500',
  },
  messageContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFF3F3',
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 12,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 80, // Give space for the refresh button
  },
  refreshButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default SmartRecipeScreen;
