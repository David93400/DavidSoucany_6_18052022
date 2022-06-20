import { recipesConstants } from '../constant';
import { displayInputOption, displayRecipes } from '../pages/home';
import { tagsSearch } from '../tagsSearch';
import {
  cleanError,
  createGenericElement,
  normalizeText,
  uniqueArray,
} from './helpers';

const handleArrow = (element, firstClass, secondClass) => {
  if (element.classList.contains(firstClass)) {
    element.classList.remove(firstClass);
    element.classList.add(secondClass);
  } else {
    element.classList.remove(secondClass);
    element.classList.add(firstClass);
  }
};
const createTag = (tagArray, option, type) => {
  const tagSection = document.querySelector('.tag-section');
  if (tagArray.includes(option.innerText)) {
    return;
  }
  option.classList.add('selected');
  tagArray.push(option.innerText);
  const value = option.innerText;
  const tagContainer = createGenericElement(
    'div',
    '',
    `tag-container tag-${type}`,
    [{ name: 'id', value: value }]
  );
  const closeTag = createGenericElement('i', '', 'fa-regular fa-circle-xmark', [
    { name: 'id', value: value },
  ]);
  const tag = createGenericElement('div', value, `${option.className}-tag tag`);
  tagSection.appendChild(tagContainer);
  tagContainer.append(tag, closeTag);
  closeOptionList();
  return tagArray;
};

const deleteTags = (recipes, tagsArray, type, e) => {
  const tagName = e.target.id;
  tagsArray.indexOf(tagName) > -1 &&
    tagsArray.splice(tagsArray.indexOf(tagName), 1);
  e.target.parentElement.remove();
  const filteredRecipesWithTags = tagsSearch(recipes, tagsArray.flat());
  displaySelectSection(recipesConstants, filteredRecipesWithTags, tagsArray);
  displayRecipes(filteredRecipesWithTags);
  return tagsArray;
};

const setTags = (recipes, type, tagsArray) => {
  const tagArray = [];
  let filteredRecipesWithTags = [];
  const options = document.querySelectorAll(`.${type}-list-item`);
  options.forEach((option) => {
    option.addEventListener('click', () => {
      createTag(tagArray, option, type);
      filteredRecipesWithTags = tagsSearch(recipes, tagsArray.flat());
      displayRecipes(filteredRecipesWithTags);
      return tagArray;
    });
    // listener for close tag
  });
  document.body.addEventListener('click', (e) => {
    const closeTag = document.querySelectorAll('.fa-circle-xmark');
    closeTag.forEach((tag) => {
      if (e.target === tag) {
        tagsArray = deleteTags(
          closeTag.length === 1 ? recipes : filteredRecipesWithTags,
          tagsArray.flat(),
          type,
          e
        );
      }
    });
  });
  return tagArray;
};

const getTypeList = (recipes, type) => {
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

const setArrowDown = (type) => {
  const arrowDown = createGenericElement(
    'i',
    '',
    `fa-solid fa-chevron-down ${type}-chevron-down`
  );
  return arrowDown;
};

const setInputOptionsLabel = (type) => {
  const input = createGenericElement('input', '', `input-${type.type}`, [
    { name: 'id', value: type.wording },
    { name: 'placeholder', value: type.wording },
  ]);
  return input;
};
const setInputContainer = (type) => {
  const inputContainer = createGenericElement(
    'div',
    '',
    `input-${type}-container input-container`
  );
  return inputContainer;
};
const setInputFilter = (type) => {
  const inputContainer = setInputContainer(type.type);
  const input = setInputOptionsLabel(type);
  const arrowDown = setArrowDown(type.type);
  inputContainer.append(input, arrowDown);
  return inputContainer;
};
const searchOptionsByInput = (recipes, type, tagsArray) => {
  const list = getTypeList(recipes, type.type);
  const category = type.type;
  const input = document.querySelector(`.input-${type.type}`);
  const listParent = document.querySelector(`.input-${category}-container`);
  // cleaning option list & inputs
  input.addEventListener('click', () => {
    cleanError('.error');
  });
  // listening to input
  input.addEventListener('input', (e) => {
    const value = normalizeText(e.target.value);
    if (value.length === 0) {
      cleanError('.error');
      return;
    }
    if (value.length < 3) {
      // cleaning & set up error
      cleanError('.error');
      const error = createGenericElement('div', '', 'error');
      error.innerText = 'Veuillez entrer au moins 3 caractères';
      document.querySelector('.input-section').appendChild(error);
    } else {
      //  cleaning & set up list
      cleanError('.error');

      if (document.querySelector(`.${type.type}-list`))
        document.querySelector(`.${type.type}-list`).remove();

      const listContainer = createGenericElement(
        'div',
        '',
        `${category}-list list-container`
      );
      list.forEach((item) => {
        const normalizedItem = normalizeText(item);
        if (normalizedItem.includes(value)) {
          const listItem = createGenericElement(
            'div',
            normalizedItem,
            `${category}-list-item`
          );
          listContainer.appendChild(listItem);
        } else {
          document.querySelector('.error') &&
            document.querySelector('.error').remove();
          return;
        }
        listParent.appendChild(listContainer);
      });
      tagsArray.push(setTags(recipes, category, tagsArray));
    }
  });
};

const setOptionList = (recipes, category) => {
  const container = document.querySelector(`.list-container`);
  container && container.remove();
  const list = getTypeList(recipes, category);
  const listParent = document.querySelector(`.input-${category}-container`);
  const listContainer = createGenericElement(
    'div',
    '',
    `${category}-list list-container`
  );
  listParent.appendChild(listContainer);
  list.forEach((item) => {
    const listItem = createGenericElement(
      'div',
      item,
      `${category}-list-item`,
      [{ name: 'id', value: `${item}` }]
    );
    listContainer.appendChild(listItem);
  });
};

const mainSearch = (recipes, keyword) => {
  let filteredUniqueRecipes = [];
  let newRecipesList = [];
  if (keyword.length === 0) {
    cleanError('.error');
    return;
  }
  if (keyword.length < 3) {
    cleanError('.error');
    const error = createGenericElement('div', '', 'error');
    error.innerText = 'Veuillez entrer au moins 3 caractères';
    document.querySelector('.search-section').appendChild(error);
    return recipes;
  }
  cleanError('.error');
  recipes.forEach((recipe) => {
    if (
      normalizeText(recipe.name).includes(normalizeText(keyword)) ||
      normalizeText(recipe.description).includes(normalizeText(keyword)) ||
      recipe.ingredients.toString().includes(normalizeText(keyword))
    ) {
      newRecipesList.push(recipe);
      filteredUniqueRecipes = uniqueArray(newRecipesList);
    }
  });
  return filteredUniqueRecipes;
};

const displaySelectSection = (recipesConstants, recipes, tagsArray) => {
  recipesConstants.map((type) => {
    displayInputOption(recipes, type, tagsArray);
    getTypeList(recipes, type.type, tagsArray);
    searchOptionsByInput(recipes, type, tagsArray);
  });
};
const closeOptionList = () => {
  const listContainer = document.querySelector(`.list-container`);
  listContainer && listContainer.remove();
};

export {
  handleArrow,
  getTypeList,
  setInputFilter,
  searchOptionsByInput,
  setTags,
  mainSearch,
  setOptionList,
  displaySelectSection,
  closeOptionList,
};
