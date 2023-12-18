# List box layout

For the [ComboBox](combo_box.md) and [DropDown](drop_down.md) components it is
useful to be able to position the list box.

The `onLayoutListBox` event can be used for this purpose.

This takes a single method or an array of methods that will be called
when options are displayed, or the page is scrolled or resized.

```js
// Example that will prevent the listbox extending off the edge or bottom of the window

import {
  layoutMaxWidth,
  layoutMaxHeight,
} from '@citizensadvice/react-combo-boxes';

const onLayoutListBox = [
  layoutMaxHeight,
  (listbox) => layoutMaxWidth(listbox, { contain: '.parent-container' }),
];

function MyComponent() {
  return (
    <ComboBox
      {...rest}
      onLayoutListBox={onLayoutListBox}
    />
  );
}
```

### `layoutMaxHeight`

Prevent the listbox from extending off the viewport or document, vertically.

It will reposition the listbox above the combo-box input if the listbox is near the end of the page.

```js
function layoutMaxHeight(
  listbox: Element,
  {
    contain: string = 'body', // Selector to find a parent to contain list box in
    allowReposition: Boolean = true, // Allow repositioning of the list box
    minMaxHeight: Number = 0 // The minimum max height to set
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
    minMaxWidth: Number = 0 // The minimum max width to set
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

### `layoutPopover`

> This has a dependency on `@floating-ui/react` and is exported as `@citizensadvice/react-combo_boxes/layout_popover`
> to prevent this being a required dependency.

This displays the listbox using `position: fixed` and positioned with
[floating ui](https://floating-ui.com/).

This is useful if the list-box will overflow a modal `<dialog>` or scrolling content.

```js
function layoutPopover(listbox: Element, input: Element): void
```
