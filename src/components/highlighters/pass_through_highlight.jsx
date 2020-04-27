import React from 'react';
import { HighlightValue } from '../highlight_value';
import { passThroughHighlighter } from '../../highlighters/pass_through_highlighter';

export function PassThroughHighlight(props) {
  return (
    <HighlightValue
      highlight={passThroughHighlighter}
      {...props}
    />
  );
}
