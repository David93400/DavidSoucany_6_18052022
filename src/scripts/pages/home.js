import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import { createGenericElement, customFetch } from '../utils/helpers';
import '../../css/home.css';
import { recipesConstants } from '../constant';
import {
  getTypeList,
  handleArrow,
  searchOptionsByInput,
  setInputFilter,
  setTags,
} from '../utils/filter';

async function getRecipes() {
  const data = await customFetch('./data/recipes.json');
  console.log(data.recipes);
  return data;
}

async function displayRecipes(recipes) {
  const recipesSection = document.querySelector('.recipes-section');
  recipes.forEach(async (recipe) => {
    const recipeModel = await recipesFactory(recipe);
    const recipeCard = recipeModel.getRecipeCardDOM();
    recipesSection.appendChild(recipeCard);
  });
}

const displayInputOption = (recipes, type) => {
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
  openBtn.addEventListener('click', (e) => {
    if (
      document.querySelector('.list-container') &&
      e.target.classList.contains('fa-chevron-down')
    ) {
      document.querySelector('.list-container').remove();
      const arrowUp = document.querySelector(`.fa-chevron-up`);
      handleArrow(arrowUp, 'fa-chevron-down', 'fa-chevron-up');
    }
    if (document.querySelector(`.${category}-list`)) {
      handleArrow(openBtn, 'fa-chevron-down', 'fa-chevron-up');
      return document.querySelector(`.${category}-list`).remove();
    }
    handleArrow(openBtn, 'fa-chevron-down', 'fa-chevron-up');

    const list = getTypeList(recipes, category);
    const listParent = document.querySelector(`.input-${category}-container`);
    const listContainer = createGenericElement(
      'div',
      '',
      `${category}-list list-container`
    );
    listParent.appendChild(listContainer);
    list.forEach((item) => {
      //TODO add class 'selected' to selected item with ternaire
      const listItem = createGenericElement(
        'div',
        item,
        `{${category}-list-item}`,
        [{ name: 'id', value: `${item}` }]
      );
      listContainer.appendChild(listItem);
    });
    setTags(category);
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

const inputIngredientsContainer = setInputFilter('ingredients');
const inputApplianceContainer = setInputFilter('appliance');
const inputUstensilsContainer = setInputFilter('ustensils');

inputSection.append(
  inputIngredientsContainer,
  inputApplianceContainer,
  inputUstensilsContainer
);
searchSection.append(tagSection, inputSection);

export default async function init() {
  const { recipes } = await getRecipes();
  // filter recipes by search bar
  recipesConstants.map((type) => {
    displayInputOption(recipes, type);
    getTypeList(recipes, type.type);
    searchOptionsByInput(recipes, type);
  });
  displayRecipes(recipes);
}

init();
