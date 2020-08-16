import { fetchNewArticles } from './article.service';
import 'babel-polyfill';



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
})