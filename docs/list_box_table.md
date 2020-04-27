# `<ListBoxTable>`

An alternative layout for the list box.  This places the results in a table which is more readable for tabulated data.

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

<ComboBox
  {...props}
  options={options}
  ListBoxComponent={ListBoxTable}
  columns={['name', 'age', 'height']} 
  mapOption={map}
/>
```

A `columns` array should be passed.  The elements be:

- `String` - column keys
- `Objects` with the keys:

| Key | Type | Purpose |
| ---- | ---- | ---- |
| `name` | `String` | The object key to show.  Required |
| `label` | `Node` | If present it will show the HTML headers |
| `html` | `Object` | HTML attributes to be added to `<col>` elements for each column |

## Customisation

The properties for customisation are as follows:

```js
  <ListBoxListComponent {...listBoxListProps}> // <div>
    <table {...tableProps>
      <thead>
        <tr>
          <th {...tableHeaderProps}/>
        </tr>
      </thead>
      <tbody>
        <tr {...tableGroupRowProps}>
          <td colspan {...tableGroupHeaderProps} />
        </tr>
        <tr {...tableRowProps}>
          <td {...tableCellProps}>
            <div className={visuallyHiddenClassName} /> // contains group name in first cell if present
            <div className={visuallyHiddenClassName} /> // contains column label if present
            <ValueComponent {...valueProps} />          // Fragment
          </td>
        </tr>
      </tbody>
    </table>
  </ListBoxListComponent>
```

## `onLayoutListBox`

An alternative confine hook is provided for this list box `useConfineListBoxTable`.

See [onLayoutListBox][2]

[1]: https://w3c.github.io/aria-practices/#grid-popup-keyboard-interaction
[2]: on_layout_list_box.md
