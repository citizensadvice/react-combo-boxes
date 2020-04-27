import React from 'react';
import { HighlightValue } from '../highlight_value';
import { preHighlighter } from '../../highlighters/pre_highlighter';

export function PreHighlight(props) {
  return (
    <HighlightValue
      highlight={preHighlighter}
      {...props}
    />
  );
}
