import { normalizeText, uniqueArray } from './utils/helpers';

export const tagsSearch = (recipes, tagsArray) => {
  let newRecipesList = [];
  let filteredRecipes = [];
  if (tagsArray.length === 0) {
    return recipes;
  }
  tagsArray.forEach((tag) => {
    recipes.forEach((recipe) => {
      if (
        normalizeText(recipe.name).includes(normalizeText(tag)) ||
        normalizeText(recipe.description).includes(normalizeText(tag)) ||
        recipe.ingredients.toString().includes(normalizeText(tag)) ||
        normalizeText(recipe.appliance).includes(normalizeText(tag)) ||
        normalizeText(recipe.ustensils.toString()).includes(normalizeText(tag))
      ) {
        newRecipesList.push(recipe);
        filteredRecipes = uniqueArray(newRecipesList);
      }
    });
  });
  if (tagsArray.length > 1) {
    tagsArray.forEach((tag) => {
      filteredRecipes.forEach((recipe) => {
        if (
          !normalizeText(recipe.name).includes(normalizeText(tag)) &&
          !normalizeText(recipe.description).includes(normalizeText(tag)) &&
          !recipe.ingredients.toString().includes(normalizeText(tag)) &&
          !normalizeText(recipe.appliance).includes(normalizeText(tag)) &&
          !normalizeText(recipe.ustensils.toString()).includes(
            normalizeText(tag)
          )
        ) {
          filteredRecipes.splice(filteredRecipes.indexOf(recipe), 1);
        }
      });
    });
  }
  return filteredRecipes;
};
