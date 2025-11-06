import { memo } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { tokenHighlighter } from '../../highlighters/token_highlighter';

export const TokenHighlight = memo(
  ({ value = '', search = '', inverse = false }) => {
    return (
      <Highlight inverse={inverse}>
        {tokenHighlighter(value || '', search || '')}
      </Highlight>
    );
  },
);

TokenHighlight.displayName = 'TokenHighlight';

TokenHighlight.propTypes = {
  value: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};
