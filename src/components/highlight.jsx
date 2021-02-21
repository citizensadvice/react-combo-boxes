import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inverseHighlight } from '../helpers/inverse_highlight';

export function Highlight({ children, inverse }) {
  let highlighted = children;
  if (inverse) {
    highlighted = inverseHighlight(highlighted);
  }
  const parts = highlighted.map((part) => (Array.isArray(part)
    ? <mark>{part}</mark>
    : part
  ));
  return React.createElement(Fragment, null, ...parts);
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
