import { useMemo } from 'react';
import { prefixSearcher } from '../searchers/prefix_searcher';
import { useSearch } from './use_search';

export function usePrefixSearch(options, { index, minLength, maxResults, ...more } = {}) {
  const search = useMemo(() => (
    prefixSearcher(options, { index })
  ), [options, index]);

  const initialOptions = minLength > 0 ? null : options;
  const [filteredOptions, onSearch, busy] = useSearch(
    search,
    { initialOptions, minLength, ...more },
  );
  return [
    maxResults ? filteredOptions?.slice(0, maxResults) : filteredOptions,
    onSearch,
    busy,
  ];
}
