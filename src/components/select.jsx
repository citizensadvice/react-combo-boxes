import React, { useCallback, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { renderGroupedOptions } from '../helpers/render_grouped_options';

export const Select = forwardRef((rawProps, ref) => {
  const optionisedProps = Object.freeze({
    ...rawProps,
    ...useNormalisedOptions(rawProps, { mustHaveSelection: true }),
  });

  const {
    onChange,
    onValue,
    options,
    renderOption,
    renderOptGroup,
    selectedOption,
    value: _0,
    placeholderOption: _1,
    mapOption: _2,
    nullOptions: _3,
    ...selectProps
  } = optionisedProps;

  const handleChange = useCallback((e) => {
    onValue?.(options.find((o) => o.identity === e.target.value)?.value);
    onChange?.(e);
  }, [onValue, onChange, options]);

  return (
    <select
      value={selectedOption?.identity ?? ''}
      onChange={handleChange}
      ref={ref}
      {...selectProps}
    >
      {renderGroupedOptions({
        options,
        renderGroup(group) {
          const { children, key, label, html } = group;
          return renderOptGroup({
            children,
            key,
            label,
            ...html,
          }, { group }, optionisedProps);
        },
        // eslint-disable-next-line react/prop-types
        renderOption(option) {
          const { identity, label, key, html, disabled, group } = option;
          return renderOption({
            children: label,
            disabled,
            key,
            value: identity,
            ...html,
          }, { option, group }, optionisedProps);
        },
      })}
    </select>
  );
});

Select.propTypes = {
  placeholderOption: PropTypes.string,
  onChange: PropTypes.func,
  onValue: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any,
  renderOption: PropTypes.func,
  renderOptGroup: PropTypes.func,
};

Select.defaultProps = {
  placeholderOption: null,
  value: null,
  onChange: null,
  onValue: null,
  renderOption: (props) => <option {...props} />,
  renderOptGroup: (props) => <optgroup {...props} />,
};

Select.displayName = 'Select';
