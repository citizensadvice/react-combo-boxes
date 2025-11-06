import { memo } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight';
import { prefixHighlighter } from '../../highlighters/prefix_highlighter';

export const PrefixHighlight = memo(
  ({ value = '', search = '', inverse = false }) => {
    return (
      <Highlight inverse={inverse}>
        {prefixHighlighter(value || '', search || '')}
      </Highlight>
    );
  },
);

PrefixHighlight.displayName = 'PrefixHighlight';

PrefixHighlight.propTypes = {
  value: PropTypes.string,
  search: PropTypes.string,
  inverse: PropTypes.bool,
};
