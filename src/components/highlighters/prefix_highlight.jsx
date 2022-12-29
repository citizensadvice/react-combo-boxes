import PropTypes from 'prop-types';
import { Highlight } from '../highlight';
import { prefixHighlighter } from '../../highlighters/prefix_highlighter';

export function PrefixHighlight({ label, search, inverse }) {
  return (
    <Highlight inverse={inverse}>
      {prefixHighlighter(label || '', search || '')}
    </Highlight>
  );
}

PrefixHighlight.propTypes = {
  label: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};

PrefixHighlight.defaultProps = {
  label: '',
  search: '',
  inverse: false,
};
