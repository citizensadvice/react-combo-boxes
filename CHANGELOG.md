# Change log

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
