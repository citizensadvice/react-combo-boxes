import { makeBEMClass } from '../../helpers/make_bem_class';

export function renderOption({ children: _, ...props }, state, componentProps) {
  const {
    classPrefix,
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
    className: makeBEMClass(classPrefix, 'table-row'),
    children: columns.map((column, index) => renderTableCell({
      role: 'presentation',
      className: makeBEMClass(classPrefix, 'table-cell'),
      key: index,
      ...column.cellHtml,
      children: (
        <>
          {group && index === 0 && renderGroupAccessibleLabel({
            className: visuallyHiddenClassName,
            children: `${group.label} `,
          }, state, componentProps)}
          {column.label && renderTableCellColumnAccessibleLabel({
            className: visuallyHiddenClassName,
            children: option.value[column.name] ? `${column.label} ` : null,
          }, { ...state, column }, componentProps)}
          {renderColumnValue({
            children: option.value[column.name],
          }, { ...state, column }, componentProps)}
        </>
      ),
    }, { ...state, column }, componentProps)),
  }, state, componentProps);
}
