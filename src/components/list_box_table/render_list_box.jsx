import { makeBEMClass } from '../../helpers/make_bem_class';
import { joinTokens } from '../../helpers/join_tokens';

export function renderListBox(
  { children, hidden, ref, ...props },
  componentState,
  componentProps,
) {
  const {
    id,
    classPrefix,
    columns,
    renderTableWrapper,
    renderTable,
    renderTableHeaderCell,
  } = componentProps;
  const hasHeader = columns.some(({ label }) => label);

  return renderTableWrapper(
    {
      hidden,
      className: makeBEMClass(
        classPrefix,
        'listbox',
        hasHeader && 'listbox--header',
      ),
      onMouseDown: (e) => e.preventDefault(),
      tabIndex: -1,
      ref,
      children: renderTable(
        {
          role: 'listbox',
          ...props,
          className: makeBEMClass(classPrefix, 'table'),
          children: (
            <>
              <colgroup>
                {columns.map(({ name, colHtml }) => (
                  <col
                    key={name}
                    {...colHtml}
                  />
                ))}
              </colgroup>
              {hasHeader && (
                <thead role="presentation">
                  <tr role="presentation">
                    {columns.map((column) =>
                      renderTableHeaderCell(
                        {
                          key: column.key,
                          id: `${id}_column_${column.key}`,
                          className: joinTokens(
                            makeBEMClass(classPrefix, 'table-header'),
                            column.cellClass,
                          ),
                          children: column.label,
                        },
                        { ...componentState, column },
                        componentProps,
                      ),
                    )}
                  </tr>
                </thead>
              )}
              <tbody role="presentation">{children}</tbody>
            </>
          ),
        },
        componentState,
        componentProps,
      ),
    },
    componentState,
    componentProps,
  );
}
