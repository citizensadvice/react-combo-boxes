import { classPrefix } from '../../constants/class_prefix';

export function renderGroupLabel(props, componentState, componentProps) {
  const { columns, renderTableGroupRow, renderTableGroupHeaderCell } = componentProps;

  return renderTableGroupRow({
    className: `${classPrefix}listbox__table-group-row`,
    children: renderTableGroupHeaderCell({
      ...props,
      colSpan: Object.keys(columns).length,
      className: `${classPrefix}listbox__table-group-header`,
    }, componentState, componentProps),
  }, componentState, componentProps);
}
