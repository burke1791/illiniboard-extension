import { fetchNewArticles } from './article.service';
import 'babel-polyfill';
import { setStorage } from '../../utilities/storage';



describe('article service', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('calling the correct endpoint for checking new articles', () => {
    const apiGet = require('../../utilities/apiService').apiGet;
    const fetchNewArticles = require('./article.service').fetchNewArticles;

    jest.mock('../../utilities/apiService');
    jest.mock('./article.helper');
    
    return fetchNewArticles('testId').then(() => {
      expect(apiGet).toBeCalledWith('/checkNewArticles', undefined);
    });
  });
  
  test('passing correct data to Api params generator', () => {
    const generateCheckArticleParams = require('./article.helper').generateCheckArticleApiParams;
    const fetchNewArticles = require('./article.service').fetchNewArticles;

    jest.mock('../../utilities/apiService');
    jest.mock('./article.helper');
  
    return fetchNewArticles('testId').then(() => {
      expect(generateCheckArticleParams).toBeCalledWith('testId');
    });
  });
  
  test('fetchNewArticles should throw', () => {
    const fetchNewArticles = require('./article.service').fetchNewArticles;

    return fetchNewArticles().catch(error => {
      expect(error).toStrictEqual(new Error('Please supply an extensionId'));
    });
  });
  
  test('parses JSON properly', () => {
    const fetchNewArticles = require('./article.service').fetchNewArticles;

    jest.mock('../../utilities/apiService', () => {
      return {
        __esModule: true,
        apiGet: jest.fn(() => Promise.resolve('[{"ArticleId": 1}]'))
      }
    });
    jest.mock('./article.helper');
  
    let result = [
      { ArticleId: 1 }
    ];
  
    return fetchNewArticles('testId').then(data => {
      expect(data).toStrictEqual(result);
    });
  });

  test('sendArticleViews undefined', () => {
    const sendArticleViews = require('./article.service').sendArticleViews;

    return sendArticleViews().catch(error => {
      expect(error.message).toBe('Please supply an extensionId');
    });
  });

  test('sendArticleViews no views', () => {
    const sendArticleViews = require('./article.service').sendArticleViews;

    jest.mock('./article.helper');

    return sendArticleViews('testId').then(data => {
      expect(data).toStrictEqual([]);
    });
  });

  test('sendArticleViews views send', () => {
    const sendArticleViews = require('./article.service').sendArticleViews;

    jest.mock('./article.helper', () => {
      return {
        _esModule: true,
        getLocalArticleViews: jest.fn(() => Promise.resolve([{ArticleId: 1}]))
      }
    });

    jest.mock('../../utilities/apiService', () => {
      return {
        __esModule: true,
        apiPost: jest.fn(() => Promise.resolve('[{"ArticleId": 1}]'))
      }
    });

    let result = [
      { ArticleId: 1 }
    ];

    return sendArticleViews('testId').then(data => {
      expect(data).toStrictEqual(result);
    });
  });

  test('sendArticleViews API error', () => {
    const sendArticleViews = require('./article.service').sendArticleViews;

    jest.mock('./article.helper', () => {
      return {
        __esModule: true,
        getLocalArticleViews: jest.fn(() => Promise.resolve([{ArticleId: 1}]))
      }
    });

    jest.mock('../../utilities/apiService', () => {
      return {
        __esModule: true,
        apiPost: jest.fn(() => Promise.reject())
      }
    });

    return sendArticleViews('testId').catch(error => {
      expect(error).toBe([]);
    });
  });

  test('purgeViewedArticles', () => {
    const purgeViewedArticles = require('./article.service').purgeViewedArticles;
    const setStorage = require('../../utilities/storage').setStorage;

    jest.mock('../../utilities/storage', () => {
      return {
        __esModule: true,
        getStorage: jest.fn(() => Promise.resolve({ articles: [
            { ArticleId: 1 },
            { ArticleId: 2 }
          ]
        })),
        setStorage: jest.fn((obj) => Promise.resolve())
      }
    });

    let articles = [
      { ArticleId: 1 },
    ];

    return purgeViewedArticles(articles).then(data => {
      expect(setStorage).toBeCalledWith({ 'articles': [{ArticleId: 2}]});
    });
  });

  test('storeNewArticles', () => {
    const storeNewArticles = require('./article.service').storeNewArticles;
    const setStorage = require('../../utilities/storage').setStorage;

    jest.mock('../../utilities/storage', () => {
      return {
        __esModule: true,
        getStorage: jest.fn(() => Promise.resolve({ articles: [
            { ArticleId: 2 },
            { ArticleId: 3 }
          ]
        })),
        setStorage: jest.fn((obj) => Promise.resolve())
      }
    });

    let newArticles = [
      { ArticleId: 1 },
      { ArticleId: 3 }
    ];

    return storeNewArticles(newArticles).then(data => {
      expect(setStorage).toBeCalledWith({ 'articles': [
        { ArticleId: 2 },
        { ArticleId: 3 },
        { ArticleId: 1 }
      ]});
    });
  });
});