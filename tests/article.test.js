import { validArticleComponent } from '../mocks/articles';
import Article from '../src/components/article';

describe('article components', () => {
  test('correctly component from valid inputs', () => {
    let articleProps = {
      id: 69,
      url: 'https://testlink.dev',
      title: 'Valid Article Title',
      timestamp: new Date('Wed, 17 Jun 2020 19:35:48 -0500'),
      clickListener: () => { return null }
    }

    let actualComponent = new Article(articleProps);

    expect(actualComponent.outerHTML).toBe(validArticleComponent);
  });
});