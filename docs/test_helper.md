# Test helper

The test helper `select_combo_box_options` is provided.

This requires `@testing-libaray/react`;

```js
import { selectComboBoxOption } from '@citizensadvice/react-combo-boxes';

describe('a test', () => {
  it('helps select a combo box option', async () => {
    await selectComboBoxOption({ from: 'My label', searchFor: 'Foo', select: 'Bar' });
  });
});
```

`selectComboBoxOption({ from, searchFor, select })`

- `from` (String|RegExp|Object) - The name for the combo-box, or an object if you want to specify more [findByRole options][1]
- `searchFor` (String) - optional - text to be typed into the combo box
- `select` (String|RegExp|Object) - The name of the option, or an object if you want to specify more [findByRole options][1]
- `container` (Node) - optional - The container to search in.  Defaults to `document.body`

## Clearing an option

If you want to clear an option you can use [`userEvent.clear`][2]

```js
describe('a test', () => {
  it('clears a combo box option', async () => {
    userEvent.clear(findByRole('combobox', { name: 'My label' }));
    // The update is async so wait for a change
    await  waitFor(() => {
      expect(something).toHappen();
    });
  });
});
```

[1]: https://testing-library.com/docs/dom-testing-library/api-queries#byrole
[2]: https://github.com/testing-library/user-event#clearelement
