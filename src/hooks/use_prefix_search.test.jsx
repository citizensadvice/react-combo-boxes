import { renderHook } from '@testing-library/react';
import { usePrefixSearch } from './use_prefix_search';

it('filters string options', () => {
  const { result, rerender } = renderHook(
    ({ query }) => usePrefixSearch(query, { options: ['foo', 'bar', 'foe bar', 'fabar'] }),
    { initialProps: { query: null } },
  );

  expect(result.current).toEqual(['foo', 'bar', 'foe bar', 'fabar']);

  rerender({ query: '' });
  expect(result.current).toEqual(['foo', 'bar', 'foe bar', 'fabar']);

  rerender({ query: 'ba' });
  expect(result.current).toEqual(['bar']);

  // Trimming search term
  rerender({ query: ' ba' });
  expect(result.current).toEqual(['bar']);

  rerender({ query: 'ba ' });
  expect(result.current).toEqual([]);
});

it('filters object string options', () => {
  const { result } = renderHook(
    ({ query }) => usePrefixSearch(query, {
      options: [{ label: 'foo', id: 1 }, { label: 'bar', id: '2' }],
    }),
    { initialProps: { query: 'f' } },
  );

  expect(result.current).toEqual([{ label: 'foo', id: 1 }]);
});

describe('index', () => {
  it('selects with property to index', () => {
    const { result } = renderHook(
      ({ query }) => usePrefixSearch(query, {
        options: [{ text: 'foo', id: 1 }, { text: 'bar', id: 2 }],
        index: (o) => o.text,
      }),
      { initialProps: { query: 'b' } },
    );

    expect(result.current).toEqual([{ text: 'bar', id: 2 }]);
  });
});

describe('minLength', () => {
  it('returns nil unless the search is of minLength', () => {
    const { result, rerender } = renderHook(
      ({ query }) => usePrefixSearch(query, { options: ['foo', 'bar'], minLength: 2 }),
      { initialProps: { query: null } },
    );

    expect(result.current).toEqual(null);

    rerender({ query: '' });
    expect(result.current).toEqual(null);

    rerender({ query: 'f' });
    expect(result.current).toEqual(null);

    rerender({ query: 'fo' });
    expect(result.current).toEqual(['foo']);
  });
});

describe('maxResults', () => {
  it('limits the results returned', async () => {
    const { result } = renderHook(
      ({ query }) => usePrefixSearch(query, { options: ['foo', 'bar', 'foe', 'fog'], maxResults: 2 }),
      { initialProps: { query: 'f' } },
    );

    expect(result.current).toEqual(['foo', 'foe']);
  });
});
