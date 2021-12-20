import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from './drop_down';
import { listBoxTableRenderer } from '../helpers/list_box_table_renderer';

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
  listBoxRenderer: PropTypes.func,
  renderListBoxWrapper: PropTypes.func,
};

DropDownTable.defaultProps = {
  listBoxRenderer: listBoxTableRenderer,
  renderListBoxWrapper: (props) => <div {...props} />,
};

DropDownTable.displayName = 'DropDownTable';
