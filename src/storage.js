
const setStorage = function(obj) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(obj, () => {
      resolve();
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

export {
  getStorage,
  setStorage
};
