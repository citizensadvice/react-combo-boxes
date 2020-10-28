export function initialState({ selectedOption }) {
  return {
    inlineAutoselect: false,
    expanded: false,
    focusListBox: false,
    search: null,
    focusedOption: selectedOption,
    suggestedOption: null,
    screenReaderMessage: null,
  };
}
