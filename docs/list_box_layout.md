# List box layout

For the [ComboBox](combo_box.md) and [DropDown](drop_down.md) components it is 
useful to be able to position the list box.

The `onDisplayListBox` event can be used for this purpose.

```js
import { useLayoutListBox, layoutMaxWidth, layoutMaxHeight } from '@citizensadvice/react-combo-boxes';

const onDisplayListBox = useLayoutListBox(
  layoutMaxHeight,
  (listbox) => layoutMaxWidth(listbox, { contain: '.parent-container' }),
);

<ComboBox
  {...rest}
  onDisplayListBox={onDisplayListBox}
/>

```

An effect is provided for some basic use cases:

## `useLayoutListBox`

```js
function useLayoutListBox(
  ...fns: Array<(listbox: Element) => void>)`
): Function
```

This takes one or more methods with the signature `(listbox: Element) => void`.

The methods will be called when options are displayed, and when the page is scrolled or resized.

### `layoutMaxHeight`

Prevent the listbox from extending off the viewport or document, vertically.

```js
function layoutMaxHeight(
  listbox: Element,
  {
    contain: string = 'body', // Selector to find a parent to contain list box in
  }
): void
```

### `layoutMaxWidth`

Prevent the listbox from extending off the viewport or document horizontally.

```js
function layoutMaxWidth(
  listbox: Element,
  {
    contain: string = 'body', // Selector to find a parent to contain list box in
  }
): void
```

### `layoutColumnsAlignLeft`

When using [`ComboBoxTable`](combo_box_table.md) or [`DropDownTable`](drop_down_table.md),
left align the columns in the table.

The standard table layout algorithm will distribute unused space evenly amongst the columns.
This can result in a very sparse table that is difficult to read.

```js
function layoutMaxWidth(listbox: Element): void
```
