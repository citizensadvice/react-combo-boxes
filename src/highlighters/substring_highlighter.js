/**
 * Highlights the first term within a query
 *
 * Intended for matching an ilink database query
 *
 * substringHighlighter('foobarfoobar', 'bar')
 * = ['foo', ['bar'], 'foobar']
 */
export function substringHighlighter(term, query) {
  if (!term || !query) {
    return [term || ''];
  }

  const index = term.toLowerCase().indexOf(query.toLowerCase());
  if (index > -1) {
    return [
      term.slice(0, index),
      [term.slice(index, index + query.length)],
      term.slice(index + query.length),
    ].filter(Boolean);
  }

  return [term];
}
