/**
 * MealHistoryScreen
 * 
 * Displays a chronological list of logged meals.
 * Provides basic meal history tracking functionality.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Modal
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import Card from '../components/ui/Card';
import FlavorTag from '../components/flavor/FlavorTag';
import Config from '../constants/config';
import { formatDisplayDate } from '../utils/dateUtils';
import { trackFlavorCombination } from '../utils/flavorCombinations';

const MealHistoryScreen = () => {
  const { meals, removeMeal } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Group meals by date
  const groupedMeals = useMemo(() => {
    // Filter meals based on search query
    const filteredMeals = searchQuery 
      ? meals.filter(meal => 
          meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.ingredients.some(ing => 
            ing.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          (meal.notes && meal.notes.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : meals;
    
    // Sort by date (newest first)
    const sortedMeals = [...filteredMeals].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Group by date
    return sortedMeals.reduce((groups, meal) => {
      const date = meal.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(meal);
      return groups;
    }, {});
  }, [meals, searchQuery]);
  
  // Convert grouped meals to array for FlatList
  const sections = useMemo(() => {
    return Object.keys(groupedMeals).map(date => ({
      date,
      data: groupedMeals[date]
    }));
  }, [groupedMeals]);
  
  // Open image modal
  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };
  
  // Handle when user views meal details
  const handleViewMealDetails = (meal) => {
    // If the meal has flavor tags, track this as a flavor combination
    if (meal.flavors && meal.flavors.length >= 2) {
      // Track as a liked combination (assuming user liked it since they logged it)
      trackFlavorCombination(meal.flavors, true);
    }
    
    // For now, just show the image if available
    if (meal.imageUri) {
      handleImagePress(meal.imageUri);
    }
  };
  
  // Close image modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  
  // Handle deletion of a meal
  const handleDelete = (mealId) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await removeMeal(mealId);
            if (!success) {
              Alert.alert('Error', 'Failed to delete meal. Please try again.');
            }
          }
        },
      ]
    );
  };
  
  const renderRightActions = (mealId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(mealId)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };
  
  // Render a meal item
  const renderMealItem = ({ item }) => {
    return (
      <Swipeable
        key={`swipeable-${item.id}`}
        friction={2}
        renderRightActions={() => renderRightActions(item.id)}
        rightThreshold={40}
        overshootRight={false}
      >
        <Card style={styles.mealCard}>
          {/* Display meal image if available */}
          {item.imageUri && (
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={() => handleViewMealDetails(item)}
              activeOpacity={0.9}
            >
              <Image 
                source={{ uri: item.imageUri }} 
                style={styles.mealImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        
          <View style={styles.mealContent}>
            <Text style={styles.mealName}>{item.name}</Text>
            
            {item.ingredients.length > 0 && (
              <View style={styles.ingredientsContainer}>
                <Text style={styles.sectionLabel}>Ingredients:</Text>
                <Text style={styles.ingredients}>
                  {item.ingredients.join(', ')}
                </Text>
              </View>
            )}
            
            {/* Display flavor tags */}
            {item.flavors && item.flavors.length > 0 && (
              <View style={styles.flavorsContainer}>
                <Text style={styles.sectionLabel}>Flavors:</Text>
                <View style={styles.flavorsRow}>
                  {item.flavors.map(flavorId => {
                    const flavor = Config.flavors.categories.find(f => f.id === flavorId);
                    return flavor ? (
                      <FlavorTag 
                        key={flavor.id}
                        flavor={flavor}
                        mini={true}
                        liked={true}
                        disabled={true}
                      />
                    ) : null;
                  })}
                </View>
              </View>
            )}
            
            {item.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.sectionLabel}>Notes:</Text>
                <Text style={styles.notes}>{item.notes}</Text>
              </View>
            )}
          </View>
        </Card>
      </Swipeable>
    );
  };
  
  // Render section header (date)
  const renderSectionHeader = ({ date }) => (
    <View style={styles.dateHeader}>
      <Text style={styles.dateText}>{formatDisplayDate(date)}</Text>
    </View>
  );
  
  // Render a single section (each date with its meals)
  const renderSection = ({ item }) => (
    <View key={`section-${item.date}`}>
      {renderSectionHeader(item)}
      {item.data.map(meal => (
        <View key={meal.id}>
          {renderMealItem({ item: meal })}
        </View>
      ))}
    </View>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={64} color={Colors.textTertiary} />
      
      {searchQuery ? (
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>No matching meals</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.resetButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>No meals logged yet</Text>
          <Text style={styles.emptyText}>
            Your meal history will appear here once you start logging meals
          </Text>
        </View>
      )}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal History</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals or ingredients..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Meal List */}
      {sections.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.date}
          renderItem={renderSection}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1} 
            onPress={closeModal}
          >
            <TouchableOpacity 
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
            >
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.fullImage} 
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={closeModal}
            >
              <Ionicons name="close-circle" size={36} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.input,
    margin: 16,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginLeft: 6,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingBottom: 20,
  },
  dateHeader: {
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  mealCard: {
    marginHorizontal: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealContent: {
    padding: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  ingredientsContainer: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  flavorsContainer: {
    marginBottom: 8,
  },
  flavorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: 8,
    marginTop: 8,
  },
  notes: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyContent: {
    alignItems: 'center',
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  resetButtonText: {
    color: Colors.textLight,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fullImage: {
    width: 350,
    height: 350,
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default MealHistoryScreen;