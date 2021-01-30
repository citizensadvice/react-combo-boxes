import { highlightValue } from './highlight_value';
import { passThroughHighlighter } from '../../highlighters/pass_through_highlighter';

export function passThroughHighlight(...args) {
  return highlightValue(passThroughHighlighter, ...args);
}
