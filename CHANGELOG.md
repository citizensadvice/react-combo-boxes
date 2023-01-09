# Change log

## 2.0.0.alpha.x

### Changed

- Project is now built as es6 only
- (Breaking) `onLayoutListBox` now takes an array of handlers and `useLayoutListBox` is removed
- (Breaking) All `highlight…` methods have been replaced with `Highlight…` react components
- Substring highlight now highlights all matching parts
- Some optimisations to reduce renders
- All top level components are now wrapped in memo
- The listbox will now scroll to the top if options change and no option is focused
- `layoutMaxHeight` will not move the list-box above the combo-box if there is room below.

### Added

- Added a `userEvent` option to `selectComboBoxOption`.  This is required for the user-event v14 and fixes some unstable behaviour.
- Added `closeOnEnter` option

### Fixed

- React 18 support
- Fixed some unnecessary state updates when selecting options
- Fix label is set to `undefined` if option is supplied with no label
- Fix useAsyncSearch not setting options to `null`
- Fix focused option not scrolling into view in some circumstances
- Add missing fixes from 1.x
  - Fix the highlighter helpers not being exported
  - Fix layoutColumnsAlignLeft not aligning columns where there are groups and no table header
  - Fix layoutMaxHeight and layoutMaxWidth should use the window height if contain does not resolve to an element

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
