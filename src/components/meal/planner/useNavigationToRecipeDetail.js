import { useNavigation } from '@react-navigation/native';

/**
 * Custom hook to navigate to RecipeDetailScreen with the given meal/plan object.
 * Falls back to just meal name if no full recipe object is available.
 */
export default function useNavigationToRecipeDetail() {
  const navigation = useNavigation();

  /**
   * Navigate to RecipeDetailScreen
   * @param {object} plan - The meal plan object (should have at least meal name)
   */
  function goToRecipeDetail(plan) {
    navigation.navigate('RecipeDetail', {
      recipe: plan.recipe || { name: plan.meal, ingredients: plan.ingredients }
    });
  }

  return goToRecipeDetail;
}
