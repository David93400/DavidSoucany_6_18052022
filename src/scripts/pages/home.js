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
const searchBar = createGenericElement('input', '', 'search-bar', [
  { name: 'type', value: 'text' },
  { name: 'placeholder', value: 'Rechercher une recette' },
  { name: 'id', value: 'search-bar' },
]);
document.querySelector('.search-section').appendChild(searchBar);
export default async function init() {
  const { recipes } = await getRecipes();
  displayRecipes(recipes);
}

init();
