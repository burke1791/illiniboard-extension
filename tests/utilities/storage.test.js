import { getStorage, setStorage, clearStorage } from '../../src/utilities/storage';

/**
 * manually mocking the global chrome object
 */
global.chrome = {
  storage: {
    sync: {
      set: function(key, callback) {
        callback('set');
      },
      get: function(key, callback) {
        callback('get');
      },
      clear: function(callback) {
        callback();
      }
    }
  }
}

test('calls the chrome storage GET api correctly', () => {
  return getStorage().then(data => {
    expect(data).toBe('get');
  });
});

test('calls the chrome storage SET api correctly', () => {
  return setStorage('set').then(data => {
    expect(data).toBe('set');
  });
});

test('calls the chrome storage CLEAR api correctly', () => {
  return clearStorage().then(data => {
    expect(data).toBe(undefined);
  });
});