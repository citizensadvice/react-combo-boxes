import { Fragment, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { renderGroupedOptions } from '../helpers/render_grouped_options';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';

const defaultRenderWrapper = ({ key, ...props }) => (
  <div
    key={key}
    {...props}
  />
);
const defaultRenderInput = (props) => <input {...props} />;
const defaultRenderLabel = (props) => <label {...props} />;
// eslint-disable-next-line react/jsx-no-useless-fragment
const defaultRenderLabelWrapper = (props) => <Fragment {...props} />;
const defaultRenderDescription = (props) => <div {...props} />;
const defaultRenderGroup = ({ key, ...props }) => (
  <div
    key={key}
    {...props}
  />
);
const defaultRenderGroupLabel = (props) => <div {...props} />;
const defaultRenderGroupAccessibleLabel = (props) => <span {...props} />;

export const Radios = memo(
  ({
    classPrefix = `${defaultClassPrefix}radio`,
    groupClassPrefix = `${defaultClassPrefix}radio-group`,
    onChange = null,
    onValue = null,
    name,
    renderWrapper = defaultRenderWrapper,
    renderInput = defaultRenderInput,
    renderLabel = defaultRenderLabel,
    renderLabelWrapper = defaultRenderLabelWrapper,
    renderDescription = defaultRenderDescription,
    renderGroup = defaultRenderGroup,
    renderGroupLabel = defaultRenderGroupLabel,
    renderGroupAccessibleLabel = defaultRenderGroupAccessibleLabel,
    required = false,
    value: _value = null,
    ...rawProps
  }) => {
    const optionisedProps = Object.freeze({
      classPrefix,
      groupClassPrefix,
      onChange,
      onValue,
      renderWrapper,
      renderInput,
      renderLabel,
      renderLabelWrapper,
      renderDescription,
      renderGroup,
      renderGroupLabel,
      renderGroupAccessibleLabel,
      required,
      ...rawProps,
      ...useNormalisedOptions({
        ...rawProps,
        value: _value,
        placeholderOption: undefined,
      }),
    });

    const { options, selectedOption } = optionisedProps;

    const handleChange = useCallback(
      (e) => {
        onValue?.(options.find((o) => o.identity === e.target.value)?.value);
        onChange?.(e);
      },
      [onChange, onValue, options],
    );

    return renderGroupedOptions({
      options,
      renderGroup(group) {
        const { children, key, label, html } = group;
        return renderGroup(
          {
            key,
            className: makeBEMClass(groupClassPrefix),
            children: (
              <>
                {renderGroupLabel(
                  {
                    children: label,
                    className: makeBEMClass(groupClassPrefix, 'label'),
                    ...html,
                  },
                  { group },
                  optionisedProps,
                )}
                {children}
              </>
            ),
          },
          { group },
          optionisedProps,
        );
      },
      renderOption(option) {
        const { identity, label, key, html, disabled, description, group } =
          option;
        const checked = selectedOption?.identity === identity;

        return renderWrapper(
          {
            className: makeBEMClass(classPrefix),
            children: (
              <>
                {renderInput(
                  {
                    'aria-describedby': description
                      ? `${key}_description`
                      : null,
                    checked,
                    disabled,
                    id: key,
                    name,
                    onChange: handleChange,
                    type: 'radio',
                    value: identity,
                    required,
                    className: makeBEMClass(classPrefix, 'input'),
                    ...html,
                  },
                  { option, checked },
                  optionisedProps,
                )}
                {renderLabelWrapper({
                  children: (
                    <>
                      {renderLabel(
                        {
                          htmlFor: key,
                          children: (
                            <>
                              {group
                                ? renderGroupAccessibleLabel(
                                    {
                                      className: visuallyHiddenClassName,
                                      children: `${group.label} `,
                                    },
                                    { group },
                                    optionisedProps,
                                  )
                                : null}
                              {label}
                            </>
                          ),
                          className: makeBEMClass(classPrefix, 'label'),
                        },
                        { option, checked },
                        optionisedProps,
                      )}
                      {description && ' '}
                      {!!description &&
                        renderDescription(
                          {
                            id: `${key}_description`,
                            children: description,
                            className: makeBEMClass(classPrefix, 'description'),
                          },
                          { option, group, checked },
                          optionisedProps,
                        )}
                    </>
                  ),
                })}
              </>
            ),
            key,
          },
          { option, group, checked },
          optionisedProps,
        );
      },
    });
  },
);

Radios.propTypes = {
  classPrefix: PropTypes.string,
  groupClassPrefix: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onValue: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any,
  required: PropTypes.bool,
  renderWrapper: PropTypes.func,
  renderInput: PropTypes.func,
  renderLabel: PropTypes.func,
  renderLabelWrapper: PropTypes.func,
  renderDescription: PropTypes.func,
  renderGroup: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderGroupAccessibleLabel: PropTypes.func,
};

Radios.displayName = 'Radios';
