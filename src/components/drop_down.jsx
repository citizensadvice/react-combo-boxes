import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from './combo_box';
import { Searchable } from './searchable';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';
import { findOption as defaultFindOption } from '../helpers/find_option';
import { joinTokens } from '../helpers/join_tokens';

function renderNull() {
  return null;
}

function renderInput(props, state, componentProps) {
  const {
    id,
    classPrefix,
    children,
    disabled,
    options,
    required,
    value,
    selectedOption,
    renderComboBox,
  } = componentProps;
  return renderComboBox(
    {
      ...props,
      'aria-autocomplete': null,
      'aria-disabled': disabled ? 'true' : null,
      'aria-labelledby': joinTokens(props['aria-labelledby'], id),
      'aria-required': required ? 'true' : null,
      autoComplete: null,
      children: (children ?? value?.label ?? selectedOption?.label) || '\u00A0',
      className: makeBEMClass(classPrefix, 'combobox'),
      tabIndex: (disabled || !options?.length) ? null : 0,
      type: null,
      value: null,
    },
    state,
    componentProps,
  );
}

export const DropDown = forwardRef((props, ref) => {
  const { renderWrapper, renderListBox } = props;

  const newRenderWrapper = useCallback((wrapperProps, componentState, componentProps) => (
    <Searchable
      {...wrapperProps}
      componentState={componentState}
      componentProps={{ ...componentProps, renderWrapper }}
    />
  ), [renderWrapper]);

  const newRenderListBox = useCallback((wrapperProps, componentState, componentProps) => (
    componentProps.renderListBoxWrapper(
      {
        className: makeBEMClass(componentProps.classPrefix, 'listbox-wrapper'),
        children: renderListBox(wrapperProps, componentState, componentProps),
      },
      componentState,
      componentProps,
    )
  ), [renderListBox]);

  return (
    <ComboBox
      ref={ref}
      renderInput={renderInput}
      {...props}
      renderWrapper={newRenderWrapper}
      renderListBox={newRenderListBox}
    />
  );
});

DropDown.propTypes = {
  children: PropTypes.node,
  classPrefix: PropTypes.string,
  disabled: PropTypes.bool,
  expandOnFocus: PropTypes.bool,
  required: PropTypes.bool,
  foundOptionsMessage: PropTypes.func,
  notFoundMessage: PropTypes.node,
  renderWrapper: PropTypes.func,
  renderClearButton: PropTypes.func,
  renderComboBox: PropTypes.func,
  renderDownArrow: PropTypes.func,
  renderDropDown: PropTypes.func,
  renderListBox: PropTypes.func,
  renderListBoxWrapper: PropTypes.func,
  selectOnly: PropTypes.bool,
  findOption: PropTypes.func,
};

DropDown.defaultProps = {
  children: null,
  classPrefix: `${defaultClassPrefix}dropdown`,
  disabled: false,
  expandOnFocus: false,
  required: false,
  foundOptionsMessage: null,
  notFoundMessage: null,
  renderWrapper: (props) => <div {...props} />,
  renderClearButton: renderNull,
  renderDownArrow: renderNull,
  renderComboBox: (props) => <div {...props} />,
  renderDropDown: renderNull,
  renderListBox: (props) => <ul {...props} />,
  renderListBoxWrapper: (props) => <div {...props} />,
  selectOnly: true,
  findOption: defaultFindOption,
};

DropDown.displayName = 'DropDown';
