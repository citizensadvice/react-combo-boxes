import { highlightValue } from './highlight_value';
import { delimitedHighlighter } from '../../highlighters/delimited_highlighter';

export function delimitedHighlight(...args) {
  return highlightValue(delimitedHighlighter, ...args);
}
