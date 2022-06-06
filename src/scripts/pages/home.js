import 'regenerator-runtime/runtime';
import recipesFactory from '../factories/recipesFactory';
import { createGenericElement, customFetch } from '../utils/helpers';
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
  // check maquette, faire array et search
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

const selectIngredientsDisplay = createGenericElement('option', 'Ingredients');
const selectAppareilsDisplay = createGenericElement('option', 'Appliance');
const selectUtensilsDisplay = createGenericElement('option', 'Ustensils');

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
  [{ name: 'id', value: 'ingredients' }]
);
const selectAppareils = createGenericElement('select', '', 'select-appliance', [
  { name: 'id', value: 'appliance' },
]);
const selectUtensils = createGenericElement('select', '', 'select-ustensils', [
  { name: 'id', value: 'ustensils' },
]);

selectSection.append(selectIngredients, selectAppareils, selectUtensils);
searchSection.append(tagSection, selectSection);
selectIngredients.appendChild(selectIngredientsDisplay);
selectAppareils.appendChild(selectAppareilsDisplay);
selectUtensils.appendChild(selectUtensilsDisplay);

const setTags = (type) => {
  const selectType = document.querySelector(`#${type}`);
  selectType.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value.toLowerCase() === type) {
      return;
    }
    const tagContainer = createGenericElement(
      'div',
      '',
      `tag-container tag-${type}`,
      [{ name: 'id', value: `${e.target.value}` }]
    );
    const closeTag = createGenericElement(
      'i',
      '',
      'fa-regular fa-circle-xmark',
      [{ name: 'id', value: `${e.target.value}` }]
    );
    const tag = createGenericElement(
      'div',
      '',
      `${selectType.className}-tag tag`
    );
    tag.textContent = value;
    tagSection.appendChild(tagContainer);
    tagContainer.append(tag, closeTag);
    closeTag.addEventListener('click', (e) => {
      e.preventDefault();
      tagContainer.remove();
    });
  });
};

export default async function init() {
  const { recipes } = await getRecipes();
  // filter recipes by search bar
  recipesConstants.map((type) => {
    getList(recipes, type);
    setTags(type);
  });
  displayRecipes(recipes);
}

init();
