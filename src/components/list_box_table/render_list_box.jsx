import React from 'react';
import { makeBEMClass } from '../../helpers/make_bem_class';

export function renderListBox({ children, hidden, ref, ...props }, componentState, componentProps) {
  const {
    classPrefix,
    columns,
    renderTableWrapper,
    renderTable,
    renderTableHeaderCell,
  } = componentProps;
  const hasHeader = columns.some(({ label }) => label);

  return renderTableWrapper({
    hidden,
    className: makeBEMClass(classPrefix, 'listbox', hasHeader && 'listbox--header'),
    onMouseDown: (e) => e.preventDefault(),
    ref,
    children: renderTable({
      role: 'listbox',
      ...props,
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
                {columns.map((column) => renderTableHeaderCell({
                  'aria-hidden': 'true',
                  key: column.name,
                  className: makeBEMClass(classPrefix, 'table-header'),
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
