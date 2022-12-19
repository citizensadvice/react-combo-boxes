# Test helper

This helpers lets you select an option from a combo-box using [Testing Library][testing-library]
and requires `@testing-libaray/react`;

```js
import { selectComboBoxOption } from '@citizensadvice/react-combo-boxes/spec-helpers';
// Depending on your build system you may need to use
import { selectComboBoxOption } from '@citizensadvice/react-combo-boxes/es/spec_helpers';

describe('a test', () => {
  it('helps select a combo box option', async () => {
    await selectComboBoxOption({ from: 'My label', searchFor: 'Foo', select: 'Bar', userEvent });
  });
});
```

`selectComboBoxOption({ from, searchFor, select })`

- `from: string | RegExp | Object` - The name for the combo-box, or an object if you want to specify more [findByRole options][findByRole]
- `searchFor: string` - optional - text to be typed into the combo box
- `select: string | RegExp | Object` - The name of the option, or an object if you want to specify more [findByRole options][findByRole]
- `container: React.ReactNode` - optional - The container to search in.  Defaults to `document.body`
- `userEvent: UserEvent` - A user event instance.  Required if using user-event v14

## Clearing an option

If you want to clear an option you can use [`userEvent.clear`][clear]

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

[testing-library]: https://testing-library.com/
[findByRole]: https://testing-library.com/docs/dom-testing-library/api-queries#byrole
[clear]: https://github.com/testing-library/user-event#clearelement
