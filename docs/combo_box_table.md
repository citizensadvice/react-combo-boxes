# `<ComboBoxTable>`

An alternative layout for a combo box.  This places the results in a table which is more readable for tabulated data.

This is not the same as the [combo-box grid pattern][aria-practices-combo-box-grid], which has poor screen-reader compatibility.

## Usage

```js
function map({ name }) {
  return { label: name };
}

const options = [
  { name: 'Frank', age: 21, height: `6'` },
  { name: 'Bob', age: 42, height: `5'11"` },
  { name: 'Harry', age: 1, height: `1'2"` },
];

<ComboBoxTable
  {...props}
  options={options}
  columns={['name', 'age', 'height']} 
  mapOption={map}
/>
```

## Props

The props are the same as `<ComboBox>`, with the addition of `columns`.

Columns is an array of:

- `String` - column keys
- `Objects` with the keys:

| Key         | Type              | Purpose                                                         |
| ----        | ----              | ----                                                            |
| `name`      | `string`          | The object key to show.  Required                               |
| `label`     | `React.ReactNode` | If present it will show the HTML headers                        |
| `colHtml`   | `Object`          | HTML attributes to be added to `<col>` elements for each column |
| `cellClass` | `string`          | Additional class to be added to the cells for this column       |
| `cellHtml`  | `Object`          | HTML attributes to be added to `<td>` elements for each column  |

## Customisation

A number of render methods are provided to customise the appearance of the component.

These have the same signature as the render functions on [`<ComboBox>`][combo-box], with the additional
of `column: { label: string, name: string }` on the state.

The render functions available are:

| Name                                   | Default                           | Description                                                                         |
| ----                                   | ----                              | ----                                                                                |
| `renderWrapper`                        | `(props) => <div {...props} />`   | Renders the component wrapper                                                       |
| `renderInput`                          | `(props) => <input {...props} />` | Renders the combo-box input                                                         |
| `renderDownArrow`                      | `(props) => <span {...props} />`  | Renders down arrow displayed when options are available                             |
| `renderClearButton`                    | `(props) => <span {...props} />`  | Renders '×' button displayed when an option is selected                             |
| `renderTableWrapper`                   | `(props) => <div {...props} />`   | Renders the element containing the table                                            |
| `renderTable`                          | `(props) => <table {...props} />` | Renders a table, which is the list box                                              |
| `renderTableHeaderCell`                | `(props) => <th {...props} />`    | Renders a thead header cell with a column name                                      |
| `renderTableGroupRow`                  | `(props) => <tr {...props} />`    | Renders a row containing a group header                                             |
| `renderTableGroupHeaderCell`           | `(props) => <th {...props} />`    | Renders a cell containing the group label. This will be ignored by a screen-reader  |
| `renderTableRow`                       | `(props) => <th {...props} />`    | Renders a table row, which is a list box option                                     |
| `renderTableCell`                      | `(props) => <th {...props} />`    | Renders a table cell, one cell is rendered for each column                          |
| `renderGroupAccessibleLabel`           | `(props) => <th {...props} />`    | Renders the accessible label for a group.  This will be read out before each option |
| `renderTableCellColumnAccessibleLabel` | `(props) => <th {...props} />`    | Renders the accessible label for column.  This will be read out before each option  |
| `renderColumnValue`                    | `(props) => <th {...props} />`    | Renders the value within a table cell                                               |
| `renderNotFound`                       | `(props) => <th {...props} />`    | Renders the not found message                                                       |
| `renderAriaDescription`                | `(props) => <th {...props} />`    | Renders the aria description of the combo box                                       |

[aria-practices-combo-box-grid]: https://w3c.github.io/aria-practices/#grid-popup-keyboard-interaction
