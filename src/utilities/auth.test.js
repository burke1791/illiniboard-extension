
describe('auth', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('correct key passed to storage for getting extensionId', () => {
    const getStorage = require('./storage').getStorage;
    const getExtensionId = require('./auth').getExtensionId;
    
    jest.mock('./storage');

    return getExtensionId().then(() => {
      expect(getStorage).toBeCalledWith('extensionId');
    });
  });

  test('valid data check', () => {
    const getExtensionId = require('./auth').getExtensionId;
    
    jest.mock('./storage', () => {
      return {
        getStorage: jest.fn(() => Promise.resolve({ extensionId: 'testId' })),
        setStorage: jest.fn()
      }
    });

    return getExtensionId().then(data => {
      expect(data).toBe('testId');
    });
  });

  test('getNewExtension is provided the correct endpoint', () => {
    const apiGet = require('./apiService').apiGet;
    const getNewExtensionId = require('./auth').getNewExtensionId;
    const setStorage = require('./storage').setStorage;

    apiGet.mockReturnValue(Promise.resolve('{ "name": "testJSON" }'));
    setStorage.mockImplementation(() => Promise.resolve('testExtensionId'));

    jest.mock('./apiService');
    jest.mock('./storage');

    return getNewExtensionId().then(() => {
      expect(apiGet).toBeCalledWith('/registerNewExtension');
    });
  });

  test('getNewExtensionId handles server error', () => {
    const apiGet = require('./apiService').apiGet;
    const getNewExtensionId = require('./auth').getNewExtensionId;

    apiGet.mockReturnValue(Promise.resolve('{ "message": "Internal Server Error" }'));

    return getNewExtensionId().catch((error) => {
      expect(error).toBe('Internal Server Error');
    });
  })
});