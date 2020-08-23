
const setStorage = jest.fn((obj) => Promise.resolve(obj));
const getStorage = jest.fn((key) => Promise.resolve(key));
const clearStorage = jest.fn(() => Promise.resolve());

export {
  setStorage,
  getStorage,
  clearStorage
};