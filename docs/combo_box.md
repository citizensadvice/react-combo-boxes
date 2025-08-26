# `<ComboBox>`

Creates drop-down combined with an editable text-box. Also referred to as a typeahead or an autocomplete.
Typing will suggest options which the user can then select.

This uses the ARIA 1.0 editable [combo box][aria-practices-combo-box] design pattern.

Combo-boxes like this are used in multiple different ways with many different interaction patterns.
This implementation is flexible and can be used, for example, as both a search autocomplete or to restrict select to a set of predefined options.

It supports loading options asynchronous and highlighting the matched text.

## Usage

```js
const [value, setValue] = useState(initialValue);
// Updates as the user types
const [search, setSearch] = useState(null);
// Filter the options using the search term
const filteredOptions = useTokenSearch(search, { options });

<label
  id="id-label"
  htmlFor="id"
>
  Label
</label>
<ComboBox
  id="id"
  // required so the listbox is properly labelled
  aria-labelledby="id-label"
  options={filterOptions}
  value={value}
  onValue={setValue}
  onSearch={setSearch}
/>
```

This is a controlled component. You must update `value` in response to `onValue`.

The `onSearch` function is called with the current search value and should be used to update the options.

## Props

### Display and selecting options

#### `options: Array<any>`

The options to display. [See options][options].

#### `mapOption: (option: any) => Option | string`

Map an option into label, value, disabled and group. [See options][options]

#### `value: any`

The currently selected option

#### `onValue: (option: any) => void`

Called with the selected option when a user selects an option.

#### `onSearch: (search: string) => void`

Called as a user types.

If this isn't supplied the combo-box will be set to `aria-autocomplete="none"`, otherwise it is a `aria-autocomplete="list"`.
See [combo-box on ARIA practices][aria-practices-combo-box].

#### `busy: boolean`

Used with an async search to say the component is currently busy. This sets `aria-busy`.

### HTML attributes

#### `id: string`

**Required** The id of the component

#### `classPrefix: string = "react-combo-boxes'`

By default the component is built using BEM style class names. This sets the prefix for all those classes.

Set to falsey to remove the BEM classes.

#### `className: string`

Sets the class name on the wrapper only.

#### `aria-describedby: string | string[]`

Ids of any elements describing the combo-box.

#### `aria-labelledby: string | string[]`

Ids of any elements labelling the combo-box and the list-box

You should set this to the id of the label as ARIA requires the list-box to be named.

#### `ref`

The ref will be passed to the `<input>` element.

#### Additional HTML attributes

The following attributes will be passed to the `<input>` element.

- `autoCapitalize`
- `disabled`
- `inputMode`
- `maxLength`
- `minLength`
- `pattern`
- `placeholder`
- `readOnly`
- `required`
- `size`
- `spellCheck`.

### Behaviour switches

#### `autoselect: boolean | "inline" = false`

If `true` the first matching option is automatically selected.

If `"inline"` then `aria-autocomplete="inline"` is set and the text typed into the combo-box is autocompleted.

See [ARIA practices][aria-practices-combo-box] for an explanation of these modes.

#### `clearOnSelect: boolean = false`

If true, calls `onSearch` with an empty string when an option is selected.
If false, `onSearch` is called with the selected label.

#### `closeOnSelect: boolean = true`

Close the listbox when an item is selected.

If set to false the list box will remain open and continue to show existing on new options to select.

#### `expandOnFocus: boolean = true`

Expand the list box when then component is focused. If `false` the use must type before the list box is expanded.

#### `selectOnBlur: boolean = true`

Select the currently focused option when blurring the component.

If `false` the user must explicitly select an option by pressing <kbd>Enter</kbd> or clicking on an option.

#### `showSelectedLabel: boolean = false`

If set to `true`, the value in the `input` will be updated to match the currently focused option.

#### `tabAutocomplete: boolean = false`

