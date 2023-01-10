/**
 * Highlights matching terms within a query
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

  const result = [];
  let left = term;
  let index;
  const lowerQuery = query.toLowerCase();

  do {
    index = left.toLowerCase().indexOf(lowerQuery);
    if (index > -1) {
      if (index > 0) {
        result.push(left.slice(0, index));
      }
      result.push([left.slice(index, index + query.length)]);
      left = left.slice(index + query.length);
    }
  } while (index > -1);

  if (left) {
    result.push(left);
  }

  return result;
}
