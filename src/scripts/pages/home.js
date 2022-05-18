import 'regenerator-runtime/runtime';
import customFetch from '../utils/helpers';

async function getRecipes() {
  const data = await customFetch('./data/recipes.json');
  console.log(data);
  return {
    data,
  };
}

getRecipes();
