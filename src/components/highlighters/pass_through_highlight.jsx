import { highlightValue } from './highlight_value';
import { passThroughHighlighter } from '../../highlighters/pass_through_highlighter';

export function passThroughHighlight(options) {
  return highlightValue(passThroughHighlighter, options);
}
