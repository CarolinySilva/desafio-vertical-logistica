const cache = require('../../utils/cache');

describe('cache utility', () => {
  afterEach(() => {
    cache.clear();
  });

  it('should store and retrieve a user name', () => {
    cache.set('userName', 'Alice');
    expect(cache.get('userName')).toBe('Alice');
  });

  it('should store and retrieve an object with user data', () => {
    const userData = { id: 1, name: 'Bob' };
    cache.set('userData', userData);
    expect(cache.get('userData')).toEqual(userData);
  });

  it('should return undefined for a key that does not exist', () => {
    expect(cache.get('nonExistentKey')).toBeUndefined();
  });

  it('should override a value when the same key is used', () => {
    cache.set('theme', 'light');
    cache.set('theme', 'dark');
    expect(cache.get('theme')).toBe('dark');
  });

  it('should clear all stored values', () => {
    cache.set('sessionToken', 'abc123');
    cache.set('cartItems', ['item1', 'item2']);
    cache.clear();
    expect(cache.get('sessionToken')).toBeUndefined();
    expect(cache.get('cartItems')).toBeUndefined();
  });
});
