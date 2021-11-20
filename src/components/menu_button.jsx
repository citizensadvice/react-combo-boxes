import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from './drop_down';

// TODO: inherit from combo box
// TODO: separate core?
// TODO: labelled by button
// TODO: support for groups
// TODO: open on hover
// TODO: support checkbox and radio
// TODO: support separator
// TODO: support menubar?
// TODO: propTypes
// TODO: navigation menu

export const MenuButton = forwardRef((props, ref) => {
  const { renderInput, renderListBox, renderGroup, renderOption } = props;

  const newRenderInput = useCallback((wrapperProps, componentState, componentProps) => (
    renderInput({
      ...wrapperProps,
      type: 'button',
      'aria-haspopup': 'true',
      role: null,
      'aria-disabled': null,
      'aria-required': null,
      disabled: componentProps.disabled,
    }, componentState, componentProps)
  ), [renderInput]);

  const newRenderGroup = useCallback((wrapperProps, componentState, componentProps) => (
    renderGroup({
      ...wrapperProps,
      role: 'group',
      'aria-label': componentState.group.label,
      children: componentState.group.groupChildren,
    }, componentState, componentProps)
  ), [renderGroup]);

  const newRenderListBox = useCallback((wrapperProps, componentState, componentProps) => (
    renderListBox({
      ...wrapperProps,
      role: 'menu',
    }, componentState, componentProps)
  ), [renderListBox]);

  const newRenderOption = useCallback((wrapperProps, componentState, componentProps) => {
    const { option: { role } } = componentState;
    return renderOption({
      ...wrapperProps,
      role,
    }, componentState, componentProps);
  }, [renderOption]);

  const onValue = useCallback((value) => {
    value.onClick();
  }, []);

  return (
    <DropDown
      ref={ref}
      renderInput={newRenderInput}
      renderListBox={newRenderListBox}
      renderGroup={newRenderGroup}
      renderOption={newRenderOption}
      onValue={onValue}
      {...props}
    />
  );
});

MenuButton.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(['menu', 'menubar']),
  renderWrapper: PropTypes.func,
  renderInput: PropTypes.func,
  renderListBox: PropTypes.func,
  renderGroup: PropTypes.func,
  renderOption: PropTypes.func,
};

MenuButton.defaultProps = {
  role: 'menu',
  renderWrapper: (props) => <div {...props} />,
  renderInput: (props) => <button {...props} />,
  renderListBox: (props) => <div {...props} />,
  renderGroup: (props) => <div {...props} />,
  renderOption: (props) => <div {...props} />,
};

MenuButton.displayName = 'MenuButton';
