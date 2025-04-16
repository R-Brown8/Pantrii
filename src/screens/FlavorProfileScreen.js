/**
 * FlavorProfileScreen
 * 
 * Allows users to set flavor preferences by marking flavors they like or dislike.
 * Implements MVP 4 feature: Flavor Profiles & Preferences
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import Config from '../constants/config';
import FlavorTag from '../components/flavor/FlavorTag';

const FlavorProfileScreen = () => {
  const { 
    flavorProfile,
    addFlavorLike,
    addFlavorDislike,
    removeFlavorPreference
  } = useAppContext();
  
  // State for UI feedback when updating preferences
  const [updatingFlavor, setUpdatingFlavor] = useState(null);
  
  // Handle when user selects a flavor as liked
  const handleLike = async (flavor) => {
    setUpdatingFlavor(flavor.id);
    await addFlavorLike(flavor.id);
    setUpdatingFlavor(null);
  };
  
  // Handle when user selects a flavor as disliked
  const handleDislike = async (flavor) => {
    setUpdatingFlavor(flavor.id);
    await addFlavorDislike(flavor.id);
    setUpdatingFlavor(null);
  };
  
  // Handle when user removes a preference
  const handleRemove = async (flavor) => {
    setUpdatingFlavor(flavor.id);
    await removeFlavorPreference(flavor.id);
    setUpdatingFlavor(null);
  };
  
  // Check if a flavor is liked
  const isFlavorLiked = (flavorId) => {
    return flavorProfile.likes.includes(flavorId);
  };
  
  // Check if a flavor is disliked
  const isFlavorDisliked = (flavorId) => {
    return flavorProfile.dislikes.includes(flavorId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Flavor Profile</Text>
        <Text style={styles.subtitle}>
          Select flavors you enjoy or dislike to help us personalize your meal suggestions
        </Text>
      </View>
      
      {/* Flavor preferences section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flavor Preferences</Text>
        
        <View style={styles.flavorGrid}>
          {Config.flavors.categories.map((flavor) => (
            <View key={flavor.id} style={styles.flavorItem}>
              <FlavorTag 
                flavor={flavor}
                liked={isFlavorLiked(flavor.id)}
                disliked={isFlavorDisliked(flavor.id)}
                disabled={updatingFlavor === flavor.id}
                onPress={() => {
                  if (isFlavorLiked(flavor.id)) {
                    handleRemove(flavor);
                  } else if (isFlavorDisliked(flavor.id)) {
                    handleRemove(flavor);
                  } else {
                    // Show preference options when neutral
                    setUpdatingFlavor(flavor.id);
                  }
                }}
              />
              
              {/* Preference buttons shown when selecting a neutral flavor */}
              {updatingFlavor === flavor.id && !isFlavorLiked(flavor.id) && !isFlavorDisliked(flavor.id) && (
                <View style={styles.preferenceButtons}>
                  <TouchableOpacity 
                    style={[styles.preferenceButton, styles.likeButton]}
                    onPress={() => handleLike(flavor)}
                  >
                    <Ionicons name="thumbs-up" size={16} color={Colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.preferenceButton, styles.dislikeButton]}
                    onPress={() => handleDislike(flavor)}
                  >
                    <Ionicons name="thumbs-down" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
      
      {/* Summary section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Flavor Summary</Text>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Flavors You Like</Text>
            <View style={styles.tagsContainer}>
              {flavorProfile.likes.length > 0 ? (
                flavorProfile.likes.map(flavorId => {
                  const flavor = Config.flavors.categories.find(f => f.id === flavorId);
                  return flavor ? (
                    <FlavorTag 
                      key={flavor.id}
                      flavor={flavor}
                      liked={true}
                      mini={true}
                      onPress={() => handleRemove(flavor)}
                    />
                  ) : null;
                })
              ) : (
                <Text style={styles.emptyText}>No liked flavors yet</Text>
              )}
            </View>
          </View>
          
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Flavors You Dislike</Text>
            <View style={styles.tagsContainer}>
              {flavorProfile.dislikes.length > 0 ? (
                flavorProfile.dislikes.map(flavorId => {
                  const flavor = Config.flavors.categories.find(f => f.id === flavorId);
                  return flavor ? (
                    <FlavorTag 
                      key={flavor.id}
                      flavor={flavor}
                      disliked={true}
                      mini={true}
                      onPress={() => handleRemove(flavor)}
                    />
                  ) : null;
                })
              ) : (
                <Text style={styles.emptyText}>No disliked flavors yet</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      
      {/* Tip section */}
      <View style={styles.tipContainer}>
        <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
        <Text style={styles.tipText}>
          Tap a flavor to select it, then choose whether you like or dislike it.
          Tap again to remove your preference.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  flavorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flavorItem: {
    flexDirection: 'column',
    marginRight: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  preferenceButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  preferenceButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  likeButton: {
    backgroundColor: Colors.successLight,
  },
  dislikeButton: {
    backgroundColor: Colors.errorLight,
  },
  summaryContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyText: {
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    color: Colors.primary,
    fontSize: 14,
  },
});

export default FlavorProfileScreen;