import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import {
  createGenericElement,
  customFetch,
  setInputFilter,
} from '../utils/helpers';
import '../../css/home.css';
import { recipesConstants } from '../constant';

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
  return list;
};

const setTags = (type) => {
  const tagArray = [];
  const options = document.querySelectorAll(`.${type}-list-item`);
  options.forEach((option) => {
    option.addEventListener('click', () => {
      if (tagArray.includes(option.innerText)) {
        return;
        // Ajouter message d'erreur indiquant que le tag existe deja
      }
      tagArray.push(option.innerText);
      const value = option.innerText;
      const tagContainer = createGenericElement(
        'div',
        '',
        `tag-container tag-${type}`,
        [{ name: 'id', value: value }]
      );
      const closeTag = createGenericElement(
        'i',
        '',
        'fa-regular fa-circle-xmark',
        [{ name: 'id', value: value }]
      );
      const tag = createGenericElement(
        'div',
        value,
        `${option.className}-tag tag`
      );
      tagSection.appendChild(tagContainer);
      tagContainer.append(tag, closeTag);
      closeTag.addEventListener('click', (e) => {
        tagArray.splice(tagArray.indexOf(value), 1);
        e.preventDefault();
        tagContainer.remove();
      });
    });
  });
};
const displayInputOption = (recipes, type) => {
  const wording = {
    ingredients: 'Ingrédients',
    appliance: 'Appareils',
    ustensils: 'Ustensils',
  };
  const input = document.querySelector(`.input-${type}`);
  // placeholder management
  input.addEventListener('focusin', () => {
    input.setAttribute('placeholder', `Rechercher ${wording[type]}`);
  });
  input.addEventListener('focusout', () => {
    input.setAttribute('placeholder', `${wording[type]}`);
  });
  openOptionList(recipes, type);
};

const openOptionList = (recipes, type) => {
  const openBtn = document.querySelector(`.${type}-chevron-down`);
  openBtn.addEventListener('click', () => {
    if (document.querySelector(`.${type}-list`)) {
      return;
    }
    openBtn.classList.remove(`.${type}-chevron-down`, 'fa-chevron-down');
    openBtn.classList.add('fa-chevron-up');
    const list = getList(recipes, type);
    const listParent = document.querySelector(`.input-${type}-container`);
    const listContainer = createGenericElement('div', '', `${type}-list`);
    listParent.appendChild(listContainer);
    list.forEach((item) => {
      const listItem = createGenericElement('div', item, `${type}-list-item`, [
        { name: 'id', value: `${item}` },
      ]);
      listContainer.appendChild(listItem);
    });
    setTags(type);
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
    getList(recipes, type);
  });
  displayRecipes(recipes);
}

init();
