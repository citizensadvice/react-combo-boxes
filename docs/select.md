# `<Select>`

Generates an HTML `<select>`, but with a more convenient way of setting the options and responding to changed values.

This uses the same basic props as `<DropDown>` and `<ComboBox>` and they maybe used somewhat interchangeably.

[`<Radios>`][radios] or [`<Checkboxes>`][checkboxes] are a practical alternative to a `<select>` that may users find easier to use.

## Usage

This is a stateless controlled component. You must respond to `onValue` or `onChange` to update the selected value.

```js
const [value, setValue] = useState(initialValue);

<Select
  options={options}
  value={value}
  onValue={setValue}
/>;
```

## Props

### `placeholderOption: string`

Set a placeholder option

### `options: Array<any>`

The options to display. [See options][options].

### `mapOption: (option: any) => Option | string`

Map an option into label, value, disabled and group. [See options][options]

### `value: any`

The currently selected option

### `values: Array<any>`

The currently selected options when using `multiple`.

### `onValue: (option: any) => void`

Called with the selected option when a user selects an option.

### `onValues: (options: Array<any>) => void`

Called with the selected options when a user selects an option.

### `ref`

The ref will be passed to the `<select>` element.

### `multiple: boolean = false`

Allow multiple options to be selected. If this option is selected use `values` to set the values and `onValues` to get the values.

### `renderOption: (props) => React.ReactNode`

Customise the rendering of an option. Defaults to `(props) => <option {...props> />`.

### `renderOptGroup: (props) => React.ReactNode`

Customise the rendering of an optgroup. Defaults to `(props) => <optgroup {...props> />`.

### Other props

All other props are passed to the `<select>` element.

[options]: options.md
[radios]: radios.md
[checkboxes]: checkboxes.md
