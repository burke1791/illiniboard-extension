import { BASE_URL, ENDPOINTS } from './constants';
import { generateQueryString } from './helper';

export function registerNewExtension() {
  return fetch(BASE_URL + ENDPOINTS.REGISTER);
}

/**
 * @function get Sends GET requests to @endpoint and generates a URI parameter string from @URIParams
 * @param {string} endpoint - the API endpoint to send the request
 * @param {object} URIParams - object keys are the URI keys, and object values are the URI values
 */
export function apiGet(endpoint, URIParams) {
  let queryString = generateQueryString(URIParams);

  console.log(queryString);

  return new Promise((resolve) => {
    fetch(BASE_URL + endpoint + queryString).then(response => {
      resolve(response.json());
    });
  });
}