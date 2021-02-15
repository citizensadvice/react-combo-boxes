# `onLayoutListBox`

The `onLayoutListBox` event can be used to programmatically control the size or
position of the list box.

It has the signature `Function ({ expanded: Boolean, listbox: Element, combobox: Element })`

It is called each time any of these properties changes.

A hook is provided to use method

## `useConfineListBox(selector = 'body')`

```js
  const [style, onLayoutListBox] = useConfineListBox();

  <DropDown
    {...props}
    listBoxListProps={{ style }}
    onLayoutListBox={onLayoutListBox}
  />
```

This will set a max-width and a `max-height` on the list box that prevents it exceeding the
width, or height of the window.

Optionally a selector can be passed in to confine the max-width.
