# `<ComboBox>`

Creates a searchable drop down, sometimes called a typeahead or autocomplete.

This uses the ARIA 1.2 editable [combo box](https://w3c.github.io/aria-practices/#combobox)
design pattern.

Combo-boxes like this are used in multiple different ways with many different interaction patterns.
This implementation is mainly intended for finding and picking an item.  

This control can also be used to create autocomplete type searches.  See some of the examples for how you can do this.
You may also consider using a native `<datalist>` for this.

## Usage

```js
const [value, setValue] = useState(initialValue);
const [search, setSearch] = useState(null);
const filteredOptions = useTokenSearch(search, { options });

<label
  id="id-label"
  htmlFor="id"
>
  Label
</label>
<ComboBox
  id="id"
  aria-labelledby="id-label"
  options={filterOptions}
  value={value}
  onValue={setValue}
  onSearch={setSearch}
/>
```

This is a controlled component.  You must update `value` in response to `onValue`.

The `onSearch` function is called with the current search value and should be used to update the options.

## Props

| Prop                | Type                    | Purpose                                                                           |
| ----                | ----                    | ----                                                                              |
| `options`           | `Array`                 | The set of options. [See options][1]                                              |
| `value`             | Any                     | The currently selected option                                                     |
| `mapOption`         | `Function`              | Use to map options. [See options][1]                                              |
| `busy`              | `Boolean`               | The busy status of the search.                                                    |
| `busyDebounce`      | `Number`                | Debounce busy notifications, defaults to 200                                      |
| `aria-describedby`  | `String` or `String[]`  | Ids of elements describing the `<input>`                                          |
| `aria-labelledby`   | `String` or `String[]`  | Ids of elements labelling the `<input>` and list box                              |
| `className`         | `String`                | Class name of the wrapper                                                         |
| `classPrefix`       | `String` or `null`      | Class prefix for each component.  Set to null to remove class names.              |
| `id`                | `String`                | id of the component (required)                                                    |
| `ref`               | React ref               | Will be passed to the `<input>`                                                   |
| `notFoundMessage`   | `Node`                  | Message to show if the users searchers and options are an empty array             |
| `errorMessage`      | `Node`                  | Message to show if the search has an error                                        |
| `onBlur`            | `Function`              | Handler for when the component is blured                                          |
| `onChange`          | `Function`              | Handler for typing in the input.                                                  |
| `onFocus`           | `Function`              | Handler for when the component is focused                                         |
| `onSearch`          | `Function`              | Handler for searching.  See [Searchers][2]                                        |
| `onLayoutListBox`   | `Function`              | Handler for custom listbox positioning. See [onLayoutListBox][3]                  |
| `onValue`           | `Function`              | Handler for when a value is selected                                              |
| `managedFocus`      | `Boolean`               | Use managed focus                                                                 |
| `autoselect`        | `Boolean` or `"inline"` | If set the first matching option will be automatically selected                   |
| `expandOnFocus`     | `Boolean`               | Show available options when focusing.  Defaults to `true`                         |
| `findSuggestion`    | `Function`              | Customise finding the autoselect option                                           |
| `selectOnBlur`      | `Boolean`               | Select the current selection on blur if not already selected.  Defaults to `true` |
| `showSelectedLabel` | `Boolean`               | When true, the value in the `<input>` will match the selected label               |
| `skipOption`        | `Function`              | Allows options to be skipped with keyboard navigation                             |
| `tabAutocomplete`   | `Boolean`               | When true, pressing tab will select an autocompleted option                       |

The following properties will be passed directly to the `<input>`: `autoCapitalize`, `disabled`,
`inputMode`, `maxLength`, `minLength`, `pattern`, `placeholder`, `readOnly`, `required`, `size` and `spellCheck`.

Additional props can be used to customise the component.  See customisation.

## Customisation

A number of render methods are provided to customise the appearance of the component.

Each render method has the signature `render(props, state, componentProps)` where:

- `props` are the default props for that component
- `state` state is the current state of the combo box and has the properties:
  - `aria-autocomplete` - `String` - the `aria-autocomplete` value for the component
  - `aria-busy` - `String` - the `aria-busy` value for the component
  - `currentOption` - `Object` - the currently selected option
  - `expanded` - `Boolean` - is the list box showing
  - `group` - `Object` - the currently rendered group (when rendering a group or option only)
  - `notFound` - `Boolean` - is the not found message showing
  - `option` - `Object` - the currently rendered option (when rendering an option only)
  - `search` - `String` - the current search string
  - `selected` - `Boolean` - is the currently selected option selected (when rendering an option only)
  - `suggestedOption` - `Object` - the currently suggested option
- `componentProps` - the props passed to the component

The render functions available are:

| Name                         | Default element | Description                                                                         |
| `renderWrapper`              | `<div>`         | Renders the component wrapper                                                       |
| `renderInput`                | `<input>`       | Renders the combo-box input                                                         |
| `renderDownArrow`            | `<span>`        | Renders down arrow displayed when options are available                             |
| `renderClearButton`          | `<span>`        | Renders '×' button displayed when an option is selected                             |
| `renderListBox`              | `<ul>`          | Renders the list-box                                                                |
| `renderGroup`                | `<Fragment>`    | Wraps a group of options                                                            |
| `renderGroupLabel`           | `<li>`          | Renders the visible label for a group. This will be ignored by a screen-reader      |
| `renderOption`               | `<li>`          | Renders an option                                                                   |
| `renderGroupAccessibleLabel` | `<span>`        | Renders the accessible label for a group.  This will be read out before each option |
| `renderValue`                | `<Fragment>`    | Renders the value within an option                                                  |
| `renderNotFound`             | `<div>`         | Renders the not found message                                                       |
| `renderErrorMessage`         | `<div>`         | Renders the error message                                                           |
| `renderAriaDescription`      | `<div>`         | Renders the aria description of the combo box                                       |
| `renderAriaLiveMessage`      | `<div>`         | Renders an aria live message that alerts users new options have been found          |

### Highlighters

It is possible to highlight the parts of the matching the search term using `renderValue`.  See [Highlighters][4].

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

By default this is `true`, expect on non-Safari browser on a Mac.  It means the browser focus follows the current selected option.

If `false` the combo box element remains focused and the current selected option is marked with `aria-activedescendant`.

### `onLayoutListBox` (`Function`)

This is called when the list box is displayed or the options change.

It has the signature `Function ({ expanded: Boolean, listbox: Element, combobox: Element })`

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
