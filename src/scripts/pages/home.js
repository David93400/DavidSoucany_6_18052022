import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import { createGenericElement, customFetch } from '../utils/helpers';
import '../../css/home.css';

async function getRecipes() {
  const data = await customFetch('./data/recipes.json');
  console.log(data.recipes);
  return data;
}

async function displayRecipes(recipes) {
  const recipesSection = document.querySelector('.recipes-section');
  recipes.forEach((recipe) => {
    const recipeModel = recipesFactory(recipe);
    const recipeCard = recipeModel.getRecipeCardDOM();
    recipesSection.appendChild(recipeCard);
  });
}
async function getIngredientsList(recipes) {
  const ingredientsList = recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!acc.includes(ingredient.ingredient)) {
        acc.push(ingredient.ingredient);
      }
    });
    return acc;
  }, []);
  ingredientsList.forEach((ingredient) => {
    const selectIngredientsOption = createGenericElement('option', ingredient);
    document
      .querySelector('.select-ingredients')
      .appendChild(selectIngredientsOption);
  }, []);
  return ingredientsList;
}
async function getAppareilsList(recipes) {
  const appareilsList = recipes.reduce((acc, recipe) => {
    if (!acc.includes(recipe.appliance)) {
      acc.push(recipe.appliance);
    }
    return acc;
  }, []);
  appareilsList.forEach((appareil) => {
    const selectAppareilsOption = createGenericElement('option', appareil);
    document
      .querySelector('.select-appareils')
      .appendChild(selectAppareilsOption);
  }, []);
  return appareilsList;
}
async function getUstensilsList(recipes) {
  const ustensilsList = recipes.reduce((acc, recipe) => {
    if (!acc.includes(recipe.ustensils)) {
      acc.push(recipe.ustensils);
    }
    return acc;
  }, []);
  ustensilsList.forEach((ustensil) => {
    const selectUstensilsOption = createGenericElement('option', ustensil);
    document
      .querySelector('.select-ustensils')
      .appendChild(selectUstensilsOption);
  }, []);
  return ustensilsList;
}
const selectIngredientsDisplay = createGenericElement('option', 'Ingrédients');
const selectAppareilsDisplay = createGenericElement('option', 'Appareils');
const selectUtensilsDisplay = createGenericElement('option', 'Ustensiles');

const searchSection = document.querySelector('.search-section');
const selectSection = createGenericElement('div', '', 'select-section');
const searchBar = createGenericElement('input', '', 'search-bar', [
  { name: 'type', value: 'text' },
  { name: 'placeholder', value: 'Rechercher une recette' },
  { name: 'id', value: 'search-bar' },
]);
searchSection.appendChild(searchBar);

const selectIngredients = createGenericElement(
  'select',
  '',
  'select-ingredients'
);
const selectAppareils = createGenericElement('select', '', 'select-appareils');
const selectUtensils = createGenericElement('select', '', 'select-ustensils');
selectSection.appendChild(selectIngredients);
selectSection.appendChild(selectAppareils);
selectSection.appendChild(selectUtensils);
searchSection.appendChild(selectSection);
selectIngredients.appendChild(selectIngredientsDisplay);
selectAppareils.appendChild(selectAppareilsDisplay);
selectUtensils.appendChild(selectUtensilsDisplay);

export default async function init() {
  const { recipes } = await getRecipes();
  getIngredientsList(recipes);
  getAppareilsList(recipes);
  getUstensilsList(recipes);
  displayRecipes(recipes);
}

init();
