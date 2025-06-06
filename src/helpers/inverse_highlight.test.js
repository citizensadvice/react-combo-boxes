import { inverseHighlight } from './inverse_highlight';

it('inverses a highlight', () => {
  expect(inverseHighlight(['foo', ['bar'], 'fizz'])).toEqual([
    ['foo'],
    'bar',
    ['fizz'],
  ]);
});

it('inverses with no existing highlight', () => {
  expect(inverseHighlight(['foo bar'])).toEqual([['foo bar']]);
});

it('does not highlight lone spaces', () => {
  expect(inverseHighlight([['foo'], ' ', ['bar']])).toEqual(['foo bar']);
});

it('does not highlight leading and trailing spaces', () => {
  expect(inverseHighlight([['foo'], ' bar ', ['foo']])).toEqual([
    'foo ',
    ['bar'],
    ' foo',
  ]);
});

it('does not highlight nothing', () => {
  expect(inverseHighlight([''])).toEqual(['']);
});
