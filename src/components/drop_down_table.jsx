import { Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from './drop_down';
import { renderListBox } from './list_box_table/render_list_box';
import { renderGroupLabel } from './list_box_table/render_group_label';
import { renderOption } from './list_box_table/render_option';
import { useNormalisedColumns } from '../hooks/use_normalised_columns';

function renderNothing() {
  return null;
}

const defaultRenderTableWrapper = (props) => <div {...props} />;
const defaultRenderTable = (props) => <table {...props} />;
const defaultRenderTableHeaderCell = ({ key, ...props }) => (
  <th
    key={key}
    {...props}
  />
);
const defaultRenderTableGroupRow = (props) => <tr {...props} />;
const defaultRenderTableGroupHeaderCell = ({ key, ...props }) => (
  <th
    key={key}
    {...props}
  />
);
const defaultRenderTableRow = ({ key, ...props }) => (
  <tr
    key={key}
    {...props}
  />
);
const defaultRenderTableCellColumnAccessibleLabel = (props) => (
  <span {...props} />
);
const defaultRenderTableCell = ({ key, ...props }) => (
  <td
    key={key}
    {...props}
  />
);
// eslint-disable-next-line react/jsx-no-useless-fragment
const defaultRenderColumnValue = (props) => <Fragment {...props} />;

export const DropDownTable = forwardRef(
  (
    {
      columns: rawColumns,
      renderTableWrapper = defaultRenderTableWrapper,
      renderTable = defaultRenderTable,
      renderTableHeaderCell = defaultRenderTableHeaderCell,
      renderTableGroupRow = defaultRenderTableGroupRow,
      renderTableGroupHeaderCell = defaultRenderTableGroupHeaderCell,
      renderTableRow = defaultRenderTableRow,
      renderTableCellColumnAccessibleLabel = defaultRenderTableCellColumnAccessibleLabel,
      renderTableCell = defaultRenderTableCell,
      renderColumnValue = defaultRenderColumnValue,
      ...props
    },
    ref,
  ) => {
    const columns = useNormalisedColumns(rawColumns);

    return (
      <DropDown
        ref={ref}
        {...props}
        columns={columns}
        renderValue={renderNothing}
        renderListBox={renderListBox}
        renderOption={renderOption}
        renderGroupLabel={renderGroupLabel}
        renderTableWrapper={renderTableWrapper}
        renderTable={renderTable}
        renderTableHeaderCell={renderTableHeaderCell}
        renderTableGroupRow={renderTableGroupRow}
        renderTableGroupHeaderCell={renderTableGroupHeaderCell}
        renderTableRow={renderTableRow}
        renderTableCellColumnAccessibleLabel={
          renderTableCellColumnAccessibleLabel
        }
        renderTableCell={renderTableCell}
        renderColumnValue={renderColumnValue}
      />
    );
  },
);

DropDownTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        html: PropTypes.object,
      }),
    ]),
  ).isRequired,
  renderTableWrapper: PropTypes.func,
  renderTable: PropTypes.func,
  renderTableHeaderCell: PropTypes.func,
  renderTableGroupRow: PropTypes.func,
  renderTableGroupHeaderCell: PropTypes.func,
  renderTableRow: PropTypes.func,
  renderTableCellColumnAccessibleLabel: PropTypes.func,
  renderTableCell: PropTypes.func,
  renderColumnValue: PropTypes.func,
};

DropDownTable.displayName = 'DropDownTable';
