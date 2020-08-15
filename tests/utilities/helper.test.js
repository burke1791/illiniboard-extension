import { getUnreadArticleCount, timeDiff, generateQueryString } from '../../src/utilities/helper';


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

let date1 = new Date('January 1, 2020 01:00:00');
let date2 = new Date('January 1, 2020 01:30:00');

test('correctly flags time diff from threshold', () => {
  let threshold = {
    unit: 'second',
    value: '1000'
  };

  expect(timeDiff(date1, date2, threshold)).toBe(true);

  threshold = {
    unit: 'minute',
    value: 35
  };

  expect(timeDiff(date1, date2, threshold)).toBe(false);
});

test('timeDiff should throw', () => {
  let threshold = {
    unit: 'hour', // not currently supported
    value: 69
  };

  expect(() => { timeDiff(date1, 54, threshold) }).toThrow();

  expect(() => { timeDiff(date1, date2, threshold) }).toThrow();
});

describe('query string generation', () => {
  test('correctly generates URL query string', () => {
    let params = {
      param1: 'value1',
      param2: 69
    };
  
    expect(generateQueryString(params)).toBe('?param1=value1&param2=69');
  });

  test('gracefully handles undefined', () => {
    expect(generateQueryString()).toBe('');
  });
});