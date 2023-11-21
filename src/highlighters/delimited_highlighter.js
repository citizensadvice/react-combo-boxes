import { normaliseHighlight } from '../helpers/normalise_highlight';

export function delimitedHighlighter(term, { start, end } = {}) {
  if (!term) {
    return [''];
  }

  let index = 0;
  const highlighted = [];
  do {
    const startIndex = term.indexOf(start, index);
    if (startIndex === -1) {
      break;
    }
    const endIndex = term.indexOf(end, startIndex + start.length);
    if (endIndex === -1) {
      break;
    }
    highlighted.push(term.slice(index, startIndex), [
      term.slice(startIndex + start.length, endIndex),
    ]);
    index = endIndex + end.length;
  } while (index < term.length);

  highlighted.push(term.slice(index));

  return normaliseHighlight(highlighted);
}
