import { delimitedHighlighter } from './delimited_highlighter';

it('returns an empty string with no term', () => {
  expect(delimitedHighlighter('', null, { start: '<em>', end: '</em>' })).toEqual(['']);
});

it('returns the term if no highlight', () => {
  expect(delimitedHighlighter('foo', null, { start: '<em>', end: '</em>' })).toEqual(['foo']);
});

it('returns the term if no start and end', () => {
  expect(delimitedHighlighter('<em>foo</em>', null)).toEqual(['<em>foo</em>']);
});

it('returns the highlighted terms', () => {
  expect(delimitedHighlighter('foo<em>bar</em>foe<em>thumb</em>fee', null, { start: '<em>', end: '</em>' }))
    .toEqual(['foo', ['bar'], 'foe', ['thumb'], 'fee']);
});

it('normalises the highlight', () => {
  expect(delimitedHighlighter('<em>b</em><em>a</em>r<em></em>fo<em>o</em>', null, { start: '<em>', end: '</em>' }))
    .toEqual([['ba'], 'rfo', ['o']]);
});

it('ignores a missing end', () => {
  expect(delimitedHighlighter('foo<em>bar', null, { start: '<em>', end: '</em>' }))
    .toEqual(['foo<em>bar']);
});
