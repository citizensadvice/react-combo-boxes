# `<ComboBox>`

Creates a searchable drop down, sometimes called a typeahead or autocomplete.

This uses the ARIA 1.2 editable [combo box](https://w3c.github.io/aria-practices/#combobox)
design pattern.

> :warning: **Warning** this pattern can be useful but some users may find it difficult
> or confusing to use.

Combo-boxes like this are used in multiple different ways with many different interaction patterns.
This implementation is mainly intended for finding and picking an item.  

This control can also be used to create autocomplete type searches.  See some of the examples for how you can do this.
You may also consider using a native `<datalist>` for this.

## Usage

```js
const [value, setValue] = useState(initialValue);
const [onSearch, filteredOptions] = useTokenSearch(options);

<ComboBox
  options={filterOptions}
  value={value}
  onValue={setValue}
  onSearch={search}
/>
```

This is a controlled component.  You must update `value` in response to `onValue` or `onChange`.

The `onSearch` function is called with the current search value and should be used to update the options.

## Props

| Prop                | Type                    | Purpose                                                             |
| ----                | ----                    | ----                                                                |
| `options`           | `Array`                 | The set of options. [See options][1]                                |
| `value`             | Any                     | The currently selected option                                       |
| `mapOption`         | `Function`              | Use to map options. [See options][1]                                |
| `busy`              | `Boolean` or null       | The busy status of the search. See busy                             |
| `busyDebounce`      | `Number`                | Debounce busy notifications, defaults to 200                        |
| `aria-describedby`  | `string`                | Ids of elements describing the `<input>`                            |
| `className`         | `string`                | Class name of the wrapper                                           |
| `id`                | `String`                | id of the component (required)                                      |
| `ref`               | React ref               | Will be passed to the `<input>`                                     |
| `notFoundMessage`   | `String`                | Message to show if the search string has no results.                |
| `onBlur`            | `Function`              | Handler for when the component is blured                            |
| `onChange`          | `Function`              | Handler for typing in the input.                                    |
| `onFocus`           | `Function`              | Handler for when the component is focused                           |
| `onSearch`          | `Function`              | Handler for searching.  See [Searchers][2]                          |
| `onLayoutListBox`   | `Function`              | Handler for custom listbox positioning. See [onLayoutListBox][3]    |
| `onValue`           | `Function`              | Handler for when a value is selected                                |
| `autoselect`        | `Boolean` or `"inline"` | If set the first matching option will be automatically selected     |
| `expandOnFocus`     | `Boolean`               | Show available options when focusing.  Defaults to true             |
| `findSuggestion`    | `Function`              | Customise finding the autoselect option                             |
| `showSelectedLabel` | `Boolean`               | When true, the value in the `<input>` will match the selected label |
| `skipOption`        | `Function`              | Allows options to be skipped with keyboard navigation               |
| `tabAutocomplete`   | `Boolean`               | When true, pressing tab will select an autocompleted option         |

The following properties will be passed directly to the `<input>`: `autoCapitalize`, `disabled`,
`inputMode`, `maxLength`, `minLength`, `pattern`, `placeholder`, `readOnly`, `required`, `size` and `spellCheck`.

Additional props can be used to customise the component.  See customisation.

### Busy

If `busy` is set to `true` this sets `aria-busy` to `"true"`.  If `false` it sets it to `"false"`.

If `null` this also sets it to `false` to tells the component the search was not run.  This prevents the not found message showing.

Setting `aria-busy` is debounced to prevent some screen-readers constantly reading "loaded", you can adjust the debounce.

## Customisation

A number of hooks are provided to customise the appearance of the component.

The `nameProps` props allow you to add your own attributes to each part, potentially overriding those already present.
This is a good way to add your own classes.

The `NameComponent` props allow you to replace or override each component.  Pass a lower-case string to change
the html element, or a full component if you want a more far reaching change.  Bear-in-mind you will have to
`forwardRef` for a number of the components.

```js
<WrapperComponent {...wrapperProps}>                                  // <div>
  <BeforeInputComponent />                                            // Fragment
  <InputComponent {...inputProps} />                                  // <input>
  <ListBoxComponent {...listBoxProps} >                               // the entire listbox implementation
    <ListBoxListComponent {...listBoxListProps}>                      // <ul>
      <OptionComponent {...optionProps}>                              // <li>
        <ValueComponent {...valueProps} />                            // Fragment
      </OptionComponent>
      <GroupComponent {...groupProps}>                                // Fragment
        <GroupLabelComponent {...groupProps} />                       // <li>
        <OptionComponent {...optionProps}>                            // <li>
          <div className={visuallyHiddenClassName } />                // contains the group name for screen readers
          <ValueComponent {...valueProps} />                          // Fragment
        </OptionComponent>
      </GroupComponent>
    </ListBoxListComponent>
    <OpenButtonComponent {...openButtonProps} />                      // <span>
    <ClearButtonComponent {...clearButtonProps} />                    // <span>
    <FoundDescriptionComponent className={visuallyHiddenClassName} /> // Tells screen readers how many results were found
    <NotFoundComponent {...notFoundProps} />                          // <div>
  </ListBoxComponent>
</WrapperComponent>
```

### Context

A context is provided to access the props and internal state of the control.  The properties are:

- `expanded` is the component expanded
- `notFound` is the not found message shown
- `activeOption` the currently active option
- `search` the current search term
- `suggestedOption` the currently suggested option
- `props` the props supplied to the component
- `aria-busy` the computed value of aria-busy
- `aria-autocomplete` the computed value of aria-autocomplete
- `props` the props supplied to the component

### Highlighters

It is possible to highlight the parts of the matching the search term by replacing the `ValueComponent`.  See [Highlighters][4].

## Advanced options

### `autoselect` (`true`, `false`, or `"inline"`)

If `true` the suggested option will be automatically selected.

If set to `"inline"` the option will be completed using inline autocomplete.  See [ARIA practices](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)

### `expandOnFocus` (`Boolean`)

If true, the list box will be opened, if there are any available options, when the user focuses
the components.

### `findSuggestion` (`Function`)

Customise finding a suggested option.  By default the suggested option is the first selectable
option providing it starts with the search string.

This takes a function with the signature `function (option: Object, search: String): Boolean`.
Return `true` to select an option, `null` to continue finding an option, or `false` to stop searching.

### `managedFocus` (`Boolean`)

By default this is `true`.  It means the browser focus follows the current selected option.

If `false` the combo box element remains focused and the current selected option is
marked with `aria-activedescendant`.  This method is found to have incomplete compatibility
with many screen-readers.

### `onLayoutListBox` (`Function`)

This is called when the list box is displayed or the options change.

It has the signature `Function ({ expanded: Boolean, listbox: Element, combobox: Element, option: Element })`

See [onLayoutListBox][2]

### `skipOption` (`Function`)

This function can be used to skip an option when navigating with the arrow keys.

It has the signature `function (option: Object): Boolean`.  Return `true` if the option should be skipped.

### `showSelectedLabel` (`Boolean`)

If true, the label of the currently selected option will be shown in the `<input>` instead of the search string.
If false, the list box will always show the current search string.

### `tabAutocomplete` (`Boolean`)

If true pressing tab will select the suggested option.  If false, pressing tab will behave normally and
move the focus to the next control.

[1]: options.md
[2]: searchers.md
[3]: on_layout_list_box.md
[4]: highlighters.md
