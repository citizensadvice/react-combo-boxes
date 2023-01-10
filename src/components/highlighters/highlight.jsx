import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { inverseHighlight } from '../../helpers/inverse_highlight';
import { Context } from '../combo_box/context';

function emptyHighlight(highlight) {
  return !highlight.length || (highlight.length === 1 && typeof highlight[0] === 'string');
}

export function Highlight({ children, inverse }) {
  const { visuallyHiddenClassName } = useContext(Context);
  let highlighted = children;
  if (inverse) {
    highlighted = inverseHighlight(highlighted);
  }

  if (emptyHighlight(highlighted)) {
    return highlighted.join('');
  }

  const parts = highlighted.map((part) => (Array.isArray(part)
    ? <mark>{part}</mark>
    : part
  ));
  const highlight = React.createElement(Fragment, null, ...parts);

  if (parts.length === 1) {
    return highlight;
  }

  // Accessible naming treats inline elements as block and adds additional white space
  return (
    <>
      <span className={visuallyHiddenClassName}>
        {highlighted.join('')}
      </span>
      <span aria-hidden="true">
        {highlight}
      </span>
    </>
  );
}

Highlight.propTypes = {
  children: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  inverse: PropTypes.bool,
};

Highlight.defaultProps = {
  inverse: false,
};
