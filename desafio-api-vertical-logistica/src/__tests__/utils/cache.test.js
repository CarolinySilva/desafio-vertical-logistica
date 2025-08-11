const cache = require('../../utils/cache');

describe('cache', () => {
  afterEach(() => {
    cache.clear();
  });

  it('should set and get a value', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return undefined for unknown key', () => {
    expect(cache.get('unknown')).toBeUndefined();
  });

  it('should clear all values', () => {
    cache.set('key1', 'value1');
    cache.clear();
    expect(cache.get('key1')).toBeUndefined();
  });
});
