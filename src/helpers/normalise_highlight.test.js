import { normaliseHighlight } from './normalise_highlight';

it('filters empty parts', () => {
  expect(normaliseHighlight(['', [''], '', ['']])).toEqual(['']);
});

it('joins parts', () => {
  expect(normaliseHighlight(['f', 'oo', ['b'], ['ar']])).toEqual([
    'foo',
    ['bar'],
  ]);
});

it('renormalises to NFC', () => {
  expect(
    normaliseHighlight(['föo'.normalize('NFD'), ['bär'.normalize('NFD')]]),
  ).toEqual(['föo', ['bär']]);
});

describe('if normalize is not supported', () => {
  it('does not renormalised to NFC', () => {
    const foo = 'föo'.normalize('NFD');
    const bar = 'bär'.normalize('NFD');
    const { normalize } = String.prototype;
    String.prototype.normalize = undefined;
    expect(normaliseHighlight([foo, [bar]])).toEqual([foo, [bar]]);
    String.prototype.normalize = normalize;
  });
});
