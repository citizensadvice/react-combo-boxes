import React from 'react';
import { classPrefix } from '../../constants/class_prefix';
import { joinTokens } from '../../helpers/join_tokens';

export function renderListBox({ children, hidden, ref, ...props }, componentState, componentProps) {
  const { columns, renderTableWrapper, renderTable, renderTableHeaderCell } = componentProps;
  const hasHeader = columns.some(({ label }) => label);

  return renderTableWrapper({
    hidden,
    className: joinTokens(`${classPrefix}listbox`, hasHeader && `${classPrefix}listbox--header`),
    onMouseDown: (e) => e.preventDefault(),
    ref,
    children: renderTable({
      role: 'listbox',
      ...props,
      className: `${classPrefix}listbox__table`,
      children: (
        <>
          <colgroup>
            {columns.map(({ name, html }) => (
              <col key={name} {...html} />
            ))}
          </colgroup>
          {hasHeader && (
            <thead role="presentation">
              <tr role="presentation">
                {columns.map((column) => renderTableHeaderCell({
                  'aria-hidden': 'true',
                  key: column.name,
                  className: `${classPrefix}listbox__table-header`,
                  children: column.label,
                }, { ...componentState, column }, componentProps))}
              </tr>
            </thead>
          )}
          <tbody role="presentation">
            {children}
          </tbody>
        </>
      ),
    }, componentState, componentProps),
  }, componentState, componentProps);
}
