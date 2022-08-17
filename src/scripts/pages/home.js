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

export async function displayRecipes(recipes) {
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

export const displayInputOption = (recipes, type, tagsArray) => {
  const input = document.querySelector(`.input-${type.type}`);
  input.addEventListener('focusin', () => {
    input.setAttribute('placeholder', `Rechercher ${type.wording}`);
  });
  input.addEventListener('focusout', () => {
    input.setAttribute('placeholder', `${type.wording}`);
  });
  toggleOptionList(recipes, type, tagsArray);
};

export const toggleOptionList = (recipes, type, tagsArray) => {
  const category = type.type;
  const input = document.querySelector(`.input-${category}-container`);
  input &&
    input.addEventListener('click', () => {
      if (tagsArray?.length > 0) {
        recipes = tagsSearch(recipes, tagsArray.flat());
      }
      const arrowBtn = input.children.item(1);
      const arrowUp = document.querySelector('.fa-chevron-up');
      if (arrowBtn.classList.contains('fa-chevron-down')) {
        handleArrow(arrowBtn, `fa-chevron-down`, `fa-chevron-up`);
        arrowUp
          ? handleArrow(arrowUp, `fa-chevron-up`, `fa-chevron-down`)
          : null;
        setOptionList(recipes, category, tagsArray);
        tagsArray.push(setTags(recipes, category, tagsArray));
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

  searchInput.addEventListener('input', (e) => {
    if (tagsArray?.length > 0) {
      filteredRecipesWithTags = tagsSearch(recipes, tagsArray.flat());
      filteredRecipesWithInput = mainSearch(
        filteredRecipesWithTags,
        e.target.value
      );
    } else {
      filteredRecipesWithInput = mainSearch(recipes, e.target.value);
    }
    displaySelectSection(recipesConstants, filteredRecipesWithInput, tagsArray);
    displayRecipes(filteredRecipesWithInput);
  });
  if (!searchInput.value) {
    displaySelectSection(recipesConstants, recipes, tagsArray);
    displayRecipes(recipes);
  }
}

init();
