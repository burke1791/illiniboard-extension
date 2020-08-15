import { getUnreadCountBadgeText, updateBadgeTextWithUnreadCount } from '../src/utilities/badge';

/**
 * mocking chrome globals
 */
global.chrome = {
  browserAction: {
    setBadgeText: function(obj, callback) {
      callback();
    }
  },
  storage: {
    sync: {
      get: function(key, callback) {
        let articles = [
          { viewed: false },
          { viewed: true },
          {}
        ];
        
        callback(articles);
      }
    }
  }
}

describe('correctly translates integer input to badge text string', () => {
  test('negative number', () => {
    expect(getUnreadCountBadgeText(-1)).toBe('');
  });

  test('zero', () => {
    expect(getUnreadCountBadgeText(0)).toBe('');
  });

  test('single digit positibe', () => {
    expect(getUnreadCountBadgeText(5)).toBe('5');
  });

  test('double digit', () => {
    expect(getUnreadCountBadgeText(11)).toBe('9+');
  });

  test('triple digit', () => {
    expect(getUnreadCountBadgeText(100)).toBe('9+');
  });

  test('invalid input', () => {
    expect(getUnreadCountBadgeText('dummy input')).toBe('');
  });
});

describe('setting chrome badge text properly', () => {
  test('passes correct value to set badge text', () => {
    return updateBadgeTextWithUnreadCount().then(result => {
      expect(result).toBe(true);
    });
  });
});