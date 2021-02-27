# `<ComboBoxTable>`

An alternative layout for a combo box.  This places the results in a table which is more readable for tabulated data.

This is not the same as the [Combo box grid pattern][1], which has poor screen-reader compatibility.

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

The props are the same as `ComboBox`, with the addition of `columns`.

Columns is an array of:

- `String` - column keys
- `Objects` with the keys:

| Key        | Type     | Purpose                                                         |
| ----       | ----     | ----                                                            |
| `name`     | `String` | The object key to show.  Required                               |
| `label`    | `Node`   | If present it will show the HTML headers                        |
| `colHtml`  | `Object` | HTML attributes to be added to `<col>` elements for each column |
| `cellHtml` | `Object` | HTML attributes to be added to `<td>` elements for each column  |

## Customisation

A number of render methods are provided to customise the appearance of the component.

Each render method has the signature `render(props, state, componentProps)` where:

- `props` are the default props for that component
- `state` state is the current state of the combo box and has the properties:
  - `aria-autocomplete` - `String` - the `aria-autocomplete` value for the component
  - `aria-busy` - `String` - the `aria-busy` value for the component
  - `currentOption` - `Object` - the currently selected option
  - `expanded` - `Boolean` - is the list box showing
  - `group` - `Object` - the currently rendered group (when rendering a group or option only)
  - `notFound` - `Boolean` - is the not found message showing
  - `option` - `Object` - the currently rendered option (when rendering an option only)
  - `search` - `String` - the current search string
  - `selected` - `Boolean` - is the currently selected option selected (when rendering an option only)
  - `suggestedOption` - `Object` - the currently suggested option
- `componentProps` - the props passed to the component

The render functions available are:

| Name                                   | Default element | Description                                                                         |
| `renderWrapper`                        | `<div>`         | Renders the component wrapper                                                       |
| `renderInput`                          | `<input>`       | Renders the combo-box input                                                         |
| `renderDownArrow`                      | `<span>`        | Renders down arrow displayed when options are available                             |
| `renderClearButton`                    | `<span>`        | Renders '×' button displayed when an option is selected                             |
| `renderListBox`                        | `<div>`         | Renders the list-box wrapper                                                        |
| `renderTable`                          | `<table>`       | Renders a table, which is the list box                                              |
| `renderTableHeaderCell`                | `<th>`          | Renders a thead header cell with a column name                                      |
| `renderTableGroupRow`                  | `<tr>`          | Renders a row containing a group header                                             |
| `renderTableGroupHeaderCell`           | `<th>`          | Renders a cell containing the group label. This will be ignored by a screen-reader  |
| `renderTableRow`                       | `<tr>`          | Renders a table row, which is a list box option                                     |
| `renderTableCell`                      | `<td>`          | Renders a table cell, one cell is rendered for each column                          |
| `renderGroupAccessibleLabel`           | `<span>`        | Renders the accessible label for a group.  This will be read out before each option |
| `renderTableCellColumnAccessibleLabel` | `<span>`        | Renders the accessible label for column.  This will be read out before each option  |
| `renderColumnValue`                    | `<Fragment>`    | Renders the value within a table cell                                               |
| `renderNotFound`                       | `<div>`         | Renders the not found message                                                       |
| `renderAriaDescription`                | `<div>`         | Renders the aria description of the combo box                                       |
| `renderAriaLiveMessage`                | `<div>`         | Renders an aria live message that alerts users new options have been found          |

[1]: https://w3c.github.io/aria-practices/#grid-popup-keyboard-interaction
