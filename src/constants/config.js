/**
 * Application Configuration
 * 
 * This file contains global configuration settings for the app.
 * Centralizing configuration helps with maintenance and updates.
 */

const Config = {
  // API configuration
  api: {
    baseUrl: 'https://api.example.com/v1',
    timeout: 10000, // Request timeout in ms
    useMockData: true, // Use mock data instead of real API
  },
  
  // App behavior settings
  app: {
    defaultExpiryDays: 14, // Default expiry period for pantry items (days)
    expiryWarningDays: 3,  // Days before expiry to show warning
    maxPantryItems: 200,   // Maximum number of pantry items to store
  },
  
  // Feature flags
  features: {
    enableNotifications: false,
    enableOfflineMode: true,
    enableItemCategories: true,
  },
  
  // Storage keys (used with AsyncStorage)
  storage: {
    pantryItems: 'savour_pantry_items',
    mealHistory: 'savour_meal_history',
    mealPlans: 'savour_meal_plans',
    userPreferences: 'savour_user_preferences',
    flavorProfile: 'savour_flavor_profile',
  },
  
  // Flavor categories for MVP 4
  flavors: {
    categories: [
      { id: 'sweet', name: 'Sweet', description: 'Sugar, honey, fruits' },
      { id: 'salty', name: 'Salty', description: 'Sea salt, soy sauce' },
      { id: 'sour', name: 'Sour', description: 'Citrus, vinegar, yogurt' },
      { id: 'bitter', name: 'Bitter', description: 'Coffee, dark chocolate, leafy greens' },
      { id: 'umami', name: 'Umami', description: 'Mushrooms, aged cheese, soy' },
      { id: 'spicy', name: 'Spicy', description: 'Chili peppers, ginger, horseradish' },
      { id: 'aromatic', name: 'Aromatic', description: 'Herbs, spices, vanilla' },
      { id: 'creamy', name: 'Creamy', description: 'Milk, coconut, avocado' },
      { id: 'smoky', name: 'Smoky', description: 'Smoked paprika, grilled foods' },
      { id: 'tangy', name: 'Tangy', description: 'Pickled foods, fermented foods' },
    ]
  },
};

export default Config;
