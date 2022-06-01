import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import {
  createGenericElement,
  customFetch,
  recipesConstants,
} from '../utils/helpers';
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
const getList = (recipes, type) => {
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
const tagSection = createGenericElement('div', '', 'tag-section');
const searchBar = createGenericElement('input', '', 'search-bar', [
  { name: 'type', value: 'text' },
  { name: 'placeholder', value: 'Rechercher une recette' },
  { name: 'id', value: 'search-bar' },
]);
searchSection.appendChild(searchBar);

const selectIngredients = createGenericElement(
  'select',
  '',
  'select-ingredients',
  [{ name: 'id', value: 'Ingrédients' }]
);
const selectAppareils = createGenericElement('select', '', 'select-appliance', [
  { name: 'id', value: 'Appareils' },
]);
const selectUtensils = createGenericElement('select', '', 'select-ustensils', [
  { name: 'id', value: 'Ustensiles' },
]);

selectSection.appendChild(selectIngredients);
selectSection.appendChild(selectAppareils);
selectSection.appendChild(selectUtensils);
searchSection.appendChild(tagSection);
searchSection.appendChild(selectSection);
selectIngredients.appendChild(selectIngredientsDisplay);
selectAppareils.appendChild(selectAppareilsDisplay);
selectUtensils.appendChild(selectUtensilsDisplay);
const selects = [selectIngredients, selectAppareils, selectUtensils];

const setTags = (selectType) => {
  selectType.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value === selectType.id) {
      return;
    }
    const closeTag = createGenericElement('div', 'X', 'close-tag');
    const tag = createGenericElement(
      'div',
      '',
      `${selectType.className}-tag tag`,
      [{ name: 'id', value: `${e.target.value}` }]
    );
    tag.appendChild(closeTag);
    tagSection.appendChild(tag);
    tag.textContent = value;
  });
};

export default async function init() {
  const { recipes } = await getRecipes();
  recipesConstants.map((type) => getList(recipes, type));
  selects.map((selectType) => setTags(selectType));
  displayRecipes(recipes);
}

init();
