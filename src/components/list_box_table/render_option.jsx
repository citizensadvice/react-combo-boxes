import { makeBEMClass } from '../../helpers/make_bem_class';
import { joinTokens } from '../../helpers/join_tokens';

export function renderOption(
  { children: _, id, ...props },
  state,
  componentProps,
) {
  const {
    classPrefix,
    columns,
    renderTableRow,
    renderTableCell,
    renderColumnValue,
  } = componentProps;
  const { group, option } = state;

  return renderTableRow(
    {
      ...props,
      id,
      className: makeBEMClass(classPrefix, 'table-row'),
      'aria-labelledby': [
        group?.key,
        ...columns.flatMap((column) => [
          column.label && `${componentProps.id}_column_${column.key}`,
          `${option.key}_cell_${column.key}`,
        ]),
      ]
        .filter(Boolean)
        .join(' '),
      children: columns.map((column) =>
        renderTableCell(
          {
            role: 'presentation',
            className: joinTokens(
              makeBEMClass(classPrefix, 'table-cell'),
              column.cellClass,
            ),
            key: column.key,
            id: `${option.key}_cell_${column.key}`,
            ...column.cellHtml,
            children: renderColumnValue(
              {
                children: option.value[column.name],
              },
              { ...state, column },
              componentProps,
            ),
          },
          { ...state, column },
          componentProps,
        ),
      ),
    },
    state,
    componentProps,
  );
}
