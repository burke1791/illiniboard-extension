import { BASE_URL } from './constants';
import { generateQueryString, generatePostBody, timeDiff } from './helper';

/**
 * @function apiGet Sends GET requests to @endpoint and generates a URI parameter string from @URIParams
 * @param {string} endpoint - the API endpoint to send the request
 * @param {object} URIParams - object keys are the URI keys, and object values are the URI values
 */
export function apiGet(endpoint, URIParams) {
  let queryString = generateQueryString(URIParams);

  return new Promise((resolve) => {
    fetch(BASE_URL + endpoint + queryString).then(response => {
      resolve(response.json());
    });
  });
}

/**
 * @function apiPost Sends POST requests to @endpoint and with body and header objects generated from @params
 * @param {string} endpoint - the API endpoint to send the request
 * @param {object} params
 * @param {object} params.headers
 * @param {object} params.body
 */
export function apiPost(endpoint, params) {
  /**@todo */
  // let headers = generateHeaders(params.headers);

  let bodyParams = params == undefined ? params : params.body;

  let body = generatePostBody(bodyParams);

  console.log(body);

  return new Promise((resolve) => {
    fetch(BASE_URL + endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(response => {
      resolve(response.json());
    });
  });
}

/**
 * @function determinePollEligibility - returns a bool indicating whether or not the extension is eligible to request data from the server
 * @param {Date} lastPoll 
 */
export function determinePollEligibility(lastPoll) {
  if (!lastPoll) {
    return false;
  }

  let now = new Date();
  let threshold = {
    unit: 'minute',
    value: 10
  };

  return timeDiff(lastPoll, now, threshold);
}