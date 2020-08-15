
const setStorage = function(obj) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(obj, () => {
      resolve(obj);
    });
  });
}

const getStorage = function(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result);
    });
  });
}

const clearStorage = function() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.clear(() => {
      resolve();
    });
  });
}

export {
  getStorage,
  setStorage,
  clearStorage
};
