# `<Radios>`

Generates a group of radios.

Although radios are not a combo-box they are a good alternative.
Many users find combo-boxes hard to use and radios perform a very
similar function to a `<select>`.

## Usage

This is a stateless controlled component.  You must respond to `onValue` to update the selected value.

```js
const [value, setValue] = useState(initialValue);

<Radios
  options={options}
  value={value}
  onValue={setValue}
/>
```

## Props

### `name: String`

`name` attribute for each radio. This is required by HTML for a radio group to function.

### `options: Array<any>`

The options to display. [See options][options].  

Radios take an additional `description` property that allows an optional description to be added to a radio.

### `mapOption: (option: any) => Option | string`

Map an option into label, value, disabled and group. [See options][options]  

### `value: any`

The currently selected option

### `onChange: (event: Event) => void`

Change event added to each radio.

### `onValue: (option: any) => void`

Called with the selected option when a user selects an option.

#### `required: boolean = false`

Mark all the radios in the radio group as required.

#### `classPrefix: string = "react-combo-boxes-radio'`

By default the component is built using BEM style class names.  This sets the prefix for all those classes.

Set to falsey to remove the BEM classes.

#### `groupClassPrefix: string = "react-combo-boxes-radio-group'`

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

| Name                         | Default value                     | Description                                                                         |
| ----                         | ----                              | ----                                                                                |
| `renderWrapper`              | `(props) => <div {...props} />`   | Renders the wrapper for each radio                                                  |
| `renderInput`                | `(props) => <input {...props} />` | Renders the radio input                                                             |
| `renderLabel`                | `(props) => <label {...props} />` | Renders label for a radio                                                           |
| `renderDescription`          | `(props) => <div {...props} />`   | Renders the optional description for a radio                                        |
| `renderGroup`                | `(props) => <div {...props} />`   | Wraps a group of options                                                            |
| `renderGroupLabel`           | `(props) => <div {...props} />`   | Renders the visible label for a group. This will be ignored by a screen-reader      |
| `renderGroupAccessibleLabel` | `(props) => <span {...props} />`  | Renders the accessible label for a group.  This will be read out before each option |


[options]: options.md
