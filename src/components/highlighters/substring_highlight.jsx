import { highlightValue } from './highlight_value';
import { substringHighlighter } from '../../highlighters/substring_highlighter';

export function substringHighlight(...args) {
  return highlightValue(substringHighlighter, ...args);
}
