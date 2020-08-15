import { fetchNewArticles } from './article.service';
import 'babel-polyfill';

jest.mock('../../utilities/apiService');
jest.mock('./article.helper');

test('calling the correct endpoint for checking new articles', () => {
  const apiGet = require('../../utilities/apiService').apiGet;
  
  return fetchNewArticles('testId').then(() => {
    expect(apiGet).toBeCalledWith('/checkNewArticles');
  });
});