/**
 * Recipe Matching Utilities
 * 
 * This file contains algorithms for matching recipes to available pantry items.
 */

/**
 * Calculate how well each recipe matches with available pantry items
 * @param {Array} recipes - Array of recipe objects
 * @param {Array} pantryItems - Array of pantry item objects
 * @returns {Array} - Recipes with match information, sorted by match percentage
 */
export const calculateRecipeMatches = (recipes, pantryItems) => {
  // Map pantry item names to lowercase for case-insensitive matching
  const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());
  
  return recipes.map(recipe => {
    // Count required ingredients
    const requiredIngredients = recipe.ingredients.filter(ing => ing.required);
    const totalRequiredCount = requiredIngredients.length;
    const totalIngredientCount = recipe.ingredients.length;
    
    // Find available ingredients
    const availableIngredients = recipe.ingredients.filter(
      ingredient => pantryItemNames.includes(ingredient.name.toLowerCase())
    );
    
    // Find available required ingredients
    const availableRequiredIngredients = requiredIngredients.filter(
      ingredient => pantryItemNames.includes(ingredient.name.toLowerCase())
    );
    
    // Calculate match percentages
    const requiredMatchPercentage = totalRequiredCount > 0 
      ? (availableRequiredIngredients.length / totalRequiredCount) * 100 
      : 100;
      
    const totalMatchPercentage = 
      (availableIngredients.length / totalIngredientCount) * 100;
    
    // Find missing ingredients
    const missingIngredients = recipe.ingredients.filter(
      ingredient => !pantryItemNames.includes(ingredient.name.toLowerCase())
    );
    
    return {
      ...recipe,
      matchPercentage: Math.round(totalMatchPercentage),
      requiredMatchPercentage: Math.round(requiredMatchPercentage),
      availableIngredients,
      missingIngredients,
      canMake: requiredMatchPercentage === 100 // Can make if all required ingredients are available
    };
  }).sort((a, b) => {
    // First sort by whether the recipe can be made
    if (a.canMake !== b.canMake) {
      return a.canMake ? -1 : 1;
    }
    
    // Then sort by match percentage
    return b.matchPercentage - a.matchPercentage;
  });
};

/**
 * Prioritize recipes based on expiring ingredients
 * @param {Array} matchedRecipes - Array of recipe objects with match information
 * @param {Array} pantryItems - Array of pantry item objects
 * @returns {Array} - Recipes sorted by priority
 */
export const prioritizeByExpiration = (matchedRecipes, pantryItems) => {
  // Get items close to expiration (within 3 days)
  const expiringItems = pantryItems.filter(item => {
    if (!item.expiry) return false;
    
    const expDate = new Date(item.expiry);
    const today = new Date();
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3 && diffDays >= 0;
  });
  
  // Extract names for comparison
  const expiringItemNames = expiringItems.map(item => item.name.toLowerCase());
  
  // Prioritize recipes using expiring items
  return matchedRecipes.map(recipe => {
    const usesExpiringItems = recipe.availableIngredients.some(
      ingredient => expiringItemNames.includes(ingredient.name.toLowerCase())
    );
    
    // Count how many expiring items this recipe uses
    const expiringItemsUsed = recipe.availableIngredients.filter(
      ingredient => expiringItemNames.includes(ingredient.name.toLowerCase())
    ).length;
    
    return {
      ...recipe,
      usesExpiringItems,
      expiringItemsUsed,
      // Calculate priority score based on match percentage and expiring items
      priorityScore: recipe.matchPercentage + (expiringItemsUsed * 10)
    };
  }).sort((a, b) => {
    // First sort by whether the recipe can be made
    if (a.canMake !== b.canMake) {
      return a.canMake ? -1 : 1;
    }
    
    // Then sort by priority score
    return b.priorityScore - a.priorityScore;
  });
};

/**
 * Weight recipes based on user preferences
 * @param {Array} matchedRecipes - Array of recipe objects with match information
 * @param {Object} preferences - User flavor preferences {likes: [], dislikes: []}
 * @returns {Array} - Recipes sorted by preference-weighted score
 */
export const weightByPreferences = (matchedRecipes, preferences) => {
  if (!preferences || !preferences.likes || !preferences.dislikes) {
    return matchedRecipes;
  }
  
  return matchedRecipes.map(recipe => {
    // Calculate preference match
    const likedFlavors = recipe.flavors?.filter(flavor => 
      preferences.likes.includes(flavor)
    ).length || 0;
    
    const dislikedFlavors = recipe.flavors?.filter(flavor => 
      preferences.dislikes.includes(flavor)
    ).length || 0;
    
    const preferenceScore = (likedFlavors * 10) - (dislikedFlavors * 15);
    
    return {
      ...recipe,
      preferenceScore,
      // Combine with existing scores
      finalScore: (recipe.priorityScore || recipe.matchPercentage) + preferenceScore
    };
  }).sort((a, b) => {
    // First sort by whether the recipe can be made
    if (a.canMake !== b.canMake) {
      return a.canMake ? -1 : 1;
    }
    
    // Then sort by final score
    return b.finalScore - a.finalScore;
  });
};
