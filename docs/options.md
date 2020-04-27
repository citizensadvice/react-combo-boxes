# Options

Options are an array whose element can be any of:

- `String`
- `Number`
- `null` or `undefined` - will be treated as an empty string
- an object with the following properties:

| Prop               | Type      | Purpose                                              |
| ----               | ----      | ----                                                 |
| `label`            | `String`  | The label of the option (required)                   |
| `disabled`         | `Boolean` | Is the option disabled                               |
| `group`            | `String`  | Label to group options under                         |
| `value`            | `Object`  | Object value used to compare options                 |
| `id`               | `Object`  | Fallback value used to compare options               |
| `html`             | `Object`  | Additional html attributes to be added to the option |
| Any other property |           | Ignored                                              |

When an option is selected `onValue` will be called with the selected option.

## Option identity

When determining which option is selected the "identity" of the option is compared.

The identity is calculated by the equivalent of:

```js
String(option?.value ?? option?.id ?? option?.label ?? option ?? '')
```

## `mapOption`

If your options don't match the object signature you can use `mapOption` to map the options.

When using `mapOption`, the original option is still returned by `onValue` when a value is selected.

```js
const [value, setValue] = useState(initialValue);

const mapOption = useCallback(({ name, deleted }) => {
  return {
    label: name,
    disabled: deleted,
  };
}, []);

<Select
  options={options}
  value={value}
  setValue={setValue}
  mapOption={mapOption}
/>
```

## `placeholder`

This will add a placeholder label option to the start of the options.

```js
<Select
  options={options}
  placeholder="Please choose…"
/>
```
