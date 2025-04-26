// TheMealDB API integration
import { normalizeMealDBRecipe } from '../adapters/theMealDBAdapter.js';

const THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchRecipesByIngredient(ingredient) {
  console.log('[theMealDB] fetchRecipesByIngredient called with:', ingredient, 'type:', typeof ingredient);
  const url = `${THEMEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.meals) return [];

  // Fetch full details for each recipe in parallel
  const detailedRecipes = await Promise.all(
    data.meals.map(async (summary) => {
      const detailUrl = `${THEMEALDB_BASE_URL}/lookup.php?i=${summary.idMeal}`;
      const detailResponse = await fetch(detailUrl);
      const detailData = await detailResponse.json();
      if (detailData.meals && detailData.meals.length > 0) {
        return normalizeMealDBRecipe(detailData.meals[0]);
      } else {
        // Fallback to summary if detail fetch fails
        return normalizeMealDBRecipe(summary);
      }
    })
  );
  return detailedRecipes;
}

export async function fetchRecipeById(id) {
  const url = `${THEMEALDB_BASE_URL}/lookup.php?i=${id}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.meals && data.meals.length > 0 ? normalizeMealDBRecipe(data.meals[0]) : null;
}
