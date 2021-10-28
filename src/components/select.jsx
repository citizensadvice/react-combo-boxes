import React, { useCallback, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { renderGroupedOptions } from '../helpers/render_grouped_options';

export const Select = forwardRef((rawProps, ref) => {
  const optionisedProps = Object.freeze({
    ...rawProps,
    ...useNormalisedOptions(rawProps, { mustHaveSelection: true }),
  });

  const {
    multiple,
    onChange,
    onValue,
    onValues,
    options,
    renderOption,
    renderOptGroup,
    selectedOption,
    selectedOptions,
    value: _0,
    values: _1,
    placeholderOption: _2,
    mapOption: _3,
    nullOptions: _4,
    ...selectProps
  } = optionisedProps;

  const handleChange = useCallback((e) => {
    onValues?.([...e.target.selectedOptions].map((el) => (
      options.find((o) => o.identity === el.value)?.value
    )));
    onValue?.(options.find((o) => o.identity === e.target.value)?.value);
    onChange?.(e);
  }, [onValue, onValues, onChange, options]);

  const reactValue = useMemo(() => {
    if (multiple) {
      return selectedOptions.map((o) => o?.identity);
    }
    return selectedOption?.identity ?? '';
  }, [selectedOption, selectedOptions, multiple]);

  return (
    <select
      value={reactValue}
      onChange={handleChange}
      ref={ref}
      multiple={multiple}
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
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  onValue: PropTypes.func,
  onValues: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any,
  values: PropTypes.arrayOf(PropTypes.any),
  renderOption: PropTypes.func,
  renderOptGroup: PropTypes.func,
};

Select.defaultProps = {
  placeholderOption: null,
  multiple: false,
  value: null,
  values: null,
  onChange: null,
  onValue: null,
  onValues: null,
  renderOption: (props) => <option {...props} />,
  renderOptGroup: (props) => <optgroup {...props} />,
};

Select.displayName = 'Select';
