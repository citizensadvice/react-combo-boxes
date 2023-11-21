import { prefixSearcher } from './prefix_searcher';

it('returns an empty array when searching an empty collection', () => {
  const search = prefixSearcher([]);
  const result = search('');
  expect(result).toEqual([]);
});

it('returns the collection if no search term', () => {
  const collection = ['foo', 'bar'];
  const search = prefixSearcher(collection);
  const result = search('');
  expect(result).toEqual(collection);
});

it('finds matching items', () => {
  const collection = ['apple', 'apricot', 'banana', 'toffee apple'];
  const search = prefixSearcher(collection);
  const result = search('ap');
  expect(result).toEqual(['apple', 'apricot']);
});

it('finds matching items case-insensitive', () => {
  const collection = ['apple', 'apricot', 'banana', 'toffee apple'];
  const search = prefixSearcher(collection);
  const result = search('Ap');
  expect(result).toEqual(['apple', 'apricot']);
});

it('finds matching items from the start of the string only', () => {
  const collection = ['apple', 'apricot', 'banana', 'toffee apple'];
  const search = prefixSearcher(collection);
  const result = search('an');
  expect(result).toEqual([]);
});

it('finds matching items trimming left white space', () => {
  const collection = [' apple', 'apricot', 'banana', 'toffee apple'];
  const search = prefixSearcher(collection);
  const result = search(' ap');
  expect(result).toEqual([' apple', 'apricot']);
});

it('finds matching items without trimming right white space', () => {
  const collection = [' apple', 'foo bar', 'apricot', 'banana', 'toffee apple'];
  const search = prefixSearcher(collection);
  const result = search(' foo ');
  expect(result).toEqual(['foo bar']);
});

describe('options as objects', () => {
  it('defaults to indexing label', () => {
    const collection = [
      { label: 'apple', id: 1 },
      { label: 'apricot', id: 2 },
      { label: 'banana', id: 3 },
    ];
    const search = prefixSearcher(collection);
    const result = search('ap');
    expect(result).toEqual([
      { label: 'apple', id: 1 },
      { label: 'apricot', id: 2 },
    ]);
  });
});

describe('index', () => {
  it('customises the indexed value', () => {
    const collection = [
      { text: 'apple' },
      { text: 'apricot' },
      { text: 'banana' },
    ];
    function index(option) {
      return option.text;
    }
    const search = prefixSearcher(collection, { index });
    const result = search('ap');
    expect(result).toEqual([{ text: 'apple' }, { text: 'apricot' }]);
  });
});
