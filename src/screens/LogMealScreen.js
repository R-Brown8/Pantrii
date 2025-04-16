/**
 * LogMealScreen
 * 
 * Screen for adding new meals to the meal history.
 * Enhanced for MVP 4 with flavor profiles and suggestions.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import Button from '../components/ui/Button';
import DatePicker from '../components/ui/DatePicker';
import FlavorTag from '../components/flavor/FlavorTag';
import Config from '../constants/config';
import { suggestFlavorTags } from '../utils/flavorUtils';
import { recommendCombinations } from '../utils/flavorCombinations';

const LogMealScreen = ({ navigation }) => {
  // Get context data and methods
  const { addMeal, pantryItems, flavorProfile } = useAppContext();
  
  // Form state
  const [mealName, setMealName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [suggestedFlavors, setSuggestedFlavors] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // State for managing flavor combination suggestions
  const [selectedBaseFlavor, setSelectedBaseFlavor] = useState(null);
  const [combinationSuggestions, setCombinationSuggestions] = useState([]);
  const [showCombinations, setShowCombinations] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!mealName.trim()) {
      newErrors.mealName = 'Meal name is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Add an ingredient to the list
  const addIngredient = () => {
    if (!currentIngredient.trim()) return;
    
    const newIngredients = [...ingredients, currentIngredient.trim()];
    setIngredients(newIngredients);
    setCurrentIngredient('');
    
    // Update flavor suggestions based on new ingredients list
    updateFlavorSuggestions(newIngredients);
  };
  
  // Update flavor suggestions based on ingredients
  const updateFlavorSuggestions = (ingredientsList) => {
    if (ingredientsList.length > 0) {
      // Get flavor suggestions
      const suggestions = suggestFlavorTags(ingredientsList);
      
      // Filter out flavors that are already selected
      const newSuggestions = suggestions.filter(
        flavor => !selectedFlavors.includes(flavor)
      );
      
      // Update state
      setSuggestedFlavors(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestedFlavors([]);
      setShowSuggestions(false);
    }
  };
  
  // Remove an ingredient from the list
  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
    
    // Update flavor suggestions
    updateFlavorSuggestions(updatedIngredients);
  };
  
  // Handle flavor tag selection
  const handleFlavorSelection = async (flavor) => {
    const isSelected = selectedFlavors.includes(flavor.id);
    
    if (isSelected) {
      // Remove from selections
      setSelectedFlavors(selectedFlavors.filter(id => id !== flavor.id));
      if (selectedBaseFlavor === flavor.id) {
        setSelectedBaseFlavor(null);
        setShowCombinations(false);
      }
    } else {
      // Add to selections
      setSelectedFlavors([...selectedFlavors, flavor.id]);
      
      // If this is the first or only flavor, set as base and suggest combinations
      if (selectedFlavors.length === 0) {
        setSelectedBaseFlavor(flavor.id);
        const suggestions = await recommendCombinations(flavor.id, 3);
        if (suggestions.length > 0) {
          setCombinationSuggestions(suggestions);
          setShowCombinations(true);
        }
      }
    }
  };
  
  // Add a suggested flavor combination
  const addFlavorCombination = (suggestion) => {
    // Get paired flavors that aren't already selected
    const newFlavors = suggestion.pairedFlavors.filter(
      id => !selectedFlavors.includes(id)
    );
    
    // Add them to selected flavors
    if (newFlavors.length > 0) {
      setSelectedFlavors([...selectedFlavors, ...newFlavors]);
    }
    
    // Hide the suggestion
    setShowCombinations(false);
  };
  
  // Pick an image from gallery
  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permission to add meal photos.');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  // Take a photo with camera
  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permission to take meal photos.');
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };
  
  // Remove the current image
  const removeImage = () => {
    setImageUri(null);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create meal object
      const meal = {
        id: Date.now().toString(),
        name: mealName.trim(),
        date,
        ingredients,
        notes: notes.trim(),
        imageUri, // Add the image URI to the meal object
        flavors: selectedFlavors, // Add selected flavors (MVP 4)
      };
      
      // Add meal to history
      const success = await addMeal(meal);
      
      if (success) {
        // Reset form
        setMealName('');
        setDate(new Date().toISOString().split('T')[0]);
        setIngredients([]);
        setNotes('');
        setImageUri(null);
        setSelectedFlavors([]);
        
        // Show success message
        Alert.alert(
          'Meal Logged',
          'Your meal has been added to your history.',
          [{ text: 'OK', onPress: () => navigation.navigate('Meal History') }]
        );
      } else {
        Alert.alert('Error', 'Failed to log meal. Please try again.');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Suggest ingredients from pantry
  const suggestIngredient = (text) => {
    setCurrentIngredient(text);
    
    // You could add auto-complete suggestions here in a future version
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Log a Meal</Text>
      </View>
      
      <ScrollView style={styles.form}>
        {/* Meal Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Meal Name *</Text>
          <TextInput
            style={[styles.input, errors.mealName && styles.inputError]}
            value={mealName}
            onChangeText={setMealName}
            placeholder="What did you eat?"
            placeholderTextColor={Colors.textTertiary}
          />
          {errors.mealName && <Text style={styles.errorText}>{errors.mealName}</Text>}
        </View>
        
        {/* Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date *</Text>
          <DatePicker
            value={date}
            onChange={setDate}
            error={errors.date}
            maximumDate={new Date().toISOString().split('T')[0]}
          />
        </View>
        
        {/* Photo Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Meal Photo</Text>
          
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.mealImage} />
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={styles.imageButton} 
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={20} color={Colors.textLight} />
                  <Text style={styles.imageButtonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.imageButton} 
                  onPress={removeImage}
                >
                  <Ionicons name="trash" size={20} color={Colors.textLight} />
                  <Text style={styles.imageButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.photoOptions}>
              <TouchableOpacity 
                style={styles.photoButton} 
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={24} color={Colors.primary} />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.photoButton} 
                onPress={pickImage}
              >
                <Ionicons name="images" size={24} color={Colors.primary} />
                <Text style={styles.photoButtonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Ingredients */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ingredients *</Text>
          
          <View style={styles.ingredientInputContainer}>
            <TextInput
              style={[styles.ingredientInput, errors.ingredients && styles.inputError]}
              value={currentIngredient}
              onChangeText={suggestIngredient}
              placeholder="Add ingredients used"
              placeholderTextColor={Colors.textTertiary}
              returnKeyType="done"
              onSubmitEditing={addIngredient}
            />
            
            <TouchableOpacity
              style={styles.addIngredientButton}
              onPress={addIngredient}
              disabled={!currentIngredient.trim()}
            >
              <Ionicons 
                name="add-circle" 
                size={28} 
                color={currentIngredient.trim() ? Colors.primary : Colors.gray400} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Error message */}
          {errors.ingredients && (
            <Text style={styles.errorText}>{errors.ingredients}</Text>
          )}
          
          {/* Ingredients List */}
          <View style={styles.ingredientsList}>
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                  <TouchableOpacity
                    onPress={() => removeIngredient(index)}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noIngredientsText}>No ingredients added yet</Text>
            )}
          </View>
        </View>
        
        {/* Flavors Section (MVP 4) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Flavors</Text>
          <Text style={styles.sublabel}>Select flavors that describe this meal:</Text>
          
          {/* Flavor combinations suggestions (MVP 4) */}
          {showCombinations && combinationSuggestions.length > 0 && (
            <View style={styles.combinationsContainer}>
              <Text style={styles.combinationsTitle}>
                Popular flavor combinations with {Config.flavors.categories.find(f => f.id === selectedBaseFlavor)?.name}:
              </Text>
              <View style={styles.combinationsList}>
                {combinationSuggestions.map((suggestion, index) => {
                  const pairedFlavorNames = suggestion.pairedFlavors.map(id => {
                    const flavor = Config.flavors.categories.find(f => f.id === id);
                    return flavor ? flavor.name : '';
                  }).filter(name => name);
                  
                  return (
                    <TouchableOpacity 
                      key={index}
                      style={styles.combinationButton}
                      onPress={() => addFlavorCombination(suggestion)}
                    >
                      <Text style={styles.combinationText}>
                        {pairedFlavorNames.join(' & ')}
                      </Text>
                      <Text style={styles.addCombinationText}>Add</Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity 
                  style={styles.dismissButton}
                  onPress={() => setShowCombinations(false)}
                >
                  <Text style={styles.dismissText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Suggested flavors based on ingredients */}
          {showSuggestions && suggestedFlavors.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Suggested flavors based on ingredients:</Text>
              <View style={styles.suggestionButtons}>
                {suggestedFlavors.map(flavorId => {
                  const flavor = Config.flavors.categories.find(f => f.id === flavorId);
                  if (!flavor) return null;
                  
                  return (
                    <TouchableOpacity 
                      key={flavor.id}
                      style={styles.suggestionButton}
                      onPress={() => {
                        setSelectedFlavors([...selectedFlavors, flavor.id]);
                        setSuggestedFlavors(suggestedFlavors.filter(id => id !== flavor.id));
                        if (suggestedFlavors.length <= 1) {
                          setShowSuggestions(false);
                        }
                      }}
                    >
                      <Text style={styles.suggestionText}>{flavor.name}</Text>
                      <Ionicons name="add-circle" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  );
                })}
                
                <TouchableOpacity 
                  style={styles.dismissButton}
                  onPress={() => setShowSuggestions(false)}
                >
                  <Text style={styles.dismissText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.flavorTagsContainer}>
            {Config.flavors.categories.map((flavor) => (
              <FlavorTag 
                key={flavor.id}
                flavor={flavor}
                liked={selectedFlavors.includes(flavor.id)}
                onPress={() => handleFlavorSelection(flavor)}
              />
            ))}
          </View>
        </View>
        
        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes about this meal"
            placeholderTextColor={Colors.textTertiary}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        {/* Submit Button */}
        <Button
          title="Log Meal"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          icon="save-outline"
          style={styles.submitButton}
        />
      </ScrollView>
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
    paddingTop: 10, // Reduced from 20 to prevent excessive spacing
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    minHeight: 100,
  },
  imageContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mealImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: Colors.card,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  imageButtonText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  photoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: 16,
    width: '45%',
  },
  photoButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    marginTop: 8,
  },
  ingredientInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientInput: {
    flex: 1,
    backgroundColor: Colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  addIngredientButton: {
    marginLeft: 8,
    padding: 4,
  },
  ingredientsList: {
    marginTop: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  ingredientText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  noIngredientsText: {
    color: Colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  submitButton: {
    marginBottom: 32,
  },
  flavorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sublabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  suggestionsContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  suggestionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.primary,
    marginRight: 4,
  },
  dismissButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dismissText: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  combinationsContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  combinationsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  combinationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  combinationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    width: '47%',
  },
  combinationText: {
    fontSize: 13,
    color: Colors.secondary,
    flex: 1,
  },
  addCombinationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginLeft: 4,
  },
});

export default LogMealScreen;