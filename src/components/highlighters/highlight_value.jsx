import React from 'react';
import { Highlight } from '../highlight';
import { isIE } from '../../sniffers/is_ie';

function emptyHighlight(highlight) {
  return !highlight.length || (highlight.length === 1 && typeof highlight[0] === 'string');
}

export function highlightValue(
  highlighter,
  { children },
  { search },
  { value, visuallyHiddenClassName },
  { inverse, search: _search, ...options } = {},
) {
  const highlighted = highlighter(children ?? '', _search ?? (search || value?.label), options);

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
}