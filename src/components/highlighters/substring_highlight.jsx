import { memo } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { substringHighlighter } from '../../highlighters/substring_highlighter';

export const SubstringHighlight = memo(
  ({ value = '', search = '', inverse = false }) => {
    return (
      <Highlight inverse={inverse}>
        {substringHighlighter(value || '', search || '')}
      </Highlight>
    );
  },
);

SubstringHighlight.displayName = 'substringHighlight';

SubstringHighlight.propTypes = {
  value: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};
