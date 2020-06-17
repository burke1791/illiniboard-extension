import { getUnreadArticleCount } from '../src/utilities';


let lastViewDate = new Date('December 17, 1995 03:24:00');

let articles = [
  {
    pubDate: new Date(),
    viewed: false
  },
  {
    noPub: false
  }
]

test('correctly counts number of unread articles', () => {
  expect(getUnreadArticleCount(articles, lastViewDate)).toBe(1);
});