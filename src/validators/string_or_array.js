import PropTypes from 'prop-types';

export const stringOrArray = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
]);
