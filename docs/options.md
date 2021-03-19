# Options

When passing options into a combobox they have the type:

```js
options: Array<Option | string | number | null | undefined>
```

Where `Option` has the type:

```js
type Option = {
  // The visible label
  label?: string;
  // Is the option disabled and unselectable
  disabled?: boolean;
  // Group the option by this key
  group?: string;
  // Used to calculate the options identity
  value?: any;
  // Used to calculate the options identity
  id?: string;
  // HTML attributes to add to the option
  html?: object;
};
```

## Option identity

When determining which option is selected the "identity" of the option is compared.

The identity is calculated by the equivalent of:

```js
String(option?.value ?? option?.id ?? option?.label ?? option ?? '')
```

## `mapOption`

If your options don't match this signature you can use the `mapOption` to map them to the signature.

```js
mapOption: (option: any) => Option
```

Example:

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
