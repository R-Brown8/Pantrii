/**
 * Flavor Utilities
 * 
 * Functions for analyzing ingredients and determining flavor profiles.
 * Used for automatic flavor detection when logging meals (MVP 4+).
 */

// Ingredient to flavor mapping database
// This is a simplified version - a real implementation would have a more comprehensive database
const ingredientFlavorMap = {
  // Sweet ingredients
  'sugar': ['sweet'],
  'honey': ['sweet', 'aromatic'],
  'maple syrup': ['sweet'],
  'banana': ['sweet'],
  'apple': ['sweet', 'sour'],
  'orange': ['sweet', 'sour', 'tangy'],
  'chocolate': ['sweet', 'bitter'],
  'cinnamon': ['sweet', 'aromatic'],
  'vanilla': ['sweet', 'aromatic'],
  
  // Salty ingredients
  'salt': ['salty'],
  'soy sauce': ['salty', 'umami'],
  'fish sauce': ['salty', 'umami'],
  'olives': ['salty', 'bitter'],
  'bacon': ['salty', 'smoky', 'umami'],
  'cheese': ['salty', 'umami', 'creamy'],
  'parmesan': ['salty', 'umami'],
  
  // Sour ingredients
  'lemon': ['sour', 'tangy'],
  'lime': ['sour', 'tangy'],
  'vinegar': ['sour', 'tangy'],
  'yogurt': ['sour', 'creamy'],
  'buttermilk': ['sour', 'creamy'],
  'sour cream': ['sour', 'creamy'],
  'tomato': ['sour', 'umami'],
  
  // Bitter ingredients
  'coffee': ['bitter', 'aromatic'],
  'dark chocolate': ['bitter', 'sweet'],
  'cocoa': ['bitter'],
  'kale': ['bitter'],
  'arugula': ['bitter'],
  'grapefruit': ['bitter', 'sour'],
  
  // Umami ingredients
  'mushroom': ['umami'],
  'tomato': ['umami', 'sour'],
  'miso': ['umami', 'salty'],
  'soy sauce': ['umami', 'salty'],
  'beef': ['umami'],
  'pork': ['umami'],
  'chicken': ['umami'],
  'fish': ['umami'],
  'seaweed': ['umami'],
  
  // Spicy ingredients
  'chili': ['spicy'],
  'pepper': ['spicy'],
  'hot sauce': ['spicy', 'tangy'],
  'jalapeno': ['spicy'],
  'cayenne': ['spicy'],
  'wasabi': ['spicy'],
  'horseradish': ['spicy'],
  'ginger': ['spicy', 'aromatic'],
  
  // Aromatic ingredients
  'basil': ['aromatic'],
  'rosemary': ['aromatic'],
  'thyme': ['aromatic'],
  'mint': ['aromatic', 'cooling'],
  'garlic': ['aromatic', 'pungent'],
  'onion': ['aromatic', 'pungent'],
  'truffle': ['aromatic', 'umami'],
  
  // Creamy ingredients
  'milk': ['creamy'],
  'cream': ['creamy'],
  'coconut milk': ['creamy', 'sweet'],
  'butter': ['creamy', 'rich'],
  'avocado': ['creamy'],
  'cream cheese': ['creamy', 'tangy'],
  
  // Smoky ingredients
  'smoked paprika': ['smoky'],
  'smoked salt': ['smoky', 'salty'],
  'smoked cheese': ['smoky', 'umami', 'creamy'],
  'bacon': ['smoky', 'salty', 'umami'],
  'chipotle': ['smoky', 'spicy'],
  
  // Tangy ingredients
  'pickles': ['tangy', 'sour'],
  'sauerkraut': ['tangy', 'sour'],
  'kimchi': ['tangy', 'spicy', 'umami'],
  'mustard': ['tangy', 'pungent'],
  'tamarind': ['tangy', 'sour', 'sweet'],
  'balsamic vinegar': ['tangy', 'sweet'],
};

/**
 * Detects flavor profiles based on ingredients list
 * 
 * @param {string[]} ingredients - Array of ingredient names
 * @returns {object} Object with detected flavors and their confidence scores
 */
export const detectFlavorsFromIngredients = (ingredients) => {
  // Initialize counters for each flavor category
  const flavorCounts = {};
  let totalMatches = 0;
  
  // Process each ingredient
  ingredients.forEach(ingredient => {
    // Convert to lowercase for matching
    const ingredientLower = ingredient.toLowerCase().trim();
    
    // Look for exact matches
    if (ingredientFlavorMap[ingredientLower]) {
      const flavors = ingredientFlavorMap[ingredientLower];
      flavors.forEach(flavor => {
        flavorCounts[flavor] = (flavorCounts[flavor] || 0) + 1;
        totalMatches++;
      });
      return;
    }
    
    // Look for partial matches (ingredients that contain this word)
    Object.keys(ingredientFlavorMap).forEach(mappedIngredient => {
      if (ingredientLower.includes(mappedIngredient) || 
          mappedIngredient.includes(ingredientLower)) {
        const flavors = ingredientFlavorMap[mappedIngredient];
        flavors.forEach(flavor => {
          // Partial matches get a lower weight (0.5)
          flavorCounts[flavor] = (flavorCounts[flavor] || 0) + 0.5;
          totalMatches += 0.5;
        });
      }
    });
  });
  
  // No matches found
  if (totalMatches === 0) {
    return { 
      detectedFlavors: [],
      confidence: 0
    };
  }
  
  // Convert counts to confidence scores (0-1 scale)
  const flavorConfidence = {};
  Object.keys(flavorCounts).forEach(flavor => {
    flavorConfidence[flavor] = flavorCounts[flavor] / (ingredients.length || 1);
  });
  
  // Sort flavors by confidence
  const sortedFlavors = Object.keys(flavorConfidence)
    .sort((a, b) => flavorConfidence[b] - flavorConfidence[a]);
  
  // Return top flavors (confidence > 0.2)
  const detectedFlavors = sortedFlavors
    .filter(flavor => flavorConfidence[flavor] >= 0.2);
  
  // Overall confidence in detection
  const avgConfidence = detectedFlavors.reduce(
    (sum, flavor) => sum + flavorConfidence[flavor], 0
  ) / (detectedFlavors.length || 1);
  
  return {
    detectedFlavors,
    flavorConfidence,
    confidence: avgConfidence
  };
};

/**
 * Suggests flavor tags based on ingredients
 * 
 * @param {string[]} ingredients - Array of ingredient names
 * @param {number} maxSuggestions - Maximum number of suggestions (default: 3)
 * @returns {string[]} Array of flavor IDs to suggest
 */
export const suggestFlavorTags = (ingredients, maxSuggestions = 3) => {
  const { detectedFlavors } = detectFlavorsFromIngredients(ingredients);
  return detectedFlavors.slice(0, maxSuggestions);
};
