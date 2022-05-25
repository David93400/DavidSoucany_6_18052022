import { createGenericElement } from '../utils/helpers';

export default function recipesFactory(data) {
  const { description, ingredients, name, time, img } = data;
  function getRecipeCardDOM() {
    const timeIcon = createGenericElement('i', null, 'fa-regular fa-clock');
    const recipeImg = createGenericElement('img', '', 'recipe-img', [
      { name: 'src', value: `./assets/images/${img}` },
    ]);
    const recipeName = createGenericElement('h2', name, 'recipe-name');
    const recipeDescription = createGenericElement(
      'p',
      description,
      'recipe-description'
    );
    const recipeTime = createGenericElement('p', `${time} min`, 'recipe-time');
    const recipeIngredients = createGenericElement(
      'div',
      '',
      'recipe-ingredients'
    );
    const recipeCard = createGenericElement('div', '', 'recipe-card');
    const explodeIngredients = (ingredients) => {
      ingredients.forEach((ingredient) => {
        const ingredientName = createGenericElement(
          'li',
          `${ingredient.ingredient}: ${
            ingredient.quantity ? ingredient.quantity : ''
          }${ingredient.unit ? ` ${ingredient.unit}` : ''}`,
          'recipe-ingredient'
        );
        recipeIngredients.appendChild(ingredientName);
      });
    };
    const recipeHeader = createGenericElement('div', '', 'recipe-header');
    const recipeMain = createGenericElement('div', '', 'recipe-main');
    explodeIngredients(ingredients);
    recipeCard.appendChild(recipeImg);
    recipeHeader.appendChild(recipeName);
    recipeTime.prepend(timeIcon);
    recipeHeader.appendChild(recipeTime);
    recipeMain.appendChild(recipeIngredients);
    recipeMain.appendChild(recipeDescription);
    recipeCard.appendChild(recipeHeader);
    recipeCard.appendChild(recipeMain);

    return recipeCard;
  }
  return { data, getRecipeCardDOM };
}
