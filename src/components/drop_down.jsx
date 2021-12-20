import React, { Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';
import { joinTokens } from '../helpers/join_tokens';
import { listBoxRenderer as defaultListBoxRenderer } from '../helpers/list_box_renderer';
import { useComboBox } from '../hooks/use_combo_box';

export const DropDown = forwardRef((rawProps, ref) => {
  const {
    wrapperProps,
    inputProps: buttonProps,
    listBoxProps,
    state,
    props: normalisedProps,
  } = useComboBox({ ...rawProps, ref });

  const {
    'aria-labelledby': ariaLabelledBy,
    'aria-invalid': ariaInvalid,
    id,
    role,
    children,
    renderWrapper,
    renderButton,
    disabled,
    classPrefix,
    required,
    value,
    options,
    selectedOption,
    listBoxRenderer,
  } = normalisedProps;

  const {
    focusedOption,
    showListBox,
  } = state;

  const renderState = Object.freeze({
    expanded: showListBox,
    currentOption: focusedOption,
  });

  return (
    renderWrapper({
      ...wrapperProps,
      role,
      children: (
        <>
          {renderButton({
            ...buttonProps,
            'aria-autocomplete': null,
            'aria-disabled': disabled ? 'true' : null,
            'aria-labelledby': joinTokens(ariaLabelledBy, id),
            'aria-required': required ? 'true' : null,
            'aria-invalid': ariaInvalid,
            children: (children ?? value?.label ?? selectedOption?.label) || '\u00A0',
            className: makeBEMClass(classPrefix, 'button'),
            tabIndex: (disabled || !options?.length) ? null : 0,
            value: null,
          }, renderState, normalisedProps)}
          {listBoxRenderer(renderState, normalisedProps, listBoxProps)}
        </>
      ),
    }, renderState, normalisedProps)
  );
});

DropDown.propTypes = {
  'aria-invalid': PropTypes.oneOf(['true', 'false']),
  children: PropTypes.node,
  classPrefix: PropTypes.string,
  disabled: PropTypes.bool,
  expandOnFocus: PropTypes.bool,
  required: PropTypes.bool,
  foundOptionsMessage: PropTypes.func,
  notFoundMessage: PropTypes.node,
  renderWrapper: PropTypes.func,
  renderButton: PropTypes.func,
  renderListBox: PropTypes.func,
  renderListBoxWrapper: PropTypes.func,
  renderOption: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderGroup: PropTypes.func,
  mustHaveSelection: PropTypes.bool,
  editable: PropTypes.bool,
  findOption: PropTypes.func,
  managedFocus: PropTypes.bool,
  selectOnBlur: PropTypes.bool,
  listBoxRenderer: PropTypes.func,
};

DropDown.defaultProps = {
  'aria-invalid': undefined,
  children: null,
  classPrefix: `${defaultClassPrefix}dropdown`,
  disabled: false,
  expandOnFocus: false,
  required: false,
  foundOptionsMessage: null,
  notFoundMessage: null,
  managedFocus: true,
  renderWrapper: (props) => <div {...props} />,
  renderButton: (props) => <div {...props} />,
  renderListBoxWrapper: (props) => <div {...props} />,
  renderListBox: (props) => <ul {...props} />,
  renderOption: (props) => <li {...props} />,
  renderGroupLabel: (props) => <li {...props} />,
  renderGroup: (props) => <Fragment {...props} />,
  mustHaveSelection: true,
  editable: false,
  findOption: undefined,
  selectOnBlur: true,
  listBoxRenderer: defaultListBoxRenderer,
};

DropDown.displayName = 'DropDown';
