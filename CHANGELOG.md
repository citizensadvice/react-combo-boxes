# Change log

## 5.0.0

### Changed

- Highlights are now generated using the [CSS custom highlight api](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API).

## 4.0.0

### Changed

Thanks to recent improvements in browser and screen-reader support it has been possible to make a number of simplifications.

- Remove non-breaking space separators between options as the Mac Chrome bug requiring this has been resolved
- Use aria-labelledby for all option labels involving groups instead of inserting visually hidden text
- Removes the `renderGroupAccessibleLabel` and `renderTableCellColumnAccessibleLabel` from all components
  as these are no longer required
- Removed `managedFocus` option. Focus for screen-readers now entirely uses `aria-activedescendant` which now
  works reliably over all screen-readers
- Switch to the ARIA 1.2 pattern as this now works reliably over all screen-readers
- Adjusted Escape to behave like the aria-practices recommendations. Press once to close and press a second time
  to clear the value.
- Pressing Alt + ArrowUp no longer clears the search value
- A drop down with no options is now focusable

### Fixes

- Fix an issue where drop down aria-live message was prefixed with "undefined"
- Fix the scrolling options not working in the drop down
- Fix pressing Alt + ArrowUp on a dropdown changes the selected option to the default option

## 3.0.2

- Fix stylelint-config-standard-scss was accidentally added to dependencies instead of devDependencies

## 3.0.1

- Added `tabindex="-1"` to the listbox table container to prevent it becoming an extra tab-stop
- Fix floating UI peer dependency was pinned to a minor version

## 3.0.0

- Updates SASS from @import to @use to fix deprecation warnings (potentially breaking)
- Updates SASS to fix mixed declaration errors
- Do not close a combo-box or drop-down if the focus is leaving the browser window
- Add Node 22 to testing matrix
- Switch to eslint 9

## 2.9.0

- If the value is updated for a combo-box and the listbox is visible and there is no user entered search, onSearch will be triggered
- React 18.3 support
  - Remove default props in favour of default parameters
  - Fix warnings on spreading `key`
- Remove Node 16 from the test matrix

## 2.8.1

- Fix misspelled condition means layout functions are run without the listbox or input

## 2.8.0

### Changed

- (Potentially breaking): Layout functions are now called when the listbox is hidden,
  allowing clean-up methods to be run

### Fixed

- `layout_popover` is not hiding the popover when a listbox is closed which can result in the listbox not being in the top layer

## 2.7.0

### Added

- Added a new `layout_popover` to resolves issues displaying list boxes inside
  of scrolling areas or a modal `<dialog>`. This has a peer dependency of floating-ui

### Fixes

- `placeholderOption` should not produce an option for `<Radios>` and `<Checkboxes>`
- layout functions could be called without the listbox or input as null if the ref changed before the animation frame

## 2.6.2

### Fixed

- `placeholderOption` should allow a blank value

## 2.6.1

### Fixed

- `marked-highlight` should have been a devDependency

## 2.6.0

### Fixed

- Simplification of how focus is managed to fix issues with the focus jumping back when tabbing from a combo-box
- The remove cross will no longer show if a selected option's label is blank
- Search suggestions example was not displaying any options

## 2.5.1

### Fixed

- `onSearch` was not being called with an empty string when a combo-box was cleared

## 2.5.0

### Added

- `renderGroupName` option added to `<ComboBox>` and `<DropDown>`

### Fixed

- Visually hidden incorrectly applied on non-breaking spaces in a list box

## 2.4.1

## 2.5.0

### Added

- `renderGroupName` option added to `<ComboBox>` and `<DropDown>`

### Fixed

- Visually hidden incorrectly applied on non-breaking spaces in a list box

## 2.4.1

### Fixed

- `<Checkboxes>` and `<Radios>` now have a space between the label and description

## 2.4.0

### Added

- `<Checkboxes>` and `<Radios>` now have a `renderLabelWrapper` option

## 2.3.0

### Added

- Table layout now allows a `cellClass` property on columns to add additional classes to cells.

