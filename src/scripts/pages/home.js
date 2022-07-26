import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import { createGenericElement, customFetch } from '../utils/helpers';
import '../../css/home.css';
import { recipesConstants } from '../constant';
import {
  closeOptionList,
  displaySelectSection,
  handleArrow,
  mainSearch,
  setInputFilter,
  setOptionList,
  setTags,
} from '../utils/filter';

let tagsArray = [];

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
  const openBtn = document.querySelector(`.${category}-chevron-down`);
  const input = document.querySelector(`.input-${category}`);
  input.addEventListener('focus', () => {
    openBtn &&
      (handleArrow(openBtn, `fa-chevron-down`, `fa-chevron-up`),
      handleArrow(
        openBtn,
        `${category}-chevron-down`,
        `${category}-chevron-up`
      ));
    setOptionList(recipes, category);
    tagsArray.push(setTags(category));
    closeOptionList(category);
  });
  openBtn.addEventListener('click', () => {
    // écouter sur la div parente (.input-ingredient-container), si <i> arrow down => open else close list
    const listContainer = document.querySelector(`.${category}-list`);
    if (!listContainer) {
      console.log('open');
      handleArrow(
        openBtn,
        `${category}-chevron-down`,
        `${category}-chevron-up`
      );
      handleArrow(openBtn, `fa-chevron-down`, `fa-chevron-up`);
      setOptionList(recipes, category);
      setTags(category);
    }
    closeOptionList(category);
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
  // for testing
  document.querySelector('.logo').addEventListener('click', () => {
    console.log(tagsArray.flat());
  });
  searchInput.addEventListener('input', (e) => {
    //todo function to avoid dry mapping
    filteredRecipes = mainSearch(recipes, e.target.value);
    // refiltrer avec les tags ici
    displaySelectSection(recipesConstants, filteredRecipes);
    displayRecipes(filteredRecipes);
  });
  if (!searchInput.value) {
    displaySelectSection(recipesConstants, recipes);
    displayRecipes(recipes);
  }
}

init();
