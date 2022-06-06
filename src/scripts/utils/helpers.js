const customFetch = async (url, method = 'GET', headers = {}, body = '') => {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body === '' ? null : body,
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return (document.querySelector('.fetch-error').textContent =
      "Une erreur s'est produite lors du chargement des données, veuillez réessayer plus tard");
  }
};

// create DOM element
/**
 *
 * @param {*} type(balise)
 * @param {*} text(contenu)
 * @param {*} className(style)
 * @param {*} attributes(src, alt, index, etc...)
 * @returns
 */
const createGenericElement = (
  type,
  text = '',
  className = '',
  attributes = []
) => {
  const element = document.createElement(type);
  if (text) {
    element.textContent = text;
  }
  if (className) {
    element.className = className;
  }
  if (attributes) {
    attributes.forEach((attribute) => {
      element.setAttribute(attribute.name, attribute.value);
    });
  }
  return element;
};

export { customFetch, createGenericElement };
