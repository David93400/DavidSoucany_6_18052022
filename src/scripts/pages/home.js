import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import {
  createGenericElement,
  customFetch,
  recipesConstants,
} from '../utils/helpers';
import '../../css/home.css';
recipesConstants.forEach((type) => {
  console.log(type);
});
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
const getList = (recipes, type) => {
  console.log(type);
  const list = recipes.reduce((acc, recipe) => {
    if (type === 'appliance') {
      if (!acc.includes(recipe[type])) {
        acc.push(recipe[type]);
      }
      return acc;
    }
    recipe[type].forEach((option) => {
      if (!acc.includes(option.ingredient || option)) {
        acc.push(option.ingredient || option);
      }
    });
    return acc;
  }, []);
  list.forEach((option) => {
    const selectOption = createGenericElement('option', option);
    document.querySelector(`.select-${type}`).appendChild(selectOption);
  }, []);
  return list;
};

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
const selectAppareils = createGenericElement('select', '', 'select-appliance');
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
  recipesConstants.map((type) => getList(recipes, type));
  displayRecipes(recipes);
}

init();
