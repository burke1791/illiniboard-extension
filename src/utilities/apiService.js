import { BASE_URL, ENDPOINTS } from './constants';

export function registerNewExtension() {
  return fetch(BASE_URL + ENDPOINTS.REGISTER);
}

