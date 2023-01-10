import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { substringHighlighter } from '../../highlighters/substring_highlighter';

export function SubstringHighlight({ value, search, inverse }) {
  return (
    <Highlight inverse={inverse}>
      {substringHighlighter(value || '', search || '')}
    </Highlight>
  );
}

SubstringHighlight.propTypes = {
  value: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};

SubstringHighlight.defaultProps = {
  value: '',
  search: '',
  inverse: false,
};
