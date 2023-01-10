import PropTypes from 'prop-types';
import { Highlight } from '../highlight';
import { substringHighlighter } from '../../highlighters/substring_highlighter';

export function SubstringHighlight({ label, search, inverse }) {
  return (
    <Highlight inverse={inverse}>
      {substringHighlighter(label || '', search || '')}
    </Highlight>
  );
}

SubstringHighlight.propTypes = {
  label: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};

SubstringHighlight.defaultProps = {
  label: '',
  search: '',
  inverse: false,
};
