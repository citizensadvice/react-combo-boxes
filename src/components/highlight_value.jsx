import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { Context } from '../context';

export function HighlightValue({ children: value, highlight, inverse, search: _search, ...props }) {
  const { search, props: { value: _value } } = useContext(Context);
  return (
    <Highlight inverse={inverse}>
      {highlight(value ?? '', _search ?? (search || _value?.label), props)}
    </Highlight>
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
