/**
 * SettingsScreen
 *
 * Provides app settings and user preferences.
 * Simplified version for MVP 2.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import Config from '../constants/config';
import Card from '../components/ui/Card';
import FlavorTag from '../components/flavor/FlavorTag';
import Debug from '../constants/debug';

const SettingsScreen = () => {
  const [debugCollapsed, setDebugCollapsed] = useState(true);
  const { loadData, flavorProfile, addFlavorLike, addFlavorDislike, removeFlavorPreference } = useAppContext();

  // App settings (with default values)
  const [settings, setSettings] = useState({
    showExpiryWarnings: true,
    defaultExpiryDays: Config.app.defaultExpiryDays,
    enableNotifications: false,
  });

  // Debug settings (sync with Debug constants)
  const [debugSettings, setDebugSettings] = useState({
    ENABLE_DEBUG: Debug.ENABLE_DEBUG,
    LOG_STATE: Debug.LOG_STATE,
    LOG_FILTERS: Debug.LOG_FILTERS,
    LOG_DATES: Debug.LOG_DATES,
    LOG_UI: Debug.LOG_UI,
    LOG_STORAGE: Debug.LOG_STORAGE,
    LOG_LIFECYCLE: Debug.LOG_LIFECYCLE,
  });

  // Toggle a boolean setting
  const toggleSetting = (key) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      AsyncStorage.setItem('savour_settings', JSON.stringify(updated))
        .catch(error => console.error('Error saving settings:', error));
      return updated;
    });
  };

  // Toggle a debug setting
  const toggleDebugSetting = (key) => {
    setDebugSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Update in-memory Debug constants
      Debug[key] = updated[key];
      // Persist to AsyncStorage
      AsyncStorage.setItem('flavormind_debug', JSON.stringify(updated))
        .catch(error => console.error('Error saving debug settings:', error));
      return updated;
    });
  };

  // Clear all app data
  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your pantry items and meal history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => {
            // Show second confirmation dialog
            Alert.alert(
              'Are You Absolutely Sure?',
              'This is your last chance to cancel. ALL DATA will be permanently deleted and CANNOT be recovered.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete Everything',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // Clear relevant storage keys
                      await AsyncStorage.multiRemove([
                        Config.storage.pantryItems,
                        Config.storage.mealHistory,
                        Config.storage.flavorProfile,
                        'savour_pantry_categories'
                      ]);

                      // Reload app data
                      await loadData();

                      Alert.alert('Success', 'All data has been cleared');
                    } catch (error) {
                      console.error('Error clearing data:', error);
                      Alert.alert('Error', 'Failed to clear data. Please try again.');
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  // Render a settings section
  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  // Render a toggle setting
  const renderToggleSetting = (key, label, description = null) => (
    <Card style={styles.settingCard}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
        <Switch
          value={settings[key]}
          onValueChange={() => toggleSetting(key)}
          trackColor={{ false: Colors.gray300, true: Colors.primary + '70' }}
          thumbColor={settings[key] ? Colors.primary : Colors.gray500}
        />
      </View>
    </Card>
  );

  // Render a debug toggle setting
  const renderDebugToggle = (key, label, description = null) => (
    <Card style={styles.settingCard}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
        <Switch
          value={debugSettings[key]}
          onValueChange={() => toggleDebugSetting(key)}
          trackColor={{ false: Colors.gray300, true: Colors.warning }}
          thumbColor={debugSettings[key] ? Colors.warning : Colors.gray500}
        />
      </View>
    </Card>
  );

  // Render an action button
  const renderActionButton = (icon, label, onPress, type = 'normal') => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        type === 'danger' && styles.dangerButton
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={24}
        color={type === 'danger' ? Colors.error : Colors.primary}
        style={styles.actionIcon}
      />
      <Text
        style={[
          styles.actionLabel,
          type === 'danger' && styles.dangerLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* General Settings */}
        {renderSection('General', (
          <>
            {renderToggleSetting(
              'showExpiryWarnings',
              'Expiry Warnings',
              'Show warnings for items about to expire'
            )}

            {renderToggleSetting(
              'enableNotifications',
              'Notifications',
              'Receive notifications about expiring items'
            )}
          </>  
          ))}

        {/* Flavor Preferences (MVP 4) */}
        {renderSection('Flavor Preferences', (
          <Card style={styles.flavorCard}>
            <Text style={styles.flavorSectionSubtitle}>
              Set your flavor preferences to improve meal suggestions
            </Text>
            
            <View style={styles.flavorTagsContainer}>
              {Config.flavors.categories.map((flavor) => (
                <FlavorTag 
                  key={flavor.id}
                  flavor={flavor}
                  liked={flavorProfile.likes.includes(flavor.id)}
                  disliked={flavorProfile.dislikes.includes(flavor.id)}
                  onPress={() => {
                    if (flavorProfile.likes.includes(flavor.id)) {
                      removeFlavorPreference(flavor.id);
                    } else if (flavorProfile.dislikes.includes(flavor.id)) {
                      removeFlavorPreference(flavor.id);
                    } else {
                      // Show flavor action dialog
                      Alert.alert(
                        `${flavor.name} Flavor`,
                        `Do you like or dislike ${flavor.name.toLowerCase()} flavors?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { 
                            text: 'Dislike',
                            style: 'destructive',
                            onPress: () => addFlavorDislike(flavor.id)
                          },
                          { 
                            text: 'Like', 
                            onPress: () => addFlavorLike(flavor.id) 
                          },
                        ]
                      );
                    }
                  }}
                />
              ))}
            </View>
            
            <Text style={styles.flavorNote}>
              Tap a flavor to set your preference. Tap again to remove it.
            </Text>
            
            <View style={styles.flavorSummary}>
              <View style={styles.flavorSummarySection}>
                <Text style={styles.flavorSummaryTitle}>Flavors You Like</Text>
                <View style={styles.flavorSummaryTags}>
                  {flavorProfile.likes.length > 0 ? (
                    flavorProfile.likes.map(flavorId => {
                      const flavor = Config.flavors.categories.find(f => f.id === flavorId);
                      return flavor ? (
                        <Text key={flavor.id} style={styles.flavorSummaryTag}>{flavor.name}</Text>
                      ) : null;
                    })
                  ) : (
                    <Text style={styles.flavorEmptyText}>No liked flavors yet</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.flavorSummarySection}>
                <Text style={styles.flavorSummaryTitle}>Flavors You Dislike</Text>
                <View style={styles.flavorSummaryTags}>
                  {flavorProfile.dislikes.length > 0 ? (
                    flavorProfile.dislikes.map(flavorId => {
                      const flavor = Config.flavors.categories.find(f => f.id === flavorId);
                      return flavor ? (
                        <Text key={flavor.id} style={styles.flavorSummaryTag}>{flavor.name}</Text>
                      ) : null;
                    })
                  ) : (
                    <Text style={styles.flavorEmptyText}>No disliked flavors yet</Text>
                  )}
                </View>
              </View>
            </View>
          </Card>
        ))}

        {/* About */}
        {renderSection('About', (
          <Card style={styles.infoCard}>
            <Text style={styles.appName}>Savour</Text>
            <Text style={styles.appVersion}>Version 0.2.5.1 (MVP 5)</Text>
            <Text style={styles.appDescription}>
              Your personal kitchen assistant helping you track pantry items,
              log meals, and reduce food waste.
            </Text>
          </Card>
        ))}

        {/* Debug Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderRow}
            onPress={() => setDebugCollapsed(prev => !prev)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Debug</Text>
            <Ionicons
              name={debugCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'}
              size={20}
              color={Colors.textSecondary}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
          {!debugCollapsed && (
            <View>
              {renderDebugToggle('ENABLE_DEBUG', 'Enable Debug Logs', 'Master switch for all debug logs')}
              {renderDebugToggle('LOG_STATE', 'State Logs', 'Log state changes and context updates')}
              {renderDebugToggle('LOG_FILTERS', 'Filter Logs', 'Log filtering operations and results')}
              {renderDebugToggle('LOG_DATES', 'Date Logs', 'Log date calculations and expiry checks')}
              {renderDebugToggle('LOG_UI', 'UI Logs', 'Log UI events and rendering')}
              {renderDebugToggle('LOG_STORAGE', 'Storage Logs', 'Log storage operations and persistence')}
              {renderDebugToggle('LOG_LIFECYCLE', 'Lifecycle Logs', 'Log component mounts/unmounts and lifecycle events')}
            </View>
          )}
        </View>

        {/* Data Management */}
        {renderSection('Data Management', (
          <>
            {renderActionButton(
              'refresh',
              'Reset Default Settings',
              () => {
                Alert.alert(
                  'Reset Settings',
                  'This will restore all default settings. Your data will not be affected.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      onPress: () => {
                        // Reset to defaults
                        setSettings({
                          showExpiryWarnings: true,
                          defaultExpiryDays: Config.app.defaultExpiryDays,
                          enableNotifications: false,
                        });

                        // Clear settings from storage
                        AsyncStorage.removeItem('savour_settings')
                          .catch(error => console.error('Error clearing settings:', error));
                      }
                    }
                  ]
                );
              }
            )}

            {renderActionButton(
              'trash-bin',
              'Clear All Data',
              clearAllData,
              'danger'
            )}
          </>
        ))}

        {/* Attribution */}
        <View style={styles.attribution}>
          <Text style={styles.attributionText}>
            Built with ❤️ by Ryan (Savour Team)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingCard: {
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoCard: {
    alignItems: 'center',
    padding: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  dangerButton: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  dangerLabel: {
    color: Colors.error,
  },
  attribution: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  attributionText: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  // Flavor preferences styles (MVP 4)
  flavorCard: {
    padding: 16,
  },
  flavorSectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  flavorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  flavorNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textTertiary,
    marginBottom: 16,
  },
  flavorSummary: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  flavorSummarySection: {
    marginBottom: 12,
  },
  flavorSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  flavorSummaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flavorSummaryTag: {
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    overflow: 'hidden',
  },
  flavorEmptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textTertiary,
  },
});

export default SettingsScreen;
