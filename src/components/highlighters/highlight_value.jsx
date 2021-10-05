import React from 'react';
import { Highlight } from '../highlight';
import { isIE } from '../../sniffers/is_ie';

function emptyHighlight(highlight) {
  return !highlight.length || (highlight.length === 1 && typeof highlight[0] === 'string');
}

export function highlightValue(
  highlighter,
  { inverse, search: _search, property, ...options } = {},
) {
  // eslint-disable-next-line react/prop-types
  return ({ children }, state, componentProps) => {
    const { value, visuallyHiddenClassName } = componentProps;
    const { search, option } = state;

    if (!children) {
      return children;
    }

    const term = property ? option?.value?.[property] ?? children : children;
    const highlighted = highlighter(term, _search ?? (search || value?.label || ''), options, state, componentProps);

    if (emptyHighlight(highlighted)) {
      return highlighted.join('');
    }

    if (isIE()) {
      // IE ignores aria-hidden, however it also doesn't suffer from the inline element issue
      return (
        <Highlight inverse={inverse}>
          {highlighted}
        </Highlight>
      );
    }

    // Accessible naming treats inline elements as block and adds additional white space
    return (
      <>
        <span className={visuallyHiddenClassName}>
          {highlighted.join('')}
        </span>
        <span aria-hidden="true">
          <Highlight inverse={inverse}>
            {highlighted}
          </Highlight>
        </span>
      </>
    );
  };
}
