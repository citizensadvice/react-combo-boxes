# `<Checkboxes>`

Generates a group of checkboxes.

Although checkboxes are a practical alternative to a using a `<Select multiple />`
and behave very like a list box.

## Usage

This is a stateless controlled component. You must respond to `onValue` to update the selected value.

```js
const [values, setValues] = useState(initialValues);

<Checkboxes
  options={options}
  values={values}
  onValues={setValues}
/>;
```

## Props

### `name: String`

Optional. `name` attribute for each checkbox.

Use the `html` option on an option if any checkbox needs a unique name.

### `options: Array<any>`

The options to display. [See options][options].

Checkboxes take an additional `description` property that allows an optional description to be added to a checkbox.

### `mapOption: (option: any) => Option | string`

Map an option into label, value, disabled and group. [See options][options]

### `values: Array<any>`

The currently selected option

### `onChange: (event: Event) => void`

Change event added to each checkbox.

### `onValues: (option: Array<any>) => void`

Called with the selected option when a user selects an option.

#### `classPrefix: string = "react-combo-boxes-checkbox'`

By default the component is built using BEM style class names. This sets the prefix for all those classes.

Set to falsey to remove the BEM classes.

#### `groupClassPrefix: string = "react-combo-boxes-checkbox-group'`

BEM class prefix for groups.

Set to falsey to remove the BEM classes.

#### render props

A number of render methods are provided to customise the appearance of the component.

Each render method has the signature

```js
(
  // The props set on the <ComboBox>
  props: object,
  // The state of the component
  state: {
    // Current option
    option: Option;
    // Is the current option selected
    checked: boolean;
    // Current group
    group: Group;
  },
  // The props passed into the component
  componentProps: object;
) => React.ReactNode
```

The render functions available are:

| Name                 | Default value                                         | Description                                                                    |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| `renderWrapper`      | `({ key, ...props }) => <div key={key} {...props} />` | Renders the wrapper for each checkbox                                          |
| `renderInput`        | `(props) => <input {...props} />`                     | Renders the checkbox input                                                     |
| `renderLabel`        | `(props) => <label {...props} />`                     | Renders label for a checkbox                                                   |
| `renderLabelWrapper` | `(props) => <Fragment {...props} />`                  | Allows an element to wraps the label and description                           |
| `renderDescription`  | `(props) => <div {...props} />`                       | Renders the optional description for checkbox                                  |
| `renderGroup`        | `({ key, ...props }) => <div key={key} {...props} />` | Wraps a group of options                                                       |
| `renderGroupLabel`   | `(props) => <div {...props} />`                       | Renders the visible label for a group. This will be ignored by a screen-reader |

[options]: options.md
