import { passThroughHighlighter } from './pass_through_highlighter';

it('returns no highlight', () => {
  expect(passThroughHighlighter('foo')).toEqual(['foo']);
});
