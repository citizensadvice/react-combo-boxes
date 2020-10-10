import { useCallback, useReducer, useRef, useEffect } from 'react';

const defaultOptions = Object.freeze([]);

export function useSearch(
  fn,
  { initialOptions, debounce, minLength, emptyOptions } = {},
) {
  const [{ options, busy }, dispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    { options: initialOptions || defaultOptions, busy: false },
  );

  const lastSearchRef = useRef();
  const timeoutRef = useRef();
  const unmountedRef = useRef(false);

  const search = useCallback(async (query, currentSearch) => {
    dispatch({ busy: true });
    const results = await fn(query);
    // Prevent out of sync returns clobbering the results
    if (lastSearchRef.current !== currentSearch || unmountedRef.current) {
      return;
    }
    if (results === null) {
      dispatch({ busy: null });
      return;
    }
    dispatch({ options: results, busy: false });
  }, [fn]);

  const onSearch = useCallback((query) => {
    lastSearchRef.current = {};
    if (!query.trim() && emptyOptions) {
      dispatch({ busy: false, options: emptyOptions });
      return;
    }
    if (minLength && query.trim().length < minLength) {
      dispatch({ busy: null, options: [] });
      return;
    }
    dispatch({ busy: null });

    if (debounce) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        search(query, lastSearchRef.current);
      }, debounce);
    } else {
      search(query, lastSearchRef.current);
    }
  }, [search, debounce, minLength, emptyOptions]);

  useEffect(() => () => {
    unmountedRef.current = true;
    clearTimeout(timeoutRef.current);
  }, []);

  return [options, onSearch, busy];
}
