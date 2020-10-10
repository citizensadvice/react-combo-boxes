import { preHighlighter } from './pre_highlighter';

it('returns an empty string with no term', () => {
  expect(preHighlighter('', null, { start: '<em>', end: '</em>' })).toEqual(['']);
});

it('returns the term if no highlight', () => {
  expect(preHighlighter('foo', null, { start: '<em>', end: '</em>' })).toEqual(['foo']);
});

it('returns the term if no start and end', () => {
  expect(preHighlighter('<em>foo</em>', null)).toEqual(['<em>foo</em>']);
});

it('returns the highlighted terms', () => {
  expect(preHighlighter('foo<em>bar</em>foe<em>thumb</em>fee', null, { start: '<em>', end: '</em>' }))
    .toEqual(['foo', ['bar'], 'foe', ['thumb'], 'fee']);
});

it('normalises the highlight', () => {
  expect(preHighlighter('<em>b</em><em>a</em>r<em></em>fo<em>o</em>', null, { start: '<em>', end: '</em>' }))
    .toEqual([['ba'], 'rfo', ['o']]);
});

it('ignores a missing end', () => {
  expect(preHighlighter('foo<em>bar', null, { start: '<em>', end: '</em>' }))
    .toEqual(['foo<em>bar']);
});
