import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import { createGenericElement, customFetch } from '../utils/helpers';
import '../../css/home.css';
import { recipesConstants } from '../constant';
import {
  cleanRecipesCard,
  displaySelectSection,
  handleArrow,
  mainSearch,
  setInputFilter,
  setOptionList,
  setTags,
} from '../utils/filter';

async function getRecipes() {
  const data = await customFetch('./data/recipes.json');

  return data;
}

async function displayRecipes(recipes) {
  const recipesSection = document.querySelector('.recipes-section');
  if (!recipes) {
    return;
  }
  recipes.forEach(async (recipe) => {
    const recipeModel = await recipesFactory(recipe);
    const recipeCard = recipeModel.getRecipeCardDOM();
    recipesSection.appendChild(recipeCard);
  });
}

export const displayInputOption = (recipes, type) => {
  const input = document.querySelector(`.input-${type.type}`);
  // placeholder management
  input.addEventListener('focusin', () => {
    input.setAttribute('placeholder', `Rechercher ${type.wording}`);
  });
  input.addEventListener('focusout', () => {
    input.setAttribute('placeholder', `${type.wording}`);
  });
  toggleOptionList(recipes, type);
};

const toggleOptionList = (recipes, type) => {
  const category = type.type;
  const input = document.querySelector(`.input-${category}`);
  const closeBtn = document.querySelector(`.${category}-chevron-down`);
  input.addEventListener('focus', () => {
    setOptionList(recipes, category);
    setTags(category);
  });
  closeBtn.addEventListener('click', () => {
    const arrowUp = document.querySelector(`.fa-chevron-up`);
    arrowUp ? handleArrow(arrowUp, 'fa-chevron-up', 'fa-chevron-down') : null;
    const listContainer = document.querySelector(`.list-container`);
    listContainer && listContainer.remove();
  });
};

const searchSection = document.querySelector('.search-section');
const inputSection = createGenericElement('div', '', 'input-section');
const tagSection = createGenericElement('div', '', 'tag-section');
const searchBar = createGenericElement('input', '', 'search-bar', [
  { name: 'type', value: 'text' },
  { name: 'placeholder', value: 'Rechercher une recette' },
  { name: 'id', value: 'search-bar' },
]);

searchSection.appendChild(searchBar);

recipesConstants.map((type) => {
  const inputContainer = setInputFilter(type);
  return inputSection.appendChild(inputContainer);
});

searchSection.append(tagSection, inputSection);

export default async function init() {
  const { recipes } = await getRecipes();
  let filteredRecipes;
  const searchInput = document.querySelector('.search-bar');
  searchInput.addEventListener('input', (e) => {
    //todo function to avoid dry mapping
    filteredRecipes = mainSearch(recipes, e.target.value);
    displaySelectSection(recipesConstants, filteredRecipes);

    cleanRecipesCard();
    displayRecipes(filteredRecipes);
  });
  if (!searchInput.value) {
    displaySelectSection(recipesConstants, recipes);
    displayRecipes(recipes);
  }
}

init();
