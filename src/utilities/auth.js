import { getStorage, setStorage } from "./storage"
import { apiGet } from "./apiService";
import { ENDPOINTS } from "./constants";

export function getExtensionId() {
  return new Promise((resolve, reject) => {
    getStorage('extensionId').then(data => {
      if (data.extensionId === undefined) {
        resolve(false);
      } else {
        resolve(data.extensionId);
      }
    });
  });
}

export function getNewExtensionId() {
  return new Promise((resolve, reject) => {
    apiGet(ENDPOINTS.REGISTER).then(response => {
      let data = JSON.parse(response);
      if (data.message == 'Internal Server Error') {
        reject(data.message);
      } else {
        // write extensionId to chrome storage
        return setStorage({ 'extensionId': data.ExtensionGuid });
      }
    }).then(data => {
      resolve(data.extensionId);
    }).catch(error => {
      // likely unable to parse the response
      reject(error);
    });
  });
}