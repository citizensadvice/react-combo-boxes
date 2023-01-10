import { useReducer, useEffect } from 'react';
import { shallowEqualObjects } from 'shallow-equal';
import { useEvent } from './use_event';

export function useAsyncSearch(
  query,
  { searcher, debounce, catchErrors = false } = {},
) {
  const [{ options, busy, error }, dispatch] = useReducer(
    (state, action) => {
      const result = { ...state, ...action };
      if (shallowEqualObjects(state, result)) {
        return state;
      }
      return result;
    },
    { options: undefined, busy: false, error: null },
  );

  const runSearch = useEvent(async (cancel) => {
    let results;
    dispatch({ busy: true, error: null });
    try {
      results = await searcher(query, { signal: cancel.signal });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return;
      }

      if (!catchErrors) {
        throw e;
      }

      if (cancel.signal.aborted) {
        return;
      }
      dispatch({ busy: false, error: e, options: undefined });
      return;
    }
    if (cancel.signal.aborted) {
      return;
    }

    dispatch({ options: results, busy: false, error: null });
  });

  useEffect(() => {
    let timeout = null;
    const cancel = new AbortController();

    if (debounce) {
      timeout = setTimeout(() => runSearch(cancel), debounce);
    } else {
      runSearch(cancel);
    }

    return () => {
      clearTimeout(timeout);
      cancel.abort();
    };
  }, [query, debounce, catchErrors, runSearch]);

  return [options, busy, error];
}
