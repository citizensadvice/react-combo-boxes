import { delimitedHighlighter } from './delimited_highlighter';

it('returns an empty string with no term', () => {
  expect(delimitedHighlighter('', { start: '<em>', end: '</em>' })).toEqual(['']);
});

it('returns the term if no highlight', () => {
  expect(delimitedHighlighter('foo', { start: '<em>', end: '</em>' })).toEqual(['foo']);
});

it('returns the highlighted terms', () => {
  expect(delimitedHighlighter('foo<em>bar</em>foe<em>thumb</em>fee', { start: '<em>', end: '</em>' }))
    .toEqual(['foo', ['bar'], 'foe', ['thumb'], 'fee']);
});

it('normalises the highlight', () => {
  expect(delimitedHighlighter('<em>b</em><em>a</em>r<em></em>fo<em>o</em>', { start: '<em>', end: '</em>' }))
    .toEqual([['ba'], 'rfo', ['o']]);
});

it('ignores a missing end', () => {
  expect(delimitedHighlighter('foo<em>bar', { start: '<em>', end: '</em>' }))
    .toEqual(['foo<em>bar']);
});
