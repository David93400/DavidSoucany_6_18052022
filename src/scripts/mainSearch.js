import {
  cleanError,
  createGenericElement,
  normalizeText,
  uniqueArray,
} from './utils/helpers';

export const mainSearch = (recipes, keyword) => {
  let filteredUniqueRecipes = [];
  let newRecipesList = [];
  if (keyword.length === 0) {
    cleanError('.error');
    return;
  }
  if (keyword.length < 3) {
    cleanError('.error');
    const error = createGenericElement('div', '', 'error');
    error.innerText = 'Veuillez entrer au moins 3 caractères';
    document.querySelector('.search-section').appendChild(error);
    return recipes;
  }
  cleanError('.error');
  recipes.forEach((recipe) => {
    if (
      normalizeText(recipe.name).includes(normalizeText(keyword)) ||
      normalizeText(recipe.description).includes(normalizeText(keyword)) ||
      recipe.ingredients.toString().includes(normalizeText(keyword))
    ) {
      newRecipesList.push(recipe);
      filteredUniqueRecipes = uniqueArray(newRecipesList);
    }
  });
  return filteredUniqueRecipes;
};
