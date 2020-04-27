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
>
> It is also more cumbersome to add a label to this component.  The native `<label>` element _will not work_.
> Instead you will need to do the following:
>
> ```js
> <div id="label-id">My label</div>
> <DropDown
>  aria-labelledby="label-id"
>  {...moreProps}
> </DropDown>
> ```

## Usage

```js
const [value, setValue] = useState(initialValue);

<DropDown
  options={options}
  value={value}
  onValue={setValue}
/>
```

This is a controlled component.  You must update `value` in response to `onValue`.

Unlike a regular `<select>` the value of this component will not be submitted with a form.
If you wish to submit the value add a `<input type="hidden" name="name" value="value" />` element.

## Props

| Prop              | Type       | Purpose                                                          |
| ----              | ----       | ----                                                             |
| `value`           | Any        | The currently selected option                                    |
| `options`         | `Array`    | The set of options. [See options][1]                             |
| `placeholder`     | `String`   | Set a placeholder option                                         |
| `mapOption`       | `Function` | Use to map options. [See options][1]                             |
| `id`              | `String`   | id of the component (required)                                   |
| `children`        | `Node`     | Will override the displayed value of the combo box               |
| `ref`             | React ref  | Will be passed to combo box element                              |
| `aria-labelledby` | `string`   | Specify the id of the label of the control                       |
| `aria-invalid`    | `string`   | Specify the validity state of the control                        |
| `disabled`        | `Boolean`  | Make the control disabled                                        |
| `required`        | `Boolean`  | Mark the control as required (sets `aria-required`               |
| `onBlur`          | `Function` | Handler for when the component is blured                         |
| `onFocus`         | `Function` | Handler for when the component is focused                        |
| `onValue`         | `Function` | Handler for when a value is selected                             |
| `onLayoutListBox` | `Function` | Handler for custom listbox positioning. See [onLayoutListBox][2] |
| `skipOption`      | `Function` | Allows options to be skipped with keyboard navigation            |
| `findOption`      | `Function` | Customise finding an option when typing                          |

Additional props can be used to customise the component.  See customisation.

## Customisation

A number of hooks are provided to customise the appearance of the component.

The `nameProps` props allow you to add your own attributes to each part, potentially overriding those already present.
This is a good way to add your own classes.

The `NameComponent` props allow you to replace or override each component.  Pass a lowercase string to change
the html element, or a full component if you want a more far reaching change.  Bear-in-mind you will have to
`forwardRef` for a number of the components.

```js
<WrapperComponent {...wrapperProps}>                  // <div>
  <div className={visuallyHiddenClassName} />         // contains the current value for screen readers
  <ComboBoxComponent {...comboBoxProps} />            // <div>
  <ListBoxComponent {...listBoxProps} >               // The entire listbox implementation
    <ListBoxListComponent {...listBoxListProps}>      // <ul>
      <OptionComponent {...optionProps}>              // <li>
        <ValueComponent {...valueProps} />            // Fragment
      </OptionComponent>
      <GroupComponent {...groupProps}>                // Fragment
        <GroupLabelComponent {...groupProps} />       // <li>
        <OptionComponent {...optionProps}>            // <li>
          <div className={visuallyHiddenClassName} /> // contains the group name for screen readers
          <ValueComponent {...valueProps} />          // Fragment
        </OptionComponent>
      </GroupComponent>
    </ListBoxListComponent>
  </ListBoxComponent>
</WrapperComponent>
```

### Context

A context is provided to access the props and internal state of the control.  The properties are:

- `expanded` is the component expanded
- `activeOption` the currently active option
- `props` the props supplied to the component.

### Advanced options

#### `managedFocus` (`Boolean`)

By default this is `true`.  It means the browser focus follows the current selected option.

If `false` the combo box element remains focused and the current selected option is
marked with `aria-activedescendant`.  This method is found to have incomplete compatibility
with many screen-readers.

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
