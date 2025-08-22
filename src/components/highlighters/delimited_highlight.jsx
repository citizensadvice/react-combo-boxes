import { memo } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { delimitedHighlighter } from '../../highlighters/delimited_highlighter';

export const DelimitedHighlight = memo(
  ({ value = '', inverse = false, start, end }) => {
    return (
      <Highlight inverse={inverse}>
        {delimitedHighlighter(value || '', { start, end })}
      </Highlight>
    );
  },
);

DelimitedHighlight.displayName = 'DelimitedHighlight';

DelimitedHighlight.propTypes = {
  value: PropTypes.string,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  inverse: PropTypes.bool,
};
