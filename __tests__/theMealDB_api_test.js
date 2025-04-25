// theMealDB_api_test.mjs

import { getRecipesByIngredient } from '../src/api/apiManager.js';

(async () => {
  try {
    const ingredient = 'chicken';
    const recipes = await getRecipesByIngredient(ingredient);
    console.log('Recipes fetched for ingredient:', ingredient);
    if (recipes.length > 0) {
      recipes.forEach((recipe, i) => {
        console.log(`Recipe #${i+1} (normalized):`, recipe);
        console.log(`  recipe.name:`, recipe.name);
        if (recipe._rawMeal) {
          console.log(`  _rawMeal.strMeal:`, recipe._rawMeal.strMeal);
          console.log(`Raw meal for Recipe #${i+1}:`, recipe._rawMeal);
        }
      });
    } else {
      console.log('No recipes returned.');
    }
  } catch (err) {
    console.error('Error fetching recipes from TheMealDB:', err);
  }
})();