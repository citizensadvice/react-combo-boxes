import React, { forwardRef, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context';
import { renderGroupedOptions } from '../helpers/render_grouped_options';
import { classPrefix } from '../constants/class_prefix';

export const ListBoxTable = forwardRef(({ focusedRef, hidden, onSelectOption, ...props }, ref) => {
  const context = useContext(Context);
  const {
    currentOption,
    props: {
      columns: rawColumns,
      options,
      ListBoxListComponent = 'div',
      listBoxListProps,
      tableProps,
      tableHeaderProps,
      tableGroupRowProps,
      tableGroupHeaderProps,
      tableRowProps,
      tableCellProps,
      ValueComponent, valueProps,
      visuallyHiddenClassName,
    },
  } = context;

  const columns = useMemo(() => (
    rawColumns.map((column) => {
      if (typeof column === 'string') {
        return {
          name: column,
        };
      }
      return column;
    })
  ), [rawColumns]);

  return (
    <ListBoxListComponent
      hidden={hidden}
      className={`${classPrefix}listbox`}
      onMouseDown={(e) => e.preventDefault()}
      {...listBoxListProps}
    >
      <table
        ref={ref}
        role="listbox"
        {...props}
        className={`${classPrefix}listbox__table`}
        {...tableProps}
      >
        <colgroup>
          {columns.map(({ name, html }) => (
            <col key={name} {...html} />
          ))}
        </colgroup>
        {columns.some(({ label }) => label) && (
          <thead role="presentation">
            <tr>
              {columns.map(({ name, label }) => (
                <th
                  aria-hidden="true"
                  key={name}
                  className={`${classPrefix}listbox__table-header`}
                  {...tableHeaderProps}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody role="presentation">
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...context, group, columns }}
                >
                  <tr
                    className={`${classPrefix}listbox__table-group-row`}
                    {...tableGroupRowProps}
                  >
                    <th
                      aria-hidden="true"
                      colSpan={Object.keys(columns).length}
                      className={`${classPrefix}listbox__table-group-header`}
                      {...tableGroupHeaderProps}
                      {...html}
                    >
                      {label}
                    </th>
                  </tr>
                  {groupChildren}
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { key, html, disabled, group } = option;
              const selected = currentOption?.key === key;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...context, selected, option, group, columns }}
                >
                  <tr
                    id={key}
                    role="option"
                    className={`${classPrefix}listbox__table-row`}
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    ref={selected ? focusedRef : null}
                    {...tableRowProps}
                    {...html}
                    onClick={disabled ? null : (e) => onSelectOption(e, option)}
                  >
                    {columns.map((column, index) => (
                      <Context.Provider
                        key={column.name}
                        value={{ ...context, selected, option, group, columns, column }}
                      >
                        <td
                          role="presentation"
                          className={`${classPrefix}listbox__table-cell`}
                          {...tableCellProps}
                        >
                          {group && index === 0 && (
                            <div className={visuallyHiddenClassName}>
                              {group.label}
                            </div>
                          )}
                          {column.label && (
                            <div className={visuallyHiddenClassName}>
                              {column.label}
                            </div>
                          )}
                          <ValueComponent
                            {...valueProps}
                          >
                            {option.value[column.name]}
                          </ValueComponent>
                        </td>
                      </Context.Provider>
                    ))}
                  </tr>
                </Context.Provider>
              );
            },
          })}
        </tbody>
      </table>
    </ListBoxListComponent>
  );
});

ListBoxTable.propTypes = {
  'aria-activedescendant': PropTypes.string,
  focusedRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  hidden: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onSelectOption: PropTypes.func.isRequired,
};

ListBoxTable.defaultProps = {
  focusedRef: null,
  hidden: false,
  'aria-activedescendant': null,
};

ListBoxTable.displayName = 'ListBoxTable';
