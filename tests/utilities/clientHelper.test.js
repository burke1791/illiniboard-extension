import { generateArticleData, setArticlesViewed } from '../../src/utilities/clientHelper';

test('correctly generates article props object', () => {
  let article = {
    ArticleId: 1,
    Description: 'test description',
    PublishDate: '8 Aug 2020',
    Title: 'test title',
    Url: 'https://test.url'
  };

  let expectedObj = {
    articleId: 1,
    description: 'test description',
    pubDate: new Date('8 Aug 2020'),
    title: 'test title',
    url: 'https://test.url'
  };

  expect(generateArticleData(article)).toStrictEqual(expectedObj);
});

test('sets article viewed flag correctly', () => {
  let articleArr = [
    { ArticleId: 1 },
    { ArticleId: 3 },
    { ArticleId: 5 }
  ];

  // testing a single article
  let expectedArr = [
    { ArticleId: 1 },
    { ArticleId: 3 },
    { ArticleId: 5, viewed: true }
  ];

  expect(setArticlesViewed(articleArr, 5)).toStrictEqual(expectedArr);

  // testing all articles
  expectedArr = [
    { ArticleId: 1, viewed: true },
    { ArticleId: 3, viewed: true },
    { ArticleId: 5, viewed: true }
  ];

  expect(setArticlesViewed(articleArr)).toStrictEqual(expectedArr);
});