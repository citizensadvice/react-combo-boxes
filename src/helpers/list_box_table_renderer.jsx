import React, { Fragment } from 'react';

import { renderGroupedOptions } from './render_grouped_options';
import { makeBEMClass } from './make_bem_class';
import { visuallyHiddenClassName as defaultVisuallyHiddenClassName } from '../constants/visually_hidden_class_name';

const render = {
  fragment: ({ key, children }) => <Fragment key={key}>{children}</Fragment>,
  div: (props) => <div {...props} />,
  span: (props) => <span {...props} />,
  table: (props) => <table {...props} />,
  tr: (props) => <tr {...props} />,
  th: (props) => <th {...props} />,
  td: (props) => <td {...props} />,
};

export function listBoxTableRenderer(
  state,
  props,
  listBoxProps,
) {
  const {
    renderListBoxWrapper = render.fragment,
    renderTableWrapper = render.div,
    renderTable = render.table,
    renderTableHeaderCell = render.th,
    renderGroup = render.fragment,
    renderTableGroupRow = render.tr,
    renderTableGroupHeaderCell = render.th,
    renderTableRow = render.tr,
    renderGroupAccessibleLabel = render.span,
    renderTableCellColumnAccessibleLabel = render.span,
    renderTableCell = render.td,
    renderColumnValue = render.fragment,
    options,
    classPrefix,
    visuallyHiddenClassName = defaultVisuallyHiddenClassName,
    columns,
  } = props;

  const hasHeader = columns.some(({ label }) => label);

  const {
    hidden,
    ref,
    ...remainingListBoxProps
  } = listBoxProps;

  return renderListBoxWrapper({
    className: makeBEMClass(classPrefix, 'listbox-wrapper'),
    children: renderTableWrapper({
      hidden,
      className: makeBEMClass(classPrefix, 'listbox', hasHeader && 'listbox--header'),
      ref,
      children: renderTable({
        ...remainingListBoxProps,
        className: makeBEMClass(classPrefix, 'table'),
        children: (
          <>
            <colgroup>
              {columns.map(({ name, colHtml }) => (
                <col key={name} {...colHtml} />
              ))}
            </colgroup>
            {hasHeader && (
              <thead role="presentation">
                <tr role="presentation">
                  {columns.map((column) => {
                    const columnState = Object.freeze({ ...state, column });
                    return renderTableHeaderCell({
                      'aria-hidden': 'true',
                      key: column.name,
                      className: makeBEMClass(classPrefix, 'table-header'),
                      children: column.label,
                    }, columnState, props);
                  })}
                </tr>
              </thead>
            )}
            <tbody role="presentation">
              {renderGroupedOptions({
                options,
                renderGroup(group) {
                  const { key, html, label, children: groupChildren } = group;
                  const groupState = Object.freeze({ ...state, group });

                  return renderGroup({
                    key,
                    children: (
                      <>
                        {renderTableGroupRow({
                          className: makeBEMClass(classPrefix, 'table-group-row'),
                          children: renderTableGroupHeaderCell({
                            'aria-hidden': 'true',
                            className: makeBEMClass(classPrefix, 'table-group-header'),
                            ...html,
                            children: label,
                            colSpan: Object.keys(columns).length,
                          }, groupState, props),
                        }, groupState, props)}
                        {groupChildren}
                      </>
                    ),
                  }, groupState, props);
                },
                renderOption(option) {
                  const { selected, group, props: optionProps } = option;
                  const rowState = Object.freeze({ ...state, selected, group, option });

                  return renderTableRow({
                    ...optionProps,
                    className: makeBEMClass(classPrefix, 'table-row'),
                    children: columns.map((column, index) => {
                      const optionState = Object.freeze({ ...rowState, column });

                      return renderTableCell({
                        role: 'presentation',
                        className: makeBEMClass(classPrefix, 'table-cell'),
                        key: index,
                        ...column.cellHtml,
                        children: (
                          <>
                            {group && index === 0 && renderGroupAccessibleLabel({
                              className: visuallyHiddenClassName,
                              children: `${group.label} `,
                            }, optionState, props)}
                            {column.label && renderTableCellColumnAccessibleLabel({
                              className: visuallyHiddenClassName,
                              children: option.value[column.name] ? `${column.label} ` : null,
                            }, optionState, props)}
                            {renderColumnValue({
                              children: option.value[column.name],
                            }, optionState, props)}
                          </>
                        ),
                      }, optionState, props);
                    }),
                  }, rowState, props);
                },
              })}
            </tbody>
          </>
        ),
      }, state, props),
    }, state, props),
  }, state, props);
}
