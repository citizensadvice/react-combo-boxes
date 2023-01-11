import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { tokenHighlighter } from '../../highlighters/token_highlighter';

export function TokenHighlight({ value, search, inverse }) {
  return (
    <Highlight inverse={inverse}>
      {tokenHighlighter(value || '', search || '')}
    </Highlight>
  );
}

TokenHighlight.propTypes = {
  value: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};

TokenHighlight.defaultProps = {
  value: '',
  search: '',
  inverse: false,
};
