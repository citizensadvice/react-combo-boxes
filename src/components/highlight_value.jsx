import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { Context } from '../context';

export function HighlightValue({ children: value, highlight, inverse, ...props }) {
  const context = useContext(Context);
  const { search, props: { value: _value } } = context;
  return (
    <Highlight inverse={inverse}>
      {highlight(value, search || _value?.label, context, props)}
    </Highlight>
  );
}

HighlightValue.propTypes = {
  children: PropTypes.string,
  highlight: PropTypes.func.isRequired,
  inverse: PropTypes.bool,
};

HighlightValue.defaultProps = {
  children: '',
  inverse: false,
};
