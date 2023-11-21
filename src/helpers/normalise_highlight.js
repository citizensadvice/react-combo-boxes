/**
 * Filters out empty strings and joins consecutive strings
 */
export function normaliseHighlight(highlight) {
  let normalised = highlight
    .filter(Boolean)
    .reduce((collection, part) => {
      if (
        part &&
        typeof part === 'string' &&
        typeof collection[0] === 'string'
      ) {
        collection[0] += part;
      } else if (
        Array.isArray(collection[0]) &&
        Array.isArray(part) &&
        part[0]
      ) {
        collection[0][0] += part[0];
      } else if (part && part[0]) {
        collection.unshift(part);
      }
      return collection;
    }, [])
    .reverse();

  if (String.prototype.normalize) {
    // Renormalise as Open Sans can't cope with canonical composition
    normalised = normalised.map((item) =>
      typeof item === 'string'
        ? item.normalize('NFC')
        : [item[0].normalize('NFC')],
    );
  }

  return normalised.length ? normalised : [''];
}
