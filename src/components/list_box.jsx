import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { renderGroupedOptions } from '../helpers/render_grouped_options';
import { makeBEMClass } from '../helpers/make_bem_class';

export const ListBox = forwardRef((
  {
    focusedRef,
    onSelectOption,
    onFocusOption,
    componentProps,
    componentProps: {
      classPrefix,
      managedFocus,
      options,
      renderListBox,
      renderGroup,
      renderGroupLabel,
      renderGroupAccessibleLabel,
      renderOption,
      renderValue,
      visuallyHiddenClassName,
      tabBetweenOptions,
    },
    componentState,
    componentState: {
      currentOption,
    },
    ...props
  },
  ref,
) => renderListBox({
  ref,
  role: 'listbox',
  className: makeBEMClass(classPrefix, 'listbox'),
  onMouseDown: (e) => e.preventDefault(),
  ...props,
  children: (
    renderGroupedOptions({
      options,
      renderGroup(group) {
        const { key, html, label, children: groupChildren } = group;
        return renderGroup({
          key,
          children: (
            <>
              {renderGroupLabel({
                'aria-hidden': 'true',
                className: makeBEMClass(classPrefix, 'group-label'),
                ...html,
                children: label,
              }, { ...componentState, group }, componentProps)}
              {groupChildren}
            </>
          ),
        }, { ...componentState, group, groupChildren }, componentProps);
      },
      renderOption(option) {
        const { label, key, html, disabled, group } = option;
        const selected = currentOption?.key === key;
        return renderOption({
          id: key,
          key,
          role: 'option',
          className: makeBEMClass(classPrefix, 'option'),
          tabIndex: tabBetweenOptions && managedFocus ? 0 : -1,
          'aria-selected': selected ? 'true' : null,
          'aria-disabled': disabled ? 'true' : null,
          ref: selected ? focusedRef : null,
          ...html,
          onClick: disabled ? null : (e) => onSelectOption(e, option),
          onFocus: onFocusOption ? (e) => onFocusOption(e, option) : null,
          children: (
            <>
              {group ? renderGroupAccessibleLabel({
                className: visuallyHiddenClassName,
                children: `${group.label} `,
              }, { ...componentState, group }, componentProps) : null}
              {renderValue(
                { children: label },
                { ...componentState, selected, option, group },
                componentProps,
              )}
            </>
          ),
        }, { ...componentState, selected, option, group }, componentProps);
      },
    })
  ),
}, componentState, componentProps));

ListBox.propTypes = {
  'aria-activedescendant': PropTypes.string,
  componentProps: PropTypes.shape({
    classPrefix: PropTypes.string,
    managedFocus: PropTypes.bool,
    options: PropTypes.array.isRequired,
    renderListBox: PropTypes.func.isRequired,
    renderGroup: PropTypes.func.isRequired,
    renderGroupLabel: PropTypes.func.isRequired,
    renderGroupAccessibleLabel: PropTypes.func.isRequired,
    renderOption: PropTypes.func.isRequired,
    renderValue: PropTypes.func.isRequired,
    tabBetweenOptions: PropTypes.bool,
    visuallyHiddenClassName: PropTypes.string.isRequired,
  }).isRequired,
  componentState: PropTypes.shape({
    currentOption: PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  }).isRequired,
  focusedRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  hidden: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onSelectOption: PropTypes.func.isRequired,
  onFocusOption: PropTypes.func,
};

ListBox.defaultProps = {
  'aria-activedescendant': null,
  focusedRef: null,
  hidden: false,
  onFocusOption: null,
};

ListBox.displayName = 'ListBox';
