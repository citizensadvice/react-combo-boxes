import { useMemo } from 'react';
import { tokenSearcher } from '../searchers/token_searcher';
import { useSearch } from './use_search';

export function useTokenSearch(options, { index, tokenise, ...more } = {}) {
  const search = useMemo(() => (
    tokenSearcher(options, { index, tokenise })
  ), [options, index, tokenise]);

  const [filteredOptions, onSearch, busy] = useSearch(search, { initialOptions: options, ...more });
  return [filteredOptions, onSearch, busy];
}
