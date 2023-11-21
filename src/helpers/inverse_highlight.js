import { normaliseHighlight } from './normalise_highlight';

const rSpaces = /^(\s*)(.*?)(\s*)$/;

/**
 * Inverse a highlight
 * This will avoid highlighting lone spaces or spaces at the beginning or end of a highlight
 */
export function inverseHighlight(highlight) {
  return normaliseHighlight(
    highlight.flatMap((item) => {
      if (Array.isArray(item)) {
        return item;
      }
      if (item) {
        const parts = item.match(rSpaces);
        return [parts[1], parts[2] && [parts[2]], parts[3]];
      }
      return '';
    }),
  );
}
