import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { listBoxRenderer } from '../helpers/list_box_renderer';
import { useComboBox } from '../hooks/use_combo_box';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';

export const MenuButton = forwardRef((rawProps, ref) => {
  const onValue = useCallback((value) => {
    value.onClick();
  }, []);

  const {
    wrapperProps,
    inputProps: buttonProps,
    listBoxProps,
    state,
    props: normalisedProps,
  } = useComboBox({ ...rawProps, onValue, ref });

  const {
    id,
    role,
    children,
    renderWrapper,
    renderButton,
    disabled,
    classPrefix,
  } = normalisedProps;

  const renderListBoxWrapper = (props) => (
    normalisedProps.renderListBoxWrapper({
      className: makeBEMClass(classPrefix, 'listbox-wrapper'),
      ...props,
    })
  );

  const renderListBox = (props, ...args) => (
    normalisedProps.renderListBox({
      ...props,
      id: `${id}_menu`,
      'aria-labelledby': id,
      role: 'menu',
    }, ...args)
  );

  const renderGroup = (props, groupState, componentProps) => (
    normalisedProps.renderGroup({
      ...props,
      role: 'group',
      'aria-label': groupState.group.label,
      children: groupState.group.children,
    }, groupState, componentProps)
  );

  const renderOption = (props, optionState, componentProps) => (
    normalisedProps.renderOption({
      ...props,
      role: optionState.option.value.role || 'menuitem',
      'data-selected': optionState.selected ? 'true' : 'false',
    }, optionState, componentProps)
  );

  return (
    renderWrapper({
      ...wrapperProps,
      role,
      children: (
        <>
          {renderButton({
            ...buttonProps,
            type: 'button',
            'aria-haspopup': 'button',
            'aria-controls': `${id}_menu`,
            'aria-owns': null,
            disabled,
            children,
            className: makeBEMClass(classPrefix, 'button'),
          }, state, normalisedProps)}
          {listBoxRenderer(state, Object.freeze({
            ...normalisedProps,
            renderListBoxWrapper,
            renderListBox,
            renderGroup,
            renderOption,
          }), listBoxProps)}
        </>
      ),
    }, state, normalisedProps)
  );
});

MenuButton.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(['menu', 'menubar', 'menuitem']),
  renderListBoxWrapper: PropTypes.func,
  renderButton: PropTypes.func,
  renderListBox: PropTypes.func,
  renderGroup: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderOption: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    role: PropTypes.oneOf(['menuitem', 'menuitemradio', 'menuitemcheckbox', 'separator']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  })).isRequired,
  expandOnFocus: PropTypes.bool,
  selectOnBlur: PropTypes.bool,
  expandOnHover: PropTypes.bool,
  classPrefix: PropTypes.string,
  skipOption: PropTypes.func,
};

MenuButton.defaultProps = {
  classPrefix: `${defaultClassPrefix}dropdown`,
  role: 'menu',
  renderButton: (props) => <button {...props} />, // eslint-disable-line react/button-has-type
  renderListBoxWrapper: (props) => <div {...props} />,
  renderListBox: (props) => <div {...props} />,
  renderGroup: (props) => <div {...props} />,
  renderGroupLabel: () => null,
  renderOption: (props) => <div {...props} />,
  expandOnFocus: false,
  selectOnBlur: false,
  expandOnHover: true,
  skipOption: (option) => option.value.role === 'separator' || option.disabled,
};

MenuButton.displayName = 'MenuButton';
