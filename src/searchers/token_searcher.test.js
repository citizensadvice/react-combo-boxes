import { tokenSearcher } from './token_searcher';

it('returns an empty array when searching an empty collection', () => {
  const search = tokenSearcher([]);
  const result = search('');
  expect(result).toEqual([]);
});

it('returns the collection if no search term', () => {
  const collection = ['foo', 'bar'];
  const search = tokenSearcher(collection);
  const result = search('');
  expect(result).toEqual(collection);
});

it('finds matching items', () => {
  const collection = ['apple', 'apricot', 'banana', 'toffee apple'];
  const search = tokenSearcher(collection);
  const result = search('ap');
  expect(result).toEqual(['apple', 'apricot', 'toffee apple']);
});

it('finds matching items case-insensitive', () => {
  const collection = ['apple', 'apricot', 'banana', 'toffee apple'];
  const search = tokenSearcher(collection);
  const result = search('Ap');
  expect(result).toEqual(['apple', 'apricot', 'toffee apple']);
});

it('finds matching items from the start of the string only', () => {
  const collection = ['apple', 'apricot', 'banana', 'toffee apple'];
  const search = tokenSearcher(collection);
  const result = search('an');
  expect(result).toEqual([]);
});

it('finds matching items trimming white space', () => {
  const collection = [' apple ', 'apricot', 'banana', 'toffee apple'];
  const search = tokenSearcher(collection);
  const result = search(' ap ');
  expect(result).toEqual([' apple ', 'apricot', 'toffee apple']);
});

it('finds matching items ignoring diacritics', () => {
  const collection = ['apple', 'apricot', 'banana', 'toffee a̧pple'];
  const search = tokenSearcher(collection);
  const result = search('Áp');
  expect(result).toEqual(['apple', 'apricot', 'toffee a̧pple']);
});

it('finds matching items ignoring punctuation', () => {
  const collection = ['!apple', '(apricot)', 'banana', 'toffee apple'];
  const search = tokenSearcher(collection);
  const result = search('.ap,');
  expect(result).toEqual(['!apple', '(apricot)', 'toffee apple']);
});

it('finds a matching numbers', () => {
  const collection = [0, 1, 2, 3];
  const search = tokenSearcher(collection);
  const result = search('0');
  expect(result).toEqual([0]);
});

it('ignores empty items', () => {
  const collection = ['foo', null, undefined, ''];
  const search = tokenSearcher(collection);
  const result = search('foo');
  expect(result).toEqual(['foo']);
});

describe('options as objects', () => {
  it('defaults to indexing label', () => {
    const collection = [{ label: 'apple', id: 1 }, { label: 'apricot', id: 2 }, { label: 'banana', id: 3 }];
    const search = tokenSearcher(collection);
    const result = search('ap');
    expect(result).toEqual([{ label: 'apple', id: 1 }, { label: 'apricot', id: 2 }]);
  });
});

describe('index', () => {
  it('customises the indexed value', () => {
    const collection = [{ text: 'apple' }, { text: 'apricot' }, { text: 'banana' }];
    function index(option) {
      return option.text;
    }
    const search = tokenSearcher(collection, { index });
    const result = search('ap');
    expect(result).toEqual([{ text: 'apple' }, { text: 'apricot' }]);
  });
});

describe('tokenise', () => {
  it('customises the tokeniser', () => {
    const collection = [{ label: 'apple' }, { label: 'apricot' }, { label: 'cherry' }];
    function tokenise(option) {
      return option.split('');
    }
    const search = tokenSearcher(collection, { tokenise });
    const result = search('ec');
    expect(result).toEqual([{ label: 'cherry' }]);
  });
});

describe('locale', () => {
  it('customises the tokeniser', () => {
    const collection = [{ label: 'apple' }, { label: 'apricot' }, { label: 'cherry' }];
    function tokenise(option) {
      return option.split('');
    }
    const search = tokenSearcher(collection, { tokenise });
    const result = search('ec');
    expect(result).toEqual([{ label: 'cherry' }]);
  });
});
