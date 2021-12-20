import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from './combo_box';
import { listBoxTableRenderer } from '../helpers/list_box_table_renderer';

export const ComboBoxTable = forwardRef(({ columns: rawColumns, ...props }, ref) => {
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
    <ComboBox
      ref={ref}
      {...props}
      columns={columns}
    />
  );
});

ComboBoxTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      html: PropTypes.object,
    }),
  ])).isRequired,
  listBoxRenderer: PropTypes.func,
};

ComboBoxTable.defaultProps = {
  listBoxRenderer: listBoxTableRenderer,
};

ComboBoxTable.displayName = 'ComboBoxTable';
