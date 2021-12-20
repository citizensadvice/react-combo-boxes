import React, { Fragment } from 'react';

import { renderGroupedOptions } from './render_grouped_options';
import { makeBEMClass } from './make_bem_class';
import { visuallyHiddenClassName as defaultVisuallyHiddenClassName } from '../constants/visually_hidden_class_name';

const render = {
  fragment: ({ key, children }) => <Fragment key={key}>{children}</Fragment>,
  span: (props) => <span {...props} />,
  li: (props) => <li {...props} />,
  ul: (props) => <ul {...props} />,
};

export function listBoxRenderer(
  state,
  props,
  listBoxProps,
) {
  const {
    renderListBoxWrapper = render.fragment,
    renderListBox = render.ul,
    renderGroup = render.fragment,
    renderGroupLabel = render.li,
    renderOption = render.li,
    renderGroupAccessibleLabel = render.span,
    renderValue = render.fragment,
    options,
    classPrefix,
    visuallyHiddenClassName = defaultVisuallyHiddenClassName,
  } = props;

  return renderListBoxWrapper({
    className: makeBEMClass(classPrefix, 'listbox-wrapper'),
    children: renderListBox({
      ...listBoxProps,
      children: (
        renderGroupedOptions({
          options,
          renderGroup(group) {
            const { key, html, label, children: groupChildren } = group;
            const groupState = Object.freeze({ ...state, group });

            return renderGroup({
              key,
              children: (
                <>
                  {renderGroupLabel({
                    'aria-hidden': 'true',
                    className: makeBEMClass(classPrefix, 'group-label'),
                    ...html,
                    children: label,
                  }, groupState, props)}
                  {groupChildren}
                </>
              ),
            }, groupState, props);
          },
          renderOption(option) {
            const { label, selected, group, props: optionProps } = option;
            const optionState = Object.freeze({ ...state, selected, option, group });

            return renderOption({
              ...optionProps,
              children: (
                <>
                  {group ? renderGroupAccessibleLabel({
                    className: visuallyHiddenClassName,
                    children: `${group.label} `,
                  }, optionState, props) : null}
                  {renderValue(
                    { children: label },
                    optionState,
                    props,
                  )}
                </>
              ),
            }, optionState, props);
          },
        })
      ),
    }, state, props),
  }, state, props);
}
