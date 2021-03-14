import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from './combo_box';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';
import { rNonPrintableKey } from '../constants/r_non_printable_key';
import { setExpanded, setFocusedOption, onSelectValue } from './combo_box/actions';
import { findOption as defaultFindOption } from '../helpers/find_option';
import { joinTokens } from '../helpers/join_tokens';
import { DISPATCH } from '../constants/dispatch';

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
      tabIndex: disabled || !options?.length ? null : 0,
      type: null,
      value: null,
    },
    state,
    componentProps,
  );
}

const ComboBoxWrapper = forwardRef((props, ref) => {
  const [search, setSearch] = useState('');

  const { componentProps, componentState, ...wrapperProps } = props;
  const { expanded, [DISPATCH]: dispatch } = componentState;
  const { options, findOption, renderWrapper, disabled } = componentProps;

  // If the search changes update the option
  useEffect(() => {
    if (!search.trim() || !options?.length || !findOption) {
      return undefined;
    }

    const timeout = setTimeout(() => setSearch(''), 1000);

    if (options?.length && findOption && !disabled) {
      const found = options.find((o) => findOption(o, search));
      if (found) {
        if (expanded) {
          dispatch(setFocusedOption({ focusedOption: found }));
        } else {
          dispatch(onSelectValue(found));
        }
      }
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function onKeyDown(event) {
    const { key, altKey, ctrlKey, metaKey } = event;

    if (altKey || ctrlKey || metaKey) {
      return;
    }

    if (!expanded && (key === ' ' || key === 'Enter')) {
      dispatch(setExpanded());
      event.preventDefault();
      return;
    }

    if (!rNonPrintableKey.test(key)) {
      setSearch((value) => `${value}${key}`);
      event.preventDefault();
    }
  }

  function onClick(e) {
    if (e.button > 0 || expanded) {
      return;
    }
    dispatch(setExpanded());
  }

  return renderWrapper({
    ...wrapperProps,
    'aria-busy': null,
    ref,
    onKeyDown,
    onClick,
  }, componentState, componentProps);
});

ComboBoxWrapper.propTypes = {
  componentProps: PropTypes.shape({
    disabled: PropTypes.bool,
    options: PropTypes.array,
    findOption: PropTypes.func,
    renderWrapper: PropTypes.func.isRequired,
  }).isRequired,
  componentState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    [DISPATCH]: PropTypes.func.isRequired,
  }).isRequired,
};

export const DropDown = forwardRef((props, ref) => {
  function renderWrapper(wrapperProps, componentState, componentProps) {
    return (
      <ComboBoxWrapper
        {...wrapperProps}
        componentState={componentState}
        componentProps={{ ...componentProps, renderWrapper: props.renderWrapper }}
      />
    );
  }

  function renderListBox(wrapperProps, componentState, componentProps) {
    return componentProps.renderListBoxWrapper(
      {
        className: makeBEMClass(componentProps.classPrefix, 'listbox-wrapper'),
        children: props.renderListBox(wrapperProps, componentState, componentProps),
      },
      componentState,
      componentProps,
    );
  }

  return (
    <ComboBox
      ref={ref}
      renderInput={renderInput}
      {...props}
      renderWrapper={renderWrapper}
      renderListBox={renderListBox}
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
