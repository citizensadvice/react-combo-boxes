import { substringHighlighter } from './substring_highlighter';

it('returns an empty string with no term', () => {
  expect(substringHighlighter('', '')).toEqual(['']);
});

it('returns the term with no query', () => {
  expect(substringHighlighter('foo', '')).toEqual(['foo']);
});

it('does not highlight a non-matching term', () => {
  expect(substringHighlighter('foo', 'bar')).toEqual(['foo']);
});

it('highlights a matching full term', () => {
  expect(substringHighlighter('foo', 'foo')).toEqual([['foo']]);
});

it('highlights a matching partial term at start of term', () => {
  expect(substringHighlighter('foobar', 'foo')).toEqual([['foo'], 'bar']);
});

it('highlights a matching partial term in middle of term', () => {
  expect(substringHighlighter('foobarfoo', 'bar')).toEqual(['foo', ['bar'], 'foo']);
});

it('highlights all matching parts', () => {
  expect(substringHighlighter('foobarfoobar', 'bar')).toEqual(['foo', ['bar'], 'foo', ['bar']]);
});

it('highlights a matching partial term at the end of the term', () => {
  expect(substringHighlighter('foobar', 'bar')).toEqual(['foo', ['bar']]);
});

it('highlights case insensitively', () => {
  expect(substringHighlighter('FoObar', 'fOo')).toEqual([['FoO'], 'bar']);
});
