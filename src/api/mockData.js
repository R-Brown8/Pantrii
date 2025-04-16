/**
 * Mock Data for FlavorMind App
 * 
 * This file provides sample data for development and testing when
 * the app is used without a backend connection.
 */

// Generate a date string X days from now
const getDateString = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Mock pantry items
export const MOCK_PANTRY_ITEMS = [
  {
    id: '1',
    name: 'Apples',
    quantity: '5 pieces',
    expiry: getDateString(7),
    categoryId: '1', // Fruits & Vegetables
    notes: 'Organic Honeycrisp'
  },
  {
    id: '2',
    name: 'Milk',
    quantity: '1 gallon',
    expiry: getDateString(4),
    categoryId: '3', // Dairy & Eggs
    notes: '2% fat'
  },
  {
    id: '3',
    name: 'Chicken Breast',
    quantity: '2 lbs',
    expiry: getDateString(-1), // Expired
    categoryId: '2', // Meat & Seafood
    notes: 'In freezer'
  },
  {
    id: '4',
    name: 'Rice',
    quantity: '3 cups',
    expiry: getDateString(90),
    categoryId: '4', // Grains & Pasta
    notes: 'Basmati'
  },
  {
    id: '5',
    name: 'Tomatoes',
    quantity: '4 pieces',
    expiry: getDateString(2), // Expiring soon
    categoryId: '1', // Fruits & Vegetables
    notes: 'Roma'
  },
  {
    id: '6',
    name: 'Eggs',
    quantity: '10 pieces',
    expiry: getDateString(14),
    categoryId: '3', // Dairy & Eggs
    notes: 'Large, free-range'
  },
  {
    id: '7',
    name: 'Black Pepper',
    quantity: '1 jar',
    expiry: getDateString(180),
    categoryId: '5', // Spices & Condiments
    notes: 'Ground'
  },
  {
    id: '8',
    name: 'Pasta',
    quantity: '1 box',
    expiry: getDateString(120),
    categoryId: '4', // Grains & Pasta
    notes: 'Penne'
  }
];

// Mock meal history
export const MOCK_MEALS = [
  {
    id: '1',
    name: 'Chicken Stir-Fry',
    date: getDateString(-2),
    ingredients: ['Chicken Breast', 'Rice', 'Bell Peppers', 'Soy Sauce'],
    notes: 'Added extra ginger'
  },
  {
    id: '2',
    name: 'Omelette',
    date: getDateString(-1),
    ingredients: ['Eggs', 'Cheese', 'Spinach', 'Mushrooms'],
    notes: 'Breakfast for dinner'
  },
  {
    id: '3',
    name: 'Pasta with Marinara',
    date: getDateString(-3),
    ingredients: ['Pasta', 'Tomatoes', 'Garlic', 'Basil'],
    notes: 'Used fresh tomatoes from garden'
  }
];

// Mock pantry categories
export const MOCK_CATEGORIES = [
  { id: '1', name: 'Fruits & Vegetables', icon: 'leaf' },
  { id: '2', name: 'Meat & Seafood', icon: 'fish' },
  { id: '3', name: 'Dairy & Eggs', icon: 'egg' },
  { id: '4', name: 'Grains & Pasta', icon: 'basket' },
  { id: '5', name: 'Spices & Condiments', icon: 'flask' },
  { id: '6', name: 'Snacks', icon: 'pizza' },
  { id: '7', name: 'Beverages', icon: 'wine' },
  { id: '8', name: 'Other', icon: 'archive' }
];
