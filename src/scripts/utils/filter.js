import { displayInputOption, displayRecipes } from '../pages/home';
import { tagsSearch } from '../tagsSearch';
import { cleanError, createGenericElement, normalizeText } from './helpers';

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
  const closeTag = createGenericElement('i', '', 'fa-regular fa-circle-xmark');
  const tag = createGenericElement('div', value, `${option.className}-tag tag`);
  tagSection.appendChild(tagContainer);
  tagContainer.append(tag, closeTag);
  closeOptionList();
  return tagArray;
};

const deleteTags = (recipes, tagArray, option) => {
  const tag = document.getElementById(option.innerText);
  tag.addEventListener('click', () => {
    for (let i = 0; i < tagArray.length; i++) {
      if (tagArray[i] === option.innerText) {
        tagArray.splice(i, 1);
        option.classList.remove('selected');
        tag.remove();
        const filteredRecipesWithTags = tagsSearch(recipes, tagArray.flat());
        // refresh display options
        displayRecipes(filteredRecipesWithTags);
        console.log(tagArray);
        return tagArray;
      }
    }
    return tagArray;
  });
};

const setTags = (recipes, type, tagsArray) => {
  const tagArray = [];
  const options = document.querySelectorAll(`.${type}-list-item`);
  options.forEach((option) => {
    option.addEventListener('click', () => {
      createTag(tagArray, option, type);
      deleteTags(recipes, tagsArray.flat(), option);
      const filteredRecipesWithTags = tagsSearch(recipes, tagsArray.flat());
      displayRecipes(filteredRecipesWithTags);
      return tagArray;
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
    document.querySelector('form').reset();
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
  console.log(recipes, keyword);
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
