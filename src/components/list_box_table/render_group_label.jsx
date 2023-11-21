import { makeBEMClass } from '../../helpers/make_bem_class';

export function renderGroupLabel(props, componentState, componentProps) {
  const {
    classPrefix,
    columns,
    renderTableGroupRow,
    renderTableGroupHeaderCell,
  } = componentProps;

  return renderTableGroupRow(
    {
      className: makeBEMClass(classPrefix, 'table-group-row'),
      children: renderTableGroupHeaderCell(
        {
          ...props,
          colSpan: Object.keys(columns).length,
          className: makeBEMClass(classPrefix, 'table-group-header'),
        },
        componentState,
        componentProps,
      ),
    },
    componentState,
    componentProps,
  );
}
