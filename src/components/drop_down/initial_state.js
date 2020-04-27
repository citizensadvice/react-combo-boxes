export function initialState({ selectedOption }) {
  return {
    expanded: false,
    search: '',
    focusedOption: selectedOption,
  };
}
