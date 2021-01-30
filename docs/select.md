# `<Select>`

Generates an HTML `<select>`, but with a more convenient way of setting the options and responding to changed values.

This uses the same basic props as `<DropDown>` and `<ComboBox>` and they maybe used somewhat interchangeably.

> :warning: Some users find `<select>` controls difficult to use.  A radio group may be more appropriate.

## Usage

This is a stateless controlled component.  You must respond to `onValue` or `onChange` to update the selected value.

```js
const [value, setValue] = useState(initialValue);

<Select
  options={options}
  value={value}
  onValue={setValue}
/>
```

| Prop             | Type       | Purpose                                  |
| ----             | ----       | ----                                     |
| `placeholder`    | `String`   | Set a placeholder option                 |
| `options`        | `Array`    | The set of options. [See options][1]     |
| `value`          | `Any`      | The currently selected option            |
| `onValue`        | `Function` | Called with the selected option          |
| `mapOption`      | `Function` | Use to map options. [See options][1]     |
| `renderOption`   | `Function` | Render function for options              |
| `renderOptGroup` | `Function` | Render function for optgroups            |
| `ref`            | `ref`      | Will be forwarded to `<select>` element  |
| Any other prop   |            | Will be passed to the `<select>` element |

[1]: options.md
