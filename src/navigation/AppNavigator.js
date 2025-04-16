/**
 * AppNavigator
 * 
 * Main navigation configuration for the app.
 * Implements a tab-based navigation structure.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

// Import screens
import PantryScreen from '../screens/PantryScreen';
import LogMealScreen from '../screens/LogMealScreen';
import MealHistoryScreen from '../screens/MealHistoryScreen';
import MealPlanScreen from '../screens/MealPlanScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Create tab navigator
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // Get the safe area insets
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Map routes to icon names
          let iconName;
          
          if (route.name === 'Pantry') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Log Meal') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Meal History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Meal Plan') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: true,
        headerTitleAlign: 'left',
        headerStyle: {
          height: 60,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerTintColor: Colors.textPrimary,
        // Ensure padding for status bar on Android
        headerStatusBarHeight: insets.top > 0 ? insets.top : 40,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Pantry" 
        component={PantryScreen}
        options={{
          title: 'Your Pantry'
        }}
      />
      <Tab.Screen 
        name="Log Meal" 
        component={LogMealScreen}
        options={{
          title: 'Log Meal'
        }}
      />
      <Tab.Screen 
        name="Meal History" 
        component={MealHistoryScreen}
        options={{
          title: 'Meal History'
        }}
      />
      <Tab.Screen 
        name="Meal Plan" 
        component={MealPlanScreen}
        options={{
          title: 'Meal Planner'
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings'
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
