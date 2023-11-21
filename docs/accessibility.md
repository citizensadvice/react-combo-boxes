# Accessibility

Some notes the accessibility of combo boxes.

Creating a combo-box implementation that works uniformly across all screen-readers is problematic.

While combo-boxes have been around for a long time, even the native browser combo-box (using `<datalist>`)
has poor usability for screen-readers, and has only recently been available on iOS touch devices.

Each screen-reader, browser and platform combination behaves differently and supports a different set of features.
When you consider different screen-reader, browser and platforms versions this gives you thousands of combinations
that may have subtle bugs, differences or outright incompatibilities.

Screen-readers can be so expensive many users don't upgrade them for years. Incompatibilities and
behaviour changes in newer browsers mean some users prefer to stick with a trusted outdated browser version.

Added to this some users may not be familiar with the concept of combo-boxes.
Sighted users will generally be able to "figure it out" from visual cues and can at least hunt and peck with a mouse,

It is harder to give non-sighted users relevant audible cues. This is made more difficult by not knowing what
information a screen-reader has or hasn't given the user. For example, VoiceOver will read out system hints containing
confusing keyboard shortcuts.

## Combo-box pattern

There are three official combo-box patterns: [ARIA 1.0, ARIA 1.1](https://www.w3.org/TR/wai-aria-practices/#combobox)
and [ARIA 1.2](https://w3c.github.io/aria-practices/#combobox). The ARIA GitHub wiki contains an
[explainer](https://github.com/w3c/aria/wiki/Resolving-ARIA-1.1-Combobox-Issues) on why.

Ultimately it is best to stick to the ARIA 1.0 pattern. This has the greatest screen-reader compatibility.

It is essential the correct roles and attributes are used. Without the correct roles a screen-reader will hijack the arrow
keys for moving the virtual cursor and the component will not work at all.

## Tab stops

Each widget on a page - for example a combox-box, menu, textbox, tablist - is supposed to be a single tab-stop.

That means you are supposed tab between widgets, but not within a widget. Within a widget you use arrow keys.

Overall, this is better for experience for users, but can [trip-up novice users](http://simplyaccessible.com/article/danger-aria-tabs/).

This library treats a combo-box as a single tab-stop. However there is an option to allow [tabbing between combo-box options](combo_box.md#tabbetweenoptions-boolean--false).

## Managed focus vs `aria-activedescendant`

ARIA 1.0 introduced the [`aria-activedescendant`](https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant) attribute.

This is supposed to simplify managing focus inside a widget so it can remain a single tab-stop.

While `aria-activedescendant` now works well in most screen-readers, unfortunately it doesn't work
perfectly in all screen-readers. VoiceOver in particular has had some bugs in this area.

This library uses managed-focus for maximum compatibility. That means focusing options using the keyboard
moves browser focus.

If is possible to opt out of this by setting the [`managedFocus`](combo_box.md#managedfocus-boolean--true) option to `false`.

## Status messages

It is useful for a user to know if a combo-box has any options to select.

Unfortunately most screen-readers do not provide any useful status messages to the user while using a combo-box.

This library uses a debounced live region to notify users when options are available. The implementation and status messages
were copied from [gov.uk accessible combo-box](https://github.com/alphagov/accessible-autocomplete).

A risk is a future screen-reader will provide status messages resulting in verbose duplicated messages.

It is possible to put the current status in the aria description (`aria-describedby`) however screen-readers
are inconsistent in whether they read changes to the aria description. This can create a noisy experience in
some screen-readers, particularly if paired with an aria live region or with a long description.

## Groups

The `<select>` element allows options to be divided into groups using `<optgroup>`. Screen-reader support
for this is patchy. Some have no support. Some, like VoiceOver, treat a group as a disabled option, others announce
groups in a similar manner to fieldsets.

ARIA 1.0 / 1.1 does not support using groups on a combobox. ARIA 1.2 has [added support for groups as a child of a listbox](https://w3c.github.io/aria/#substantive-changes-since-the-wai-aria-1-1-recommendation),
but screen-reader support is limited and using this pattern will break screen-readers without support.

This library does support groups, but these are simulated. The visual labels are not accessible to the screen-reader
but each option is prefixed with a visually hidden group name. This means the group name is repeated for every option when read by a screen-reader.

## Disabled options

The recommend interaction pattern for disabled options is unclear.

For `<select>` some screen-readers will allow you to navigate into a disabled options, others will skip over them not
letting the user know they are present.

This library allows you to navigate into a disabled option, and for a screen-reader to read it.

## Grid layout

ARIA 1.1 introduced a [combo-box grid layout](https://www.w3.org/TR/wai-aria-practices-1.1/#grid-popup-keyboard-interaction).

This has poor screen-reader compatibility.

This library provides a [simulated grid layout](combo_box_table.md) using a `<table>`. This isn't a true grid layout as the user
cannot use the arrow keys to move between cells. Instead the entire table row is read out for each option.
Visually hidden labels will also read out the table headers.

## Keyboard shortcuts

ARIA practices contains a number of recommended keyboard shortcuts.

This library implements all of these while ensuring the shortcuts don't interfere with platform conventions.

For example:

- <kbd>Home</kbd> and <kbd>End</kbd> are recommended to shortcuts for the first and last option in ARIA practices, however
  on windows these move to the start and end of a textbox. Therefore this is only implemented on a macOS.
- some additional macOS shortcuts, for example <kbd>ctrl</kbd> + <kbd>h</kbd> for backspace, are supported.

Some shortcuts are ambiguous.

- <kbd>Escape</kbd>: should it clear the current option or just close the listbox? This library just closes the list box.
- It is unclear if <kbd>Tab</kbd> should select the currently focused option. This library has a [few behaviour flags](combo_box.md#tabautocomplete-boolean--false) for
  different tab options.

## Highlighting

This library supports [highlighting](highlighters.md) the parts of the found results that match the search term.

Semantically this can be archived with `<mark>Hyp</mark>atia`.

Unfortunately some screen-readers read this as "Hyp athia", which can turn search results into nonsense.

This library hides the highlighted text from a screen-reader and uses a visually hidden element so it always reads the unhighlighted result.

## Autocomplete

ARIA practices has several schemes for autocompleting. It is debatable whether these will do anything more
than confuse the user. Nevertheless they [are supported](combo_box.md#autoselect-boolean--inline--false).
