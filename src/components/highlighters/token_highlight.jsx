import React from 'react';
import { HighlightValue } from '../highlight_value';
import { tokenHighlighter } from '../../highlighters/token_highlighter';

export function TokenHighlight(props) {
  return (
    <HighlightValue
      highlight={tokenHighlighter}
      {...props}
    />
  );
}
