import { generateArticleObj, extractArticleProperty } from '../src/article';
import { validArticleXmlNode, validArticleComponent } from '../mocks/articles';
import Article from '../src/components/article';

let parser = new DOMParser()

describe('article xml parsing', () => {
  test('correctly parses a valid xml node', () => {
    let validXml = parser.parseFromString(validArticleXmlNode, 'text/xml');
  
    let actualTitle = extractArticleProperty(validXml, 'title');
    let expectedTitle = 'Valid Article Title';
  
    expect(actualTitle).toBe(expectedTitle);
  
    let actualLink = extractArticleProperty(validXml, 'link');
    let expectedLink = 'https://testlink.dev';
  
    expect(actualLink).toBe(expectedLink);
  
    let actualDesc = extractArticleProperty(validXml, 'description');
    let expectedDesc = 'Valid Article Description';
  
    expect(actualDesc).toBe(expectedDesc);
  
    let actualPubDate = extractArticleProperty(validXml, 'pubDate');
    let expectedPubDate = 'Wed, 17 Jun 2020 19:35:48 -0500';
  
    expect(actualPubDate).toBe(expectedPubDate);
  });
  
  test('correctly generates article object from valid xml node', () => {
    let validXml = parser.parseFromString(validArticleXmlNode, 'text/xml');
  
    let actualArticle = generateArticleObj(validXml);
    let expectedArticle = {
      title: 'Valid Article Title',
      link: 'https://testlink.dev',
      description: 'Valid Article Description',
      pubDate: 'Wed, 17 Jun 2020 19:35:48 -0500'
    };
  
    expect(actualArticle).toEqual(expectedArticle);
  });
});

describe('article components', () => {
  test('correctly component from valid inputs', () => {
    let articleProps = {
      url: 'https://testlink.dev',
      title: 'Valid Article Title',
      timestamp: new Date('Wed, 17 Jun 2020 19:35:48 -0500'),
      clickListener: () => { return null }
    }

    let actualComponent = new Article(articleProps);

    expect(actualComponent.outerHTML).toBe(validArticleComponent);
  });
});