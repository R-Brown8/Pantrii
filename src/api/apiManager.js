// Central API manager for all recipe APIs
import { fetchRecipesByIngredient, fetchRecipeById } from './freeApis/theMealDB.js';
import { getCached, setCached } from './apiCache.js';

export async function getRecipesByIngredient(ingredient) {
  const cacheKey = `ingredient:${ingredient}`;
  let recipes = await getCached(cacheKey);
  if (!recipes) {
    recipes = await fetchRecipesByIngredient(ingredient);
    await setCached(cacheKey, recipes);
  }
  return recipes;
}

export async function getRecipeById(id) {
  const cacheKey = `recipe:${id}`;
  let recipe = await getCached(cacheKey);
  if (!recipe) {
    recipe = await fetchRecipeById(id);
    await setCached(cacheKey, recipe);
  }
  return recipe;
}
