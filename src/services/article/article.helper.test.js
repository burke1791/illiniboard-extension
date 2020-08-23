
describe('article.helper', () => {
  beforeEach(() => {
    jest.mock('../../utilities/storage');
  });

  test('generateCheckArticleApiParams passes correct key to storage', () => {
    const getStorage = require('../../utilities/storage').getStorage;
    const generateCheckArticleApiParams = require('./article.helper').generateCheckArticleApiParams;

    getStorage.mockImplementation(() => Promise.resolve({ prevArticleId: 1 }));

    return generateCheckArticleApiParams('testId').then(() => {
      expect(getStorage).toBeCalledWith('prevArticleId');
    });
  });

  test('getLocalArticleViews passes correct key to storage', () => {
    const getStorage = require('../../utilities/storage').getStorage;
    const getLocalArticleViews = require('./article.helper').getLocalArticleViews;

    getStorage.mockImplementation(() => Promise.resolve({ prevArticleId: 1 }));

    return getLocalArticleViews().then(() => {
      expect(getStorage).toBeCalledWith('articles');
    });
  });

  test('getLocalArticleViews valid data', () => {
    const getStorage = require('../../utilities/storage').getStorage;
    const getLocalArticleViews = require('./article.helper').getLocalArticleViews;

    getStorage.mockImplementation(() => Promise.resolve({ articles: [
      { ArticleId: 1, viewed: false},
      { ArticleId: 2, viewed: true }
    ]}));

    return getLocalArticleViews().then(data => {
      expect(data).toStrictEqual([
        2
      ]);
    });
  });
});