# Change log

## Unreleased

### Fixed

- Simplification of handling blurring to fix issues with the focus jumping back when tabbing from a combo-box
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
