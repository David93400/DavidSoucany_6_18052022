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
import { tagsSearch } from '../tagsSearch';

let tagsArray = [];

async function getRecipes() {
  const data = await customFetch('./data/recipes.json');

  return data;
}

async function displayRecipes(recipes) {
  const recipesSection = document.querySelector('.recipes-section');
  recipesSection ? (recipesSection.innerHTML = '') : null;
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
  const input = document.querySelector(`.input-${category}-container`);

  input.addEventListener('click', () => {
    const arrowBtn = input.children.item(1);
    const arrowUp = document.querySelector('.fa-chevron-up');
    if (arrowBtn.classList.contains('fa-chevron-down')) {
      handleArrow(arrowBtn, `fa-chevron-down`, `fa-chevron-up`);
      arrowUp ? handleArrow(arrowUp, `fa-chevron-up`, `fa-chevron-down`) : null;
      setOptionList(recipes, category);
      tagsArray.push(setTags(category));
    } else {
      handleArrow(arrowBtn, `fa-chevron-up`, `fa-chevron-down`);
      closeOptionList(category);
    }
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
  let filteredRecipesWithInput;
  let filteredRecipesWithTags = [];
  const searchInput = document.querySelector('.search-bar');

  // for testing
  document.querySelector('.logo').addEventListener('click', () => {
    if (tagsArray.length > 0) {
      // vérifier si tagsArray est vide, si oui, filtrer avec recipes et si non, filtrer avec filteredRecipesWithTags
      filteredRecipesWithTags = tagsSearch(recipes, tagsArray.flat());
      console.log(filteredRecipesWithTags);
      // intégrer displaySelectSection(filteredRecipesWithTags)
      displayRecipes(filteredRecipesWithTags);
    }
    console.log('tagArrays', tagsArray.flat());
  });
  // for testing

  searchInput.addEventListener('input', (e) => {
    filteredRecipesWithInput = mainSearch(recipes, e.target.value);
    // refiltrer avec les tags ici
    filteredRecipesWithTags = tagsSearch(filteredRecipesWithInput, tagsArray);
    displaySelectSection(recipesConstants, filteredRecipesWithTags);
    displayRecipes(filteredRecipesWithTags);
  });
  if (!searchInput.value) {
    displaySelectSection(recipesConstants, recipes);
    displayRecipes(recipes);
  }
}

init();
