import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import { customFetch } from '../utils/helpers';
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

export default async function init() {
  const { recipes } = await getRecipes();
  displayRecipes(recipes);
}

init();
