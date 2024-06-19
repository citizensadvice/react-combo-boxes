import { useCallback, useMemo, forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { renderGroupedOptions } from '../helpers/render_grouped_options';

const defaultRenderOption = ({ key, ...props }) => (
  <option
    key={key}
    {...props}
  />
);
const defaultRenderOptGroup = ({ key, ...props }) => (
  <optgroup
    key={key}
    {...props}
  />
);

export const Select = memo(
  forwardRef(
    (
      {
        id,
        options: rawOptions,
        mapOption,
        placeholderOption = null,
        multiple = false,
        value,
        values = null,
        onChange = null,
        onValue = null,
        onValues = null,
        renderOption = defaultRenderOption,
        renderOptGroup = defaultRenderOptGroup,
        ...props
      },
      ref,
    ) => {
      const normalisedOptions = useNormalisedOptions({
        id,
        options: rawOptions,
        placeholderOption,
        value,
        values,
        mapOption,
        mustHaveSelection: true,
      });

      const optionisedProps = Object.freeze({
        id,
        mapOption,
        multiple,
        onChange,
        onValue,
        onValues,
        renderOption,
        renderOptGroup,
        ...props,
        ...normalisedOptions,
      });

      const { options, selectedOption, selectedOptions } = normalisedOptions;

      const handleChange = useCallback(
        (e) => {
          onValues?.(
            [...e.target.selectedOptions].map(
              (el) =>
                options.find((o) => (o.identity ?? '') === el.value)?.value,
            ),
          );
          onValue?.(
            options.find((o) => (o.identity ?? '') === e.target.value)?.value,
          );
          onChange?.(e);
        },
        [onValue, onValues, onChange, options],
      );

      const reactValue = useMemo(() => {
        if (multiple) {
          return selectedOptions.map((o) => o?.identity ?? '');
        }
        return selectedOption?.identity ?? '';
      }, [selectedOption, selectedOptions, multiple]);

      return (
        <select
          value={reactValue}
          onChange={handleChange}
          ref={ref}
          multiple={multiple}
          {...props}
        >
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { children, key, label, html } = group;
              return renderOptGroup(
                {
                  children,
                  key,
                  label,
                  ...html,
                },
                { group },
                optionisedProps,
              );
            },

            renderOption(option) {
              const { identity, label, key, html, disabled, group } = option;
              return renderOption(
                {
                  children: label,
                  disabled,
                  key,
                  value: identity,
                  ...html,
                },
                { option, group },
                optionisedProps,
              );
            },
          })}
        </select>
      );
    },
  ),
);

Select.propTypes = {
  id: PropTypes.string,
  placeholderOption: PropTypes.string,
  mapOption: PropTypes.func,
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

Select.displayName = 'Select';
