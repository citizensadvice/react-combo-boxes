import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { Context } from '../context';
import { isIE } from '../sniffers/is_ie';

function emptyHighlight(highlight) {
  return !highlight.length || (highlight.length === 1 && typeof highlight[0] === 'string');
}

export function HighlightValue({ children: value, highlight, inverse, search: _search, ...props }) {
  const { search, props: { value: _value, visuallyHiddenClassName } } = useContext(Context);
  const highlighted = highlight(value ?? '', _search ?? (search || _value?.label), props);

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

HighlightValue.propTypes = {
  children: PropTypes.string,
  highlight: PropTypes.func.isRequired,
  inverse: PropTypes.bool,
  search: PropTypes.string,
};

HighlightValue.defaultProps = {
  children: '',
  inverse: false,
  search: undefined,
};
