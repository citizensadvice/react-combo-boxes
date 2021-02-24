import { highlightValue } from './highlight_value';
import { prefixHighlighter } from '../../highlighters/prefix_highlighter';

export function prefixHighlight(options) {
  return highlightValue(prefixHighlighter, options);
}
