import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { prefixHighlighter } from '../../highlighters/prefix_highlighter';

export function PrefixHighlight({ value = '', search = '', inverse = false }) {
  return (
    <Highlight inverse={inverse}>
      {prefixHighlighter(value || '', search || '')}
    </Highlight>
  );
}

PrefixHighlight.propTypes = {
  value: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};