## 2.2.0

### Added

- `<Radios>` and `<Checkboxes>` now support an `onChange` event handler
- `name` and `title` are now used as fallbacks for `label` when passing options
- `hint` is now used as a fallback for `description` when passing options to `<Checkboxes>` and `<Radios>`

## 2.1.0

### Added

- Added `clearOnSelect` option to `<ComboBox>`

## 2.0.1

### Fixed

- Fixed an issue with VoiceOver on Chrome on Monterey removing spaces while reading grouped or table options

## 2.0.0

### Changed

- (Breaking) The project is now distributed as es6 modules only
- (Breaking) `onLayoutListBox` now takes an array of handlers and `useLayoutListBox` is removed
- (Breaking) All `highlight…` methods have been replaced with `Highlight…` react components
- Substring highlight now highlights all matching parts
- Some optimisations to reduce renders
- All top level components are now wrapped in memo
- The listbox will now scroll to the top when the options change and no option is focused
- `layoutMaxHeight` will not move the list-box above the combo-box if there is room below.

### Added

- Added a `userEvent` option to `selectComboBoxOption`
- Added `closeOnEnter` option

### Fixed

- React 18 support
- Fixed some unnecessary state updates when selecting options
- Fix label is set to `undefined` if option is supplied with no label
- Fix useAsyncSearch not setting options to `null`
- Fix focused option not scrolling into view in some circumstances
- `userEvent` is now an optional "peer dependency" and not an "optional dependency"

## 1.3.5

- Fix the highlighter helpers not being exported

## 1.3.4

- Fix layoutColumnsAlignLeft not aligning columns where there are groups and no table header

## 1.3.3

- Fix layoutMaxHeight and layoutMaxWidth should use the window height if contain does not resolve to an element

## 1.3.2

- Fix support for @testing-library/user-event version 14

## 1.3.1

- Fix scrollbars not being accounted for when using `layoutMaxWidth` and `layoutMaxHeight`

## 1.3.0

- Added the `<Radios>` component
- Added the `<Checkboxes>` component
- Added `multiple` support to `<Select>` component

## 1.2.2

- Fix using mapOption combined with setting the value using the option identity did not work.

## 1.2.1

- Fix disabled and read-only could still open the combo-box

## 1.2.0

- Disable the clear button if the combo-box is disabled or read-only

## 1.1.0

- Added `property` option to highlighters
- Adding highlighters examples

## 1.0.0

- Remove bold from highlight style

## 1.0.0-rc.22

- Fix layoutColumnsAlignLeft wrapping

## 1.0.0-rc.21

- Fix layoutColumnsAlignLeft wrapping in Microsoft Edge

## 1.0.0-rc.20

- Fix useAsyncSearch should return undefined when catching errors

## 1.0.0-rc.19

- fix accessible labels are not separated from value with a space
- do not read accessible column header if the column is empty
- allow custom cell classes in columns
- added tabBetweenOptions
- switched to ARIA 1.0
- redo layout handlers

## 1.0.0-rc.18

- added the selectOnBlur option to combo box

## 1.0.0-rc.17

- settings options to undefined on a combo-box suppresses the not found message

## 1.0.0-rc.16

- changed highlight methods to return a render function
- export highlighters
- swapped order of the returned values for useConfineListBox
- simplified useAsyncSearch

## 1.0.0-rc.15

- Update focus and contrast styles
- Added `classPrefix` property and restructured classes
- `<ListBoxTable>` is refactored into `ComboBoxTable` and `DropDownTable` components
- Customization
  - Customization now uses render functions
  - Removed `context` as it is no longer required
  - Removed `useConfineListBoxTable` is it is no longer required
- Highlighters
  - Highlighters are now render functions
  - `<PreHighlighter>` renamed to `delimitedHighlight`
- Searchers
  - useSearch is now useAsyncSearch and has a different signature
  - useTokenSearch and useAsyncSearch have a different signature
- Combo box
  - onChange is no longer called when selecting a value
