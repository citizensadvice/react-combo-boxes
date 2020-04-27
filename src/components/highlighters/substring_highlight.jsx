import React from 'react';
import { HighlightValue } from '../highlight_value';
import { substringHighlighter } from '../../highlighters/substring_highlighter';

export function SubstringHighlight(props) {
  return (
    <HighlightValue
      highlight={substringHighlighter}
      {...props}
    />
  );
}
