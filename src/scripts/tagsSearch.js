import { normalizeText, uniqueArray } from './utils/helpers';

export const tagsSearch = (recipes, tagsArray) => {
  let newRescipesList = [];
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
        normalizeText(recipe.appliance).includes(normalizeText(tag))
      ) {
        newRescipesList.push(recipe);
        filteredRecipes = uniqueArray(newRescipesList);
      }
    });
  });
  if (tagsArray.length > 1) {
    console.log(filteredRecipes);
    tagsArray.forEach((tag) => {
      filteredRecipes.forEach((recipe) => {
        if (
          !normalizeText(recipe.name).includes(normalizeText(tag)) &&
          !normalizeText(recipe.description).includes(normalizeText(tag)) &&
          !recipe.ingredients.toString().includes(normalizeText(tag)) &&
          !normalizeText(recipe.appliance).includes(normalizeText(tag))
        ) {
          filteredRecipes.splice(filteredRecipes.indexOf(recipe), 1);
        }
      });
    });
  }
  return filteredRecipes;
};
