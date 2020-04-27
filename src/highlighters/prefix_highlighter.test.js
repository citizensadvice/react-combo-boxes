import { prefixHighlighter } from './prefix_highlighter';

it('returns an empty string with no term', () => {
  expect(prefixHighlighter('', '')).toEqual(['']);
});

it('returns the term with no query', () => {
  expect(prefixHighlighter('foo', '')).toEqual(['foo']);
});

it('does not highlight a non-matching term', () => {
  expect(prefixHighlighter('foo', 'bar')).toEqual(['foo']);
});

it('highlights a matching full term', () => {
  expect(prefixHighlighter('foo', 'foo')).toEqual([['foo']]);
});

it('highlights a matching partial term', () => {
  expect(prefixHighlighter('foobar', 'foo')).toEqual([['foo'], 'bar']);
});

it('highlights case insensitively', () => {
  expect(prefixHighlighter('FoObar', 'fOo')).toEqual([['FoO'], 'bar']);
});