If `true`, pressing <kbd>Tab</kbd> while an autocompleted option is displayed will select it without moving the focus.

If `false` pressing <kbd>Tab</kbd> moves to the next focusable element. The option may still be selected if `selectOnBlur` is `true`.

#### `tabBetweenOptions: boolean = false`

If `true`, pressing <kbd>Tab</kbd> and <kbd>Shift</kbd> + <kbd>Tab</kbd> will move between options in the listbox.

This is against normal user interface guidelines but maybe preferable in some situations.

### Customisation

#### `assistiveHint`

Sets the description of the combo-box.

Defaults to "When results are available use up and down arrows to review and enter to select"

#### `notFoundMessage: () => string`

Set the message to be displayed or read or a screen-reader when the no search options are found.

Defaults to: "No results found"

#### `foundOptionsMessage: (options: Array<Option>) => string`

Sets the message to be read to a screen-reader when options are found.

Defaults to: "x results are available"

#### `selectedOptionMessage: (option: Option, options: Array<Option>) => string`

Sets the message to be read to a screen-reader when an option is highlighted.

Defaults to: "label x of y is highlighted"

#### `visuallyHiddenClassName: string = 'visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only'`

The class name to visually hide an element. This is used for aria-live messages.

#### render props

A number of render methods are provided to customise the appearance of the component.

Each render method has the signature

```js
(
  // The props set on the <ComboBox>
  props: object,
  // The state of the component
  state: {
    ['aria-autocomplete']: string;
    ['aria-busy']: string;
    // Is the list box open
    expanded: boolean;
    // Is the not found message showing
    notFound: boolean;
    // Current search string
    search: string;
    // Currently selected option
    currentOption: Option;
    // Suggested option if autocomplete is true
    suggestedOption: Option;
    // Current option (when rending an option)
    option: Option;
    // Is the current option selected (when rendering an option)
    selected: boolean;
    // Current group (when rendering a group or option)
    group: Group;
  },
  // The props passed into the component
  componentProps: object;
) => React.ReactNode
```

The render functions available are:

| Name                    | Default value                                              | Description                                                           |
| ----------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| `renderWrapper`         | `(props) => <div {...props} />`                            | Renders the component wrapper                                         |
| `renderInput`           | `(props) => <input {...props} />`                          | Renders the combo-box input                                           |
| `renderDownArrow`       | `(props) => <span {...props} />`                           | Renders down arrow displayed when options are available               |
| `renderClearButton`     | `(props) => <span {...props} />`                           | Renders '×' button displayed when an option is selected               |
| `renderListBox`         | `(props) => <ul {...props} />`                             | Renders the list-box                                                  |
| `renderGroup`           | `({ key, ...props }) => <Fragment key={key} {...props} />` | Wraps a group of options                                              |
| `renderGroupLabel`      | `(props) => <li {...props} />`                             | Renders the group including the options.                              |
| `renderGroupName`       | `(props) => <Fragment {...props} />`                       | Renders the name of the group.                                        |
| `renderOption`          | `({ key, ...props }) => <li key={key} {...props} />`       | Renders an option                                                     |
| `renderValue`           | `(props) => <Fragment {...props} />`                       | Renders the value within an option. See [Highlighters][highlighters]. |
| `renderNotFound`        | `(props) => <div {...props} />`                            | Renders the not found message                                         |
| `renderAriaDescription` | `(props) => <div {...props} />`                            | Renders the assistive hint of the combo box                           |

#### `onLayoutListBox: (listbox: Element) => void | []<(listbox: Element) => void>`

This is called whenever the listbox is displayed or the options change.

This can be used to position or resize the listbox.

See [list box layout][list-box-layout] for some supplied layout helpers.

[options]: options.md
[list-box-layout]: list_box_layout.md
[highlighters]: highlighters.md
[aria-practices-combo-box]: https://w3c.github.io/aria-practices/#combobox
[accessibility]: accessiblity.md
