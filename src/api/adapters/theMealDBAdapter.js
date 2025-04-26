// Adapter to normalize TheMealDB recipe data to app's format
export function normalizeMealDBRecipe(meal) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    area: meal.strArea,
    instructions: Array.isArray(meal.strInstructions)
      ? meal.strInstructions
      : (typeof meal.strInstructions === 'string' && meal.strInstructions.trim())
        ? meal.strInstructions.split(/\r?\n|\.\s+/).map(step => step.trim()).filter(Boolean)
        : [],
    thumbnail: meal.strMealThumb,
    tags: meal.strTags ? meal.strTags.split(',') : [],
    youtube: meal.strYoutube,
    ingredients: extractIngredients(meal),
    _rawMeal: meal,
  };
}

function extractIngredients(meal) {
  // TheMealDB uses strIngredient1...strIngredient20
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }
  return ingredients;
}
