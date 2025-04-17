/**
 * Mock Data for Pantrii App
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
  },
  {
    id: '9',
    name: 'Onion',
    quantity: '3 pieces',
    expiry: getDateString(14),
    categoryId: '1', // Fruits & Vegetables
    notes: 'Yellow'
  },
  {
    id: '10',
    name: 'Garlic',
    quantity: '1 bulb',
    expiry: getDateString(21),
    categoryId: '1', // Fruits & Vegetables
    notes: ''
  },
  {
    id: '11',
    name: 'Olive Oil',
    quantity: '1 bottle',
    expiry: getDateString(180),
    categoryId: '5', // Spices & Condiments
    notes: 'Extra virgin'
  },
  {
    id: '12',
    name: 'Salt',
    quantity: '1 container',
    expiry: getDateString(365),
    categoryId: '5', // Spices & Condiments
    notes: 'Kosher'
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

// Mock recipe data
export const mockRecipes = [
  {
    id: '1',
    title: 'Pasta with Tomato Sauce',
    description: 'A simple and delicious pasta dish with fresh tomato sauce.',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [
      { name: 'Pasta', amount: '1 lb', required: true },
      { name: 'Tomatoes', amount: '4 medium', required: true },
      { name: 'Garlic', amount: '3 cloves', required: false },
      { name: 'Onion', amount: '1 medium', required: false },
      { name: 'Olive Oil', amount: '2 tbsp', required: false },
      { name: 'Salt', amount: 'to taste', required: false },
      { name: 'Black Pepper', amount: 'to taste', required: false },
      { name: 'Basil', amount: '1/4 cup', required: false }
    ],
    instructions: [
      'Bring a large pot of salted water to a boil. Cook pasta according to package directions.',
      'While pasta cooks, heat olive oil in a skillet over medium heat.',
      'Add chopped onion and cook until translucent, about 3 minutes.',
      'Add minced garlic and cook for another minute.',
      'Add chopped tomatoes and cook until they break down, about 10 minutes.',
      'Season with salt and pepper to taste.',
      'Drain pasta and toss with sauce.',
      'Garnish with fresh basil before serving.'
    ],
    imageUrl: 'https://example.com/pasta.jpg',
    tags: ['Italian', 'Vegetarian', 'Easy'],
    flavors: ['savory', 'herb', 'tangy']
  },
  {
    id: '2',
    title: 'Scrambled Eggs',
    description: 'Quick and fluffy scrambled eggs - perfect for breakfast.',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    ingredients: [
      { name: 'Eggs', amount: '4 large', required: true },
      { name: 'Milk', amount: '2 tbsp', required: false },
      { name: 'Salt', amount: 'to taste', required: false },
      { name: 'Black Pepper', amount: 'to taste', required: false },
      { name: 'Butter', amount: '1 tbsp', required: false }
    ],
    instructions: [
      'Crack eggs into a bowl and beat with a fork.',
      'Add milk, salt, and pepper and beat until mixed.',
      'Melt butter in a non-stick pan over medium-low heat.',
      'Pour in egg mixture and let it sit for about 30 seconds.',
      'Gently stir and fold the eggs with a spatula until they are just set but still moist.',
      'Remove from heat and serve immediately.'
    ],
    imageUrl: 'https://example.com/eggs.jpg',
    tags: ['Breakfast', 'Quick', 'Protein-rich'],
    flavors: ['savory', 'rich', 'mild']
  },
  {
    id: '3',
    title: 'Chicken Rice Bowl',
    description: 'A satisfying bowl of rice topped with seasoned chicken and vegetables.',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: [
      { name: 'Chicken Breast', amount: '1 lb', required: true },
      { name: 'Rice', amount: '2 cups', required: true },
      { name: 'Onion', amount: '1 medium', required: false },
      { name: 'Garlic', amount: '2 cloves', required: false },
      { name: 'Olive Oil', amount: '2 tbsp', required: false },
      { name: 'Salt', amount: 'to taste', required: false },
      { name: 'Black Pepper', amount: 'to taste', required: false }
    ],
    instructions: [
      'Cook rice according to package directions.',
      'Dice chicken breast into small cubes.',
      'Heat olive oil in a large skillet over medium-high heat.',
      'Add chicken and cook until no longer pink, about 5-7 minutes.',
      'Add diced onion and minced garlic, cook for another 3-4 minutes.',
      'Season with salt and pepper to taste.',
      'Serve chicken over cooked rice.',
      'Optionally garnish with chopped green onions or herbs.'
    ],
    imageUrl: 'https://example.com/chicken-rice.jpg',
    tags: ['Dinner', 'High-protein', 'Meal prep'],
    flavors: ['savory', 'herb', 'umami']
  },
  {
    id: '4',
    title: 'Apple Cinnamon Oatmeal',
    description: 'Warm and comforting breakfast oatmeal with fresh apples and cinnamon.',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    ingredients: [
      { name: 'Apples', amount: '1 medium', required: true },
      { name: 'Milk', amount: '1 cup', required: true },
      { name: 'Rolled Oats', amount: '1 cup', required: true },
      { name: 'Cinnamon', amount: '1 tsp', required: false },
      { name: 'Honey', amount: '2 tbsp', required: false },
      { name: 'Salt', amount: 'pinch', required: false }
    ],
    instructions: [
      'Dice the apple into small cubes.',
      'In a saucepan, bring milk and a pinch of salt to a simmer over medium heat.',
      'Stir in oats and reduce heat to medium-low.',
      'Cook for about 5 minutes, stirring occasionally.',
      'Add diced apples and cinnamon, cook for another 2-3 minutes.',
      'Remove from heat, cover, and let stand for 2 minutes.',
      'Drizzle with honey before serving.'
    ],
    imageUrl: 'https://example.com/oatmeal.jpg',
    tags: ['Breakfast', 'Vegetarian', 'Healthy'],
    flavors: ['sweet', 'spiced', 'fruity']
  },
  {
    id: '5',
    title: 'Simple Green Salad',
    description: 'A refreshing green salad that makes a perfect side dish or light meal.',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    ingredients: [
      { name: 'Lettuce', amount: '1 head', required: true },
      { name: 'Tomatoes', amount: '2 medium', required: false },
      { name: 'Olive Oil', amount: '2 tbsp', required: true },
      { name: 'Lemon Juice', amount: '1 tbsp', required: false },
      { name: 'Salt', amount: 'to taste', required: false },
      { name: 'Black Pepper', amount: 'to taste', required: false }
    ],
    instructions: [
      'Wash and dry lettuce leaves, then tear into bite-sized pieces.',
      'Slice tomatoes into wedges or dice them, as preferred.',
      'In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.',
      'Combine lettuce and tomatoes in a large bowl.',
      'Drizzle with dressing and toss gently to coat.',
      'Serve immediately.'
    ],
    imageUrl: 'https://example.com/salad.jpg',
    tags: ['Salad', 'Vegetarian', 'Quick', 'Healthy'],
    flavors: ['fresh', 'tangy', 'light']
  }
];
