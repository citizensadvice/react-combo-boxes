import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { listBoxRenderer } from '../helpers/list_box_renderer';
import { useComboBox } from '../hooks/use_combo_box';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';

export const MenuBar = forwardRef((rawProps, ref) => {
  const onValue = useCallback((value) => {
    value.onClick();
  }, []);

  const {
    listBoxProps,
    state,
    props: normalisedProps,
  } = useComboBox({ ...rawProps, onValue, ref });

  const {
    id,
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
      id: `${id}_menu_bar`,
      'aria-labelledby': id,
      'aria-disabled': disabled ? 'true' : 'false',
      role: 'menubar',
      hidden: false,
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

  return listBoxRenderer(state, Object.freeze({
    ...normalisedProps,
    renderListBoxWrapper,
    renderListBox,
    renderGroup,
    renderOption,
  }), listBoxProps);
});

MenuBar.propTypes = {
  id: PropTypes.string.isRequired,
  renderListBoxWrapper: PropTypes.func,
  renderListBox: PropTypes.func,
  renderGroup: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderOption: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    role: PropTypes.oneOf(['menuitem', 'menuitemradio', 'menuitemcheckbox']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  })).isRequired,
  expandOnFocus: PropTypes.bool,
  selectOnBlur: PropTypes.bool,
  expandOnHover: PropTypes.bool,
  classPrefix: PropTypes.string,
};

MenuBar.defaultProps = {
  classPrefix: `${defaultClassPrefix}menubar`,
  renderListBoxWrapper: (props) => <div {...props} />,
  renderListBox: (props) => <div {...props} />,
  renderGroup: (props) => <div {...props} />,
  renderGroupLabel: () => null,
  renderOption: (props) => <div {...props} />,
  expandOnFocus: false,
  selectOnBlur: false,
  expandOnHover: true,
};

MenuBar.displayName = 'MenuBar';
