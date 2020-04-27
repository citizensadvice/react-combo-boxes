import React from 'react';
import { HighlightValue } from '../highlight_value';
import { prefixHighlighter } from '../../highlighters/prefix_highlighter';

export function PrefixHighlight(props) {
  return (
    <HighlightValue
      highlight={prefixHighlighter}
      {...props}
    />
  );
}
