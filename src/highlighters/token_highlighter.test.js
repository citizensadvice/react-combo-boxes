import { tokenHighlighter } from './token_highlighter';

it('returns an empty string with no term', () => {
  expect(tokenHighlighter('', '')).toEqual(['']);
});

it('returns the term with no query', () => {
  expect(tokenHighlighter('foo', '')).toEqual(['foo']);
});

it('does not highlight a term that does not match', () => {
  expect(tokenHighlighter('foo', 'bar')).toEqual(['foo']);
});

it('highlights exact match', () => {
  expect(tokenHighlighter('foo', 'foo')).toEqual([['foo']]);
});

it('highlights partial match', () => {
  expect(tokenHighlighter('foobar', 'foo')).toEqual([['foo'], 'bar']);
});

it('highlights ignoring capitalisation', () => {
  expect(tokenHighlighter('FoObAr', 'fOo')).toEqual([['FoO'], 'bAr']);
});

it('does not highlight a failed partial match', () => {
  expect(tokenHighlighter('foe', 'foo')).toEqual(['foe']);
});

it('highlights multiple terms separated by spaces', () => {
  expect(tokenHighlighter('foo foobar bar', 'foo')).toEqual([['foo'], ' ', ['foo'], 'bar bar']);
});

it('highlights multiple terms separated by punctuation', () => {
  expect(tokenHighlighter('foo(foobar;bar', 'foo')).toEqual([['foo'], '(', ['foo'], 'bar;bar']);
});

it('highlights multiple terms separated punctuation and spaces', () => {
  expect(tokenHighlighter('foo (foobar); bar.', 'foo')).toEqual([['foo'], ' (', ['foo'], 'bar); bar.']);
});

it('highlights terms with accents', () => {
  expect(tokenHighlighter('fóo\u0327ba\u0327r foé', 'foo')).toEqual([['fóo\u0327'], 'ba\u0327r foé']);
});

describe('without normalize support', () => {
  it('highlights terms with accents', () => {
    const { normalize } = String.prototype;
    String.prototype.normalize = undefined; // eslint-disable-line no-extend-native
    expect(tokenHighlighter('fóo\u0327ba\u0327r foé', 'foo')).toEqual(['fóo\u0327ba\u0327r foé']);
    String.prototype.normalize = normalize; // eslint-disable-line no-extend-native
  });
});
