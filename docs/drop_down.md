# `<DropDown>`

A custom control that works like a HTML `<select>`.

This follows the ARIA 1.2 non-editable [combo box](https://w3c.github.io/aria-practices/#combobox)
design pattern.

> :warning: **Warning** the native `<select>` will be more accessible and easier to use on many devices.
>
> This control may be useful if options require complex styling.  However a radio group may also be more appropriate.
>
> There are significant differences between the way a `<select>` is represented with and interacted with
> on different devices and in different operating systems.  This control has to take a single approach and
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
  aria-labelledby="id-label"
  options={options}
  value={value}
  onValue={setValue}
/>
```

This is a controlled component.  You must update `value` in response to `onValue`.

Unlike a regular `<select>` the value of this component will not be submitted with a form.
If you wish to submit the value add a `<input type="hidden" name="name" value="value" />` element.

## Props

| Prop                | Type       | Purpose                                                          |
| ----                | ----       | ----                                                             |
| `value`             | Any        | The currently selected option                                    |
| `options`           | `Array`    | The set of options. [See options][1]                             |
| `placeholderOption` | `String`   | Set a placeholder option                                         |
| `mapOption`         | `Function` | Use to map options. [See options][1]                             |
| `id`                | `String`   | id of the component (required)                                   |
| `children`          | `Node`     | Will override the displayed value of the combo box               |
| `ref`               | React ref  | Will be passed to combo box element                              |
| `aria-labelledby`   | `string`   | Specify the id of the label of the control                       |
| `aria-invalid`      | `string`   | Specify the validity state of the control                        |
| `disabled`          | `Boolean`  | Make the control disabled                                        |
| `required`          | `Boolean`  | Mark the control as required (sets `aria-required`               |
| `onBlur`            | `Function` | Handler for when the component is blured                         |
| `onFocus`           | `Function` | Handler for when the component is focused                        |
| `onValue`           | `Function` | Handler for when a value is selected                             |
| `onLayoutListBox`   | `Function` | Handler for custom listbox positioning. See [onLayoutListBox][2] |
| `skipOption`        | `Function` | Allows options to be skipped with keyboard navigation            |
| `findOption`        | `Function` | Customise finding an option when typing                          |
| `managedFocus`      | `Function` | Use managed focus                                                |

Additional props can be used to customise the component.  See customisation.

## Customisation

A number of render methods are provided to customise the appearance of the component.

Each render method has the signature `render(props, state, componentProps)` where:

- `props` are the default props for that component
- `state` state is the current state of the combo box and has the properties:
  - `currentOption` - `Object` - the currently selected option
  - `expanded` - `Boolean` - is the list box showing
  - `group` - `Object` - the currently rendered group (when rendering a group or option only)
  - `option` - `Object` - the currently rendered option (when rendering an option only)
  - `search` - `String` - the current search string
  - `selected` - `Boolean` - is the currently selected option selected (when rendering an option only)
- `componentProps` - the props passed to the component

The render functions available are:

| Name                         | Default element | Description                                                                         |
| `renderWrapper`              | `<div>`         | Renders the component wrapper                                                       |
| `renderListBox`              | `<ul>`          | Renders the list-box                                                                |
| `renderGroup`                | `<Fragment>`    | Wraps a group of options                                                            |
| `renderGroupLabel`           | `<li>`          | Renders the visible label for a group. This will be ignored by a screen-reader      |
| `renderOption`               | `<li>`          | Renders an option                                                                   |
| `renderGroupAccessibleLabel` | `<span>`        | Renders the accessible label for a group.  This will be read out before each option |
| `renderValue`                | `<Fragment>`    | Renders the value within an option                                                  |

### Advanced options

#### `managedFocus` (`Boolean`)

By default this is `true`.  It means the browser focus follows the current selected option.

If `false` the combo box element remains focused and the current selected option is
marked with `aria-activedescendant`.  This method is found to have incomplete compatibility
with some screen-readers.

#### `skipOption` (`Function`)

This function can be used to skip an option when navigating with the arrow keys.

It has the signature `function (option: Object): Boolean`.  Return `true` if the option should be skipped.

#### `findOption` (`Function`)

This function can be used to customise finding an option in response to keystrokes.

It has the signature `function (option: Object, search: String): boolean`.
Return true if an option matching the search string is found.

#### `onLayoutListBox` (`Function`)

This is called when the list box is displayed or the options change.

It has the signature `Function (expanded: Boolean, listbox: Element, combobox: Element, option: Element)`

See [onLayoutListBox][2]

[1]: options.md
[2]: on_layout_list_box.md
