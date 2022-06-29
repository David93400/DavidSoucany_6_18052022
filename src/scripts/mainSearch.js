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
  for (let i = 0; i < recipes.length; i++) {
    if (
      customIncludes(normalizeText(recipes[i].name), normalizeText(keyword))
    ) {
      newRecipesList.push(recipes[i]);
    } else if (
      customIncludes(
        normalizeText(recipes[i].description),
        normalizeText(keyword)
      )
    ) {
      newRecipesList.push(recipes[i]);
    } else if (customIncludes(recipes[i].ingredients.toString(), keyword)) {
      newRecipesList.push(recipes[i]);
    }
    filteredUniqueRecipes = uniqueArray(newRecipesList);
  }
  return filteredUniqueRecipes;
};

const customIncludes = (str, search) => {
  return str.indexOf(search) !== -1;
};
