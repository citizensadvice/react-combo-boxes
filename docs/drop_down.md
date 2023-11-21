# `<DropDown>`

A custom control that works like a HTML `<select>`.

This follows the ARIA non-editable [combo box][aria-practices] design pattern.

> :warning: **Warning** the native `<select>` will be more accessible and easier to use on many devices.
>
> This control may be useful if options require complex styling. However a radio group may also be more appropriate.
>
> There are significant differences between the way a `<select>` is represented and interacted with
> on different devices and in different operating systems. This control has to take a single approach and
> may confuse some users.

## Usage

```js
const [value, setValue] = useState(initialValue);

<label
  id="id-label"
>
  Label
</label>
<DropDown
  id="id"
  // This is required as the component cannot use a html `<label>`
  aria-labelledby="id-label"
  options={options}
  value={value}
  onValue={setValue}
/>
```

This is a controlled component. You must update `value` in response to `onValue`.

Unlike a regular `<select>` the value of this component will not be submitted with a form.
If you wish to submit the value add a `<input type="hidden" name="name" value="value" />` element.

## Props

This uses the same properties as [ComboBox][combo-box], with the following additions:

### `placeholderOption: string`

Add a placeholder option as the first option in the list.

### `aria-labelledby: string | string[]`

**Required**. This is required as you cannot label a `<div>` using a `<label>`.

### `children: React.ReactNode`

Overrides the ComboBox displayed value.

[aria-practices]: https://w3c.github.io/aria-practices/#combobox
[combo-box]: combo_box.md
