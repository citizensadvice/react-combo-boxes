import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

function xor(condition, inverse) {
  return (condition ? 1 : 0) ^ (inverse ? 1 : 0); // eslint-disable-line no-bitwise
}

export function Highlight({ children, inverse }) {
  const parts = children.map((part) => (xor(Array.isArray(part), inverse)
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
