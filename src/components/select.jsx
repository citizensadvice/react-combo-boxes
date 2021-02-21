import React, { useCallback, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { renderGroupedOptions } from '../helpers/render_grouped_options';

export const Select = forwardRef((rawProps, ref) => {
  const {
    options, onChange, onValue, value: _0, nullOptions: _1, selectedOption,
    renderOption, renderOptGroup,
    ...props
  } = useNormalisedOptions(rawProps, { mustHaveSelection: true });

  const handleChange = useCallback((e) => {
    onValue?.(options.find((o) => o.identity === e.target.value)?.value);
    onChange?.(e);
  }, [onValue, onChange, options]);

  return (
    <select
      value={selectedOption?.identity ?? ''}
      onChange={handleChange}
      ref={ref}
      {...props}
    >
      {renderGroupedOptions({
        options,
        renderGroup({ key, html, children, label }) { // eslint-disable-line react/prop-types
          return renderOptGroup({ key, label, ...html, children });
        },
        // eslint-disable-next-line react/prop-types
        renderOption({ identity, label, key, html, disabled }) {
          return renderOption({ key, value: identity, disabled, ...html, children: label });
        },
      })}
    </select>
  );
});

Select.propTypes = {
  placeholder: PropTypes.node,
  onChange: PropTypes.func,
  onValue: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any,
  renderOption: PropTypes.func,
  renderOptGroup: PropTypes.func,
};

Select.defaultProps = {
  placeholder: null,
  value: null,
  onChange: null,
  onValue: null,
  renderOption: (props) => <option {...props} />,
  renderOptGroup: (props) => <optgroup {...props} />,
};

Select.displayName = 'Select';
