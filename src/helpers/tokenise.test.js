import { tokenise } from './tokenise';

it('returns an empty array for null', () => {
  expect(tokenise(null)).toEqual([]);
});

it('returns an empty array for undefind', () => {
  expect(tokenise(undefined)).toEqual([]);
});

it('returns an empty array for an empty string', () => {
  expect(tokenise('')).toEqual([]);
});

it('returns an empty array for an string whitespace string', () => {
  expect(tokenise(' \n\t ')).toEqual([]);
});

it('tokenises text', () => {
  expect(tokenise('lorem ipsum dolor')).toEqual(['lorem', 'ipsum', 'dolor']);
});

it('lowercases text', () => {
  expect(tokenise('LoReM iPsUm dOlOr')).toEqual(['lorem', 'ipsum', 'dolor']);
});

it('skips over punctuation', () => {
  expect(tokenise('foo. (bar); foe')).toEqual(['foo', 'bar', 'foe']);
});

it('skips over consecutive white space', () => {
  expect(tokenise('foo   bar')).toEqual(['foo', 'bar']);
});

it('normalises the string', () => {
  expect(tokenise('foé çar')).toEqual(['foe', 'car']);
});

describe('without normalize support', () => {
  it('does not normalise the string', () => {
    const { normalize } = String.prototype;
    String.prototype.normalize = undefined; // eslint-disable-line no-extend-native
    expect(tokenise('foé çar')).toEqual(['foé', 'çar']);
    String.prototype.normalize = normalize; // eslint-disable-line no-extend-native
  });
});
