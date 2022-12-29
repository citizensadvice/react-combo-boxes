import PropTypes from 'prop-types';
import { Highlight } from '../highlight';
import { delimitedHighlighter } from '../../highlighters/delimited_highlighter';

export function DelimitedHighlight({ label, inverse, start, end }) {
  return (
    <Highlight inverse={inverse}>
      {delimitedHighlighter(label || '', { start, end })}
    </Highlight>
  );
}

DelimitedHighlight.propTypes = {
  label: PropTypes.string,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  inverse: PropTypes.bool,
};

DelimitedHighlight.defaultProps = {
  label: '',
  inverse: false,
};
