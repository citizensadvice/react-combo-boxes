import { useMemo } from 'react';
import { prefixSearcher } from '../searchers/prefix_searcher';

export function usePrefixSearch(
  query,
  { options, index, minLength, maxResults },
) {
  const searcher = useMemo(
    () => prefixSearcher(options, { index }),
    [options, index],
  );

  return useMemo(() => {
    if (minLength && (!query || query?.trim().length < minLength)) {
      return null;
    }

    const filtered = searcher(query);
    return maxResults ? filtered.slice(0, maxResults) : filtered;
  }, [searcher, query, minLength, maxResults]);
}
