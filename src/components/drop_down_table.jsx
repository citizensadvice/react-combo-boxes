import { Fragment, forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from './drop_down';
import { renderListBox } from './list_box_table/render_list_box';
import { renderGroupLabel } from './list_box_table/render_group_label';
import { renderOption } from './list_box_table/render_option';

function renderNothing() {
  return null;
}

export const DropDownTable = forwardRef(({ columns: rawColumns, ...props }, ref) => {
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
    <DropDown
      ref={ref}
      {...props}
      columns={columns}
      renderValue={renderNothing}
      renderListBox={renderListBox}
      renderOption={renderOption}
      renderGroupLabel={renderGroupLabel}
    />
  );
});

DropDownTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      html: PropTypes.object,
    }),
  ])).isRequired,
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

DropDownTable.defaultProps = {
  renderTableWrapper: (props) => <div {...props} />,
  renderTable: (props) => <table {...props} />,
  renderTableHeaderCell: (props) => <th {...props} />,
  renderTableGroupRow: (props) => <tr {...props} />,
  renderTableGroupHeaderCell: (props) => <th {...props} />,
  renderTableRow: (props) => <tr {...props} />,
  renderTableCellColumnAccessibleLabel: (props) => <span {...props} />,
  renderTableCell: (props) => <td {...props} />,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  renderColumnValue: (props) => <Fragment {...props} />,
};

DropDownTable.displayName = 'DropDownTable';
