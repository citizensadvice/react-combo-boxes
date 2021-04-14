# `<DropDownTable>`

An alternative layout for a drop down.  This places the results in a table which is more readable for tabulated data.

This has the same options as [DropDown](drop-down) and [ComboBoxTable](combo-box-table).

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

<DropDownTable
  {...props}
  options={options}
  columns={['name', 'age', 'height']} 
  mapOption={map}
/>
```

[drop-down]: drop_down.md
[combo-box-table]: combo_box_table.md
