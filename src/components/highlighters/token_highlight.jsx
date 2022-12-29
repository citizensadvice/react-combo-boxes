import PropTypes from 'prop-types';
import { Highlight } from '../highlight';
import { tokenHighlighter } from '../../highlighters/token_highlighter';

export function TokenHighlight({ label, search, inverse }) {
  return (
    <Highlight inverse={inverse}>
      {tokenHighlighter(label || '', search || '')}
    </Highlight>
  );
}

TokenHighlight.propTypes = {
  label: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};

TokenHighlight.defaultProps = {
  label: '',
  search: '',
  inverse: false,
};
