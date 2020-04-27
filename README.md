# React combo box

Combo boxes implemented in React.

The combo boxes follow the design patterns in [ARIA Authoring Practices guidelines][1] 

## Usage

See the [documentation and examples][2].

## Accessibility

These components have been testing in several screen-readers and found to work acceptably.

> :warning: **Warning** Theoretically all these components work in the major
> browsers and screen-readers. However not all users will find these components discoverable
> or easy to use.  If possible try to stick to native controls such as `<select>` or `<input type="radio">`.
>
> Be careful to test these components in your application.

Each screen-reader behaves markedly differently in each browser, and between each version.
Screen-readers are often missing support for some features and some are so expensive
users do not upgrade them for many years.

This can make designing an accessible component a compromise and user experience will
vary wildly.

These combo boxes use ["managed focus"][3] rather than `aria-activedescendant`.  This is found to be
much more reliable.

## Styling

Basic SASS styles are provided in the styles directory.

## Development

```bash
npm install
npm start
```

See package.json for more commands.

[1]: https://w3c.github.io/aria-practices/
[2]: https://citizensadvice.github.io/react-list-boxes
[3]: https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_general_within
