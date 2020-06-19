import { getUnreadCountBadgeText } from '../src/badge';

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