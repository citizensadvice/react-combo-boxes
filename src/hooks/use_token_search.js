import { useMemo } from 'react';
import { tokenSearcher } from '../searchers/token_searcher';
import { useSearch } from './use_search';

export function useTokenSearch(
  options,
  { index, tokenise, minLength, maxResults, ...more } = {},
) {
  const search = useMemo(() => (
    tokenSearcher(options, { index, tokenise })
  ), [options, index, tokenise]);

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
