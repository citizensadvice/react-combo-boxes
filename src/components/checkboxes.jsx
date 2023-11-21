import { Fragment, useCallback, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { renderGroupedOptions } from '../helpers/render_grouped_options';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';

export const Checkboxes = memo((rawProps) => {
  const optionisedProps = Object.freeze({
    ...rawProps,
    ...useNormalisedOptions(rawProps),
  });

  const {
    classPrefix,
    groupClassPrefix,
    name,
    onChange,
    onValues,
    options,
    renderWrapper,
    renderInput,
    renderLabel,
    renderLabelWrapper,
    renderDescription,
    renderGroup,
    renderGroupLabel,
    renderGroupAccessibleLabel,
    selectedOptions,
  } = optionisedProps;

  const checkboxRef = useRef(new Map());

  const handleRef = useCallback((identity, el, ref) => {
    if (el) {
      checkboxRef.current.set(identity, el);
    } else {
      checkboxRef.current.delete(identity);
    }

    // Allow combination with a passed ref
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el; // eslint-disable-line no-param-reassign
    }
  }, []);

  function handleChange(e) {
    // When getting the checked values,
    // we need to get all the current checked values directly from the DOM
    // If we only use the event target and combine with this selectedOptions
    // we risk loosing values if selectedOptions is slow to update

    const identities = [];
    checkboxRef.current.forEach((value, key) => {
      if (value.checked) {
        identities.push(key);
      }
    });
    onValues?.(
      options
        .filter((o) => identities.includes(o.identity))
        .map((o) => o.value),
    );
    onChange?.(e);
  }

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
      const checked = selectedOptions.some(
        (item) => item.identity === identity,
      );

      return renderWrapper(
        {
          className: makeBEMClass(classPrefix),
          children: (
            <>
              {renderInput(
                {
                  'aria-describedby': description ? `${key}_description` : null,
                  checked,
                  disabled,
                  id: key,
                  name,
                  onChange: handleChange,
                  type: 'checkbox',
                  value: identity,
                  className: makeBEMClass(classPrefix, 'input'),
                  ...html,
                  ref: (el) => handleRef(identity, el, html?.ref),
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
});

Checkboxes.propTypes = {
  classPrefix: PropTypes.string,
  groupClassPrefix: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onValues: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  values: PropTypes.arrayOf(PropTypes.any),
  renderWrapper: PropTypes.func,
  renderInput: PropTypes.func,
  renderLabel: PropTypes.func,
  renderLabelWrapper: PropTypes.func,
  renderDescription: PropTypes.func,
  renderGroup: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderGroupAccessibleLabel: PropTypes.func,
};

Checkboxes.defaultProps = {
  classPrefix: `${defaultClassPrefix}checkbox`,
  groupClassPrefix: `${defaultClassPrefix}checkbox-group`,
  onValues: undefined,
  onChange: undefined,
  values: null,
  renderWrapper: (props) => <div {...props} />,
  renderInput: (props) => <input {...props} />,
  renderLabel: (props) => <label {...props} />,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  renderLabelWrapper: (props) => <Fragment {...props} />,
  renderDescription: (props) => <div {...props} />,
  renderGroup: (props) => <div {...props} />,
  renderGroupLabel: (props) => <div {...props} />,
  renderGroupAccessibleLabel: (props) => <span {...props} />,
};

Checkboxes.displayName = 'Checkboxes';
