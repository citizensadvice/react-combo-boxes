import React from 'react';
import { classPrefix } from '../../constants/class_prefix';

export function renderOption({ children: _, ...props }, state, componentProps) {
  const {
    columns,
    renderTableRow,
    renderGroupAccessibleLabel,
    renderTableCellColumnAccessibleLabel,
    renderTableCell,
    renderColumnValue,
    visuallyHiddenClassName,
  } = componentProps;
  const { group, option } = state;

  return renderTableRow({
    ...props,
    className: `${classPrefix}listbox__table-row`,
    children: columns.map((column, index) => renderTableCell({
      role: 'presentation',
      className: `${classPrefix}listbox__table-cell`,
      key: index,
      children: (
        <>
          {group && index === 0 && renderGroupAccessibleLabel({
            className: visuallyHiddenClassName,
            children: group.label,
          }, state, componentProps)}
          {column.label && renderTableCellColumnAccessibleLabel({
            className: visuallyHiddenClassName,
            children: column.label,
          }, { ...state, column }, componentProps)}
          {renderColumnValue({
            children: option.value[column.name],
          }, { ...state, column }, componentProps)}
        </>
      ),
    }, { ...state, column }, componentProps)),
  }, state, componentProps);
}
