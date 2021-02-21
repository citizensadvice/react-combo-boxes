import { useReducer, useEffect } from 'react';
import { shallowEqualObjects } from 'shallow-equal';

export function useAsyncSearch(
  query,
  { searcher, debounce, minLength, emptyOptions, catchErrors = false } = {},
) {
  const [{ options, busy, error }, dispatch] = useReducer(
    (state, action) => {
      const result = { ...state, ...action };
      if (shallowEqualObjects(state, result)) {
        return state;
      }
      return result;
    },
    { options: emptyOptions || null, busy: false, error: null },
  );

  useEffect(() => {
    let stop = false;
    let timeout = null;
    const cancel = new AbortController();

    const search = async () => {
      let results;
      dispatch({ busy: true, error: null });
      try {
        results = await searcher(query, { signal: cancel.signal });
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') {
          if (!stop) {
            dispatch({ busy: false, error: null });
          }
          return;
        }

        if (!catchErrors) {
          throw e;
        }

        if (stop) {
          return;
        }
        dispatch({ busy: false, error: e, options: null });
        return;
      }
      if (stop) {
        return;
      }

      if (results === null) {
        dispatch({ busy: false, error: null });
        return;
      }
      dispatch({ options: results, busy: false, error: null });
    };

    if (!query?.trim() && emptyOptions) {
      dispatch({ busy: false, options: emptyOptions, error: null });
      return undefined;
    }

    if (minLength && (!query || query?.trim().length < minLength)) {
      dispatch({ busy: false, options: null, error: null });
      return undefined;
    }

    if (debounce) {
      timeout = setTimeout(search, debounce);
    } else {
      search();
    }

    return () => {
      stop = true;
      clearTimeout(timeout);
      cancel.abort();
    };
    // Don't include emptyOptions / searcher as it leads to infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, debounce, minLength, catchErrors]);
  return [options, busy, error];
}
