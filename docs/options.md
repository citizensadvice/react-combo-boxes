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
  // Used as a fallback for `label`
  name?: string;
  // Used as a fallback for `label` and `name`
  title?: string;
  // Is the option disabled and unselectable
  disabled?: boolean;
  // Group the option by this key
  group?: string;
  // Used to calculate the options identity
  value?: any;
  // Used as a fallback for `value`
  id?: string;
  // HTML attributes to add to the option
  html?: object;
  // A description of the option - only used on `<Radio>` and `<Checkboxes>`
  description?: string | ReactElement;
  // Used as a fallback for `description`
  hint?: string | ReactElement;
};
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
/>;
```

## Option identity

When determining which option is selected the "identity" of the option is compared.

The identity is calculated by the equivalent of:

```js
String(option?.value ?? option?.id ?? option?.label ?? option ?? '');
```
