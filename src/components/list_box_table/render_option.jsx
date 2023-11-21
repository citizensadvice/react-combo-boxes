import { makeBEMClass } from '../../helpers/make_bem_class';
import { joinTokens } from '../../helpers/join_tokens';

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

  return renderTableRow(
    {
      ...props,
      className: makeBEMClass(classPrefix, 'table-row'),
      children: columns.map((column, index) =>
        renderTableCell(
          {
            role: 'presentation',
            className: joinTokens(
              makeBEMClass(classPrefix, 'table-cell'),
              column.cellClass,
            ),
            key: index,
            ...column.cellHtml,
            children: (
              // Use non-breaking spaces to fix an issue with Chrome on VoiceOver removing spaces
              <>
                {group &&
                  index === 0 &&
                  renderGroupAccessibleLabel(
                    {
                      className: visuallyHiddenClassName,
                      children: `${group.label}\u00A0`,
                    },
                    state,
                    componentProps,
                  )}
                {column.label &&
                  renderTableCellColumnAccessibleLabel(
                    {
                      className: visuallyHiddenClassName,
                      children: option.value[column.name]
                        ? `${column.label}\u00A0`
                        : null,
                    },
                    { ...state, column },
                    componentProps,
                  )}
                {renderColumnValue(
                  {
                    children: option.value[column.name],
                  },
                  { ...state, column },
                  componentProps,
                )}
                <span className={visuallyHiddenClassName}>{'\u00A0'}</span>
              </>
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
