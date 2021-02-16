import { useMemo } from 'react';
import { tokenSearcher } from '../searchers/token_searcher';

export function useTokenSearch(
  query,
  { options, index, tokenise, minLength, maxResults },
) {
  const searcher = useMemo(() => (
    tokenSearcher(options, { index, tokenise })
  ), [options, index, tokenise]);

  return useMemo(() => {
    if (minLength && (!query || query?.trim().length < minLength)) {
      return null;
    }

    const filtered = searcher(query);
    return maxResults ? filtered.slice(0, maxResults) : filtered;
  }, [searcher, query, minLength, maxResults]);
}
