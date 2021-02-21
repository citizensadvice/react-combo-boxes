import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncSearch } from './use_async_search';

describe('options', () => {
  it('returns the result of calling a searcher', async () => {
    const searcher = jest
      .fn()
      .mockImplementationOnce(async () => ['foo'])
      .mockImplementationOnce(async () => ['bar']);

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher }),
      { initialProps: { query: null } },
    );

    expect(searcher).toHaveBeenCalledWith(null, { signal: expect.any(AbortSignal) });
    expect(result.current).toEqual([null, true, null]);
    await waitForNextUpdate();
    expect(result.current).toEqual([['foo'], false, null]);

    rerender({ query: 'foo' });
    expect(searcher).toHaveBeenCalledWith('foo', { signal: expect.any(AbortSignal) });
    expect(result.current).toEqual([['foo'], true, null]);
    await waitForNextUpdate();
    expect(result.current).toEqual([['bar'], false, null]);
  });

  it('does not change the search results if null is returned', async () => {
    const searcher = jest
      .fn()
      .mockImplementationOnce(async () => ['foo'])
      .mockImplementationOnce(async () => null)
      .mockImplementationOnce(async () => [])
      .mockImplementationOnce(async () => null);

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher }),
      { initialProps: { query: 'foo' } },
    );

    // ['foo'] returned
    await waitForNextUpdate();
    expect(result.current).toEqual([['foo'], false, null]);

    // null returned
    rerender({ query: '1' });
    expect(result.current).toEqual([['foo'], true, null]);
    await waitForNextUpdate();
    expect(result.current).toEqual([['foo'], false, null]);

    // [] returned
    rerender({ query: '2' });
    expect(result.current).toEqual([['foo'], true, null]);
    await waitForNextUpdate();
    expect(result.current).toEqual([[], false, null]);

    // null returned
    rerender({ query: '3' });
    expect(result.current).toEqual([[], true, null]);
    await waitForNextUpdate();
    expect(result.current).toEqual([[], false, null]);
  });

  it('cancels and removes out of sync returns', async () => {
    let resolve1;
    const promise1 = new Promise((resolve) => {
      resolve1 = resolve;
    });
    let resolve2;
    const promise2 = new Promise((resolve) => {
      resolve2 = resolve;
    });

    const searcher = jest
      .fn()
      .mockImplementationOnce(() => promise1)
      .mockImplementationOnce(() => promise2);

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher }),
      { initialProps: { query: 'foo' } },
    );

    expect(result.current).toEqual([null, true, null]);
    expect(searcher).toHaveBeenLastCalledWith('foo', { signal: expect.objectContaining({ aborted: false }) });

    // Second search
    rerender({ query: 'bar' });
    expect(searcher).toHaveBeenLastCalledWith('bar', { signal: expect.objectContaining({ aborted: false }) });
    expect(result.current).toEqual([null, true, null]);

    // Check abort signal on first search
    expect(searcher.mock.calls[0][1].signal.aborted).toEqual(true);

    // Resolve second search
    resolve2(['foo']);
    await waitForNextUpdate();
    expect(result.current).toEqual([['foo'], false, null]);

    // Resolve first search - nothing should happen
    resolve1(['bar']);
    expect(result.current).toEqual([['foo'], false, null]);
  });
});

describe('minLength', () => {
  it('runs a search when minLength is met', async () => {
    const searcher = jest.fn(() => ['foo']);

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher, minLength: 2 }),
      { initialProps: { query: null } },
    );

    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([null, false, null]);

    rerender({ query: 'f' });
    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([null, false, null]);

    // Trimmed search
    rerender({ query: 'f ' });
    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([null, false, null]);

    rerender({ query: 'fo' });
    expect(searcher).toHaveBeenCalledWith('fo', { signal: expect.any(AbortSignal) });
    await waitForNextUpdate();
    expect(result.current).toEqual([['foo'], false, null]);
  });
});

describe('debounce', () => {
  it('debounces starting a search', async () => {
    jest.useFakeTimers();
    const searcher = jest.fn(() => ['foo']);

    const { result, rerender } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher, debounce: 200 }),
      { initialProps: { query: null } },
    );

    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([null, false, null]);

    rerender({ query: 'f' });
    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([null, false, null]);

    await act(async () => {
      jest.advanceTimersByTime(199);
    });

    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([null, false, null]);

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(searcher).toHaveBeenCalledTimes(1);
    expect(searcher).toHaveBeenCalledWith('f', { signal: expect.any(AbortSignal) });
    expect(result.current).toEqual([['foo'], false, null]);
  });
});

describe('emptyOptions', () => {
  it('returns emptyOptions with no search term', async () => {
    const searcher = jest.fn(() => ['bar']);

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher, emptyOptions: ['foo'] }),
      { initialProps: { query: null } },
    );

    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([['foo'], false, null]);

    rerender({ query: '' });
    expect(searcher).not.toHaveBeenCalled();
    expect(result.current).toEqual([['foo'], false, null]);

    rerender({ query: 'f' });
    expect(searcher).toHaveBeenCalledWith('f', { signal: expect.any(AbortSignal) });
    await waitForNextUpdate();
    expect(result.current).toEqual([['bar'], false, null]);

    rerender({ query: '' });
    expect(result.current).toEqual([['foo'], false, null]);
  });
});

describe('catchErrors', () => {
  it('catches errors', async () => {
    const error = new Error('foo');
    const searcher = jest.fn(() => {
      throw error;
    });

    const { result } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher, catchErrors: true }),
      { initialProps: { query: null } },
    );

    expect(result.current).toEqual([null, false, error]);
  });

  it('catches abort errors', async () => {
    const searcher = jest.fn(() => {
      throw new DOMException('', 'AbortError');
    });

    const { result } = renderHook(
      ({ query }) => useAsyncSearch(query, { searcher }),
      { initialProps: { query: null } },
    );

    expect(result.current).toEqual([null, false, null]);
  });
});