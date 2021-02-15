import { highlightValue } from './highlight_value';
import { tokenHighlighter } from '../../highlighters/token_highlighter';

export function tokenHighlight(...args) {
  return highlightValue(tokenHighlighter, ...args);
}
