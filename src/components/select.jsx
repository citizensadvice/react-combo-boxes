import React, { useCallback, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { renderGroupedOptions } from '../helpers/render_grouped_options';

export const Select = forwardRef((rawProps, ref) => {
  const {
    options, onChange, onValue, value: _, selectedOption,
    optionProps, optgroupProps,
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
          return (
            <optgroup
              key={key}
              label={label}
              {...optgroupProps}
              {...html}
            >
              {children}
            </optgroup>
          );
        },
        // eslint-disable-next-line react/prop-types
        renderOption({ identity, label, key, html, disabled }) {
          return (
            <option
              value={identity}
              key={key}
              disabled={disabled}
              {...optionProps}
              {...html}
            >
              {label}
            </option>
          );
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
  optionProps: PropTypes.object,
  optgroupProps: PropTypes.object,
};

Select.defaultProps = {
  placeholder: null,
  value: null,
  onChange: null,
  onValue: null,
  optionProps: null,
  optgroupProps: null,
};

Select.displayName = 'Select';
