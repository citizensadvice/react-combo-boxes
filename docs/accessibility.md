# Accessibility

Creating a combo-box implementation that works uniformly across all screen-readers is problematic.

Each screen-reader can behave differently in each browser, and between each version.
Screen-readers are often missing support for some features.  Newer screen-readers support more
features, but many so expensive users do not upgrade them for many years.

This library uses the ARIA 1.0 pattern, along with managed focus.  This has the broadest support
across screen-readers.

> :warning: **Warning** It is essential you test these components with a variety of
> screen-readers and browsers.
>
> This is particular true if you do any customisation.  If there are any changes
> to roles, aria properties or DOM structure it is very easy to completely
> break the combo-box in a screen-reader.

## ARIA 1.0 pattern

The aria github wiki contains an [explanation of the different combo-box patterns][resolving-aria-1.1-issues] and the problems with them.

[ARIA-practices][aria-practices-1.1-combo-box] still contains examples using the 1.1 pattern, however this work poorly with screen-readers.

Even the ARIA 1.2 pattern has issues with screen-readers keyboard support in, for example, VoiceOver.

This library sticks to the ARIA 1.0 pattern which retains broad screen-reader support.

## Managed focus

There are two methods of telling a screen-reader which option is currently selected while using a combo box.

1. The old-fashioned way in managed focus.  Here you move the user focus to the selected option.
2. The new way is the `aria-activedescendant`.  Here the focus stays on the `<input>` and the selected option is specified
   with the `aria-activedescendant` attribute.  This is technically easier to implement.

While modern screen-readers do have broad support for `aria-activedescendant` 

## Status messages

## Groups

It is possible to group options in a select.  Unfortunately most screen-readers do not support
this in a combo box.

This library does support groups, but these are only visible to sighted users as they cannot be represented in ARIA.

In order to support screen-readers the group label is prefixed before every option.

## Keyboard shortcuts


## Highlighting



These components have been testing in several screen-readers and found to work acceptably.

> :warning: **Warning** Theoretically all these components work in the major
> browsers and screen-readers. However not all users will find these components discoverable
> or easy to use.  If possible try to stick to native controls such as `<select>` or `<input type="radio">`.
>
> Be careful to test these components in your application.

This can make designing an accessible component a compromise and user experience will
vary wildly.

These combo boxes use ["managed focus"][3] rather than `aria-activedescendant`.  This is found to be
much more reliable.

[resolving-aria-1.1-issues]: https://github.com/w3c/aria/wiki/Resolving-ARIA-1.1-Combobox-Issues
[aria-practices-1.1-combo-box]: https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
