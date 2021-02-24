import { highlightValue } from './highlight_value';
import { substringHighlighter } from '../../highlighters/substring_highlighter';

export function substringHighlight(options) {
  return highlightValue(substringHighlighter, options);
}
