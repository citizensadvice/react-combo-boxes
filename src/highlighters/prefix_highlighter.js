/**
 * Highlights a term at the start of a query
 *
 * prefixHighlighter('foobarfoo', 'foo')
 * = [['foo'], 'barfoo']
 */
export function prefixHighlighter(term, query) {
  if (!term || !query) {
    return [term || ''];
  }

  if (query && term.toLowerCase().startsWith(query.toLowerCase())) {
    return [[term.slice(0, query.length)], term.slice(query.length)].filter(
      Boolean,
    );
  }

  return [term];
}
