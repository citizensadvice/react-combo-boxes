import { nextInList } from '../../helpers/next_in_list';
import { previousInList } from '../../helpers/previous_in_list';
import { rNonPrintableKey } from '../../constants/r_non_printable_key';
import { isMac } from '../../sniffers/is_mac';
import { getKey } from '../../helpers/get_key';
import { movePage } from '../../helpers/move_page';

export const SET_SEARCH = 'SET_SEARCH';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_CLOSED = 'SET_CLOSED';
export const SET_FOCUSED_OPTION = 'SET_FOCUSED_OPTION';
export const SET_FOCUS_LIST_BOX = 'SET_FOCUS_LIST_BOX';

function findSuggestedOption({ options, findSuggestion, search }) {
  if (!options || !findSuggestion || !search) {
    return null;
  }
  for (const option of options) {
    const result = findSuggestion(option, search);
    if (result) {
      return option;
    }
    if (result === false) {
      return null;
    }
  }
  return null;
}

export function setExpanded() {
  return (dispatch, _, getProps) => {
    const { selectedOption } = getProps();
    dispatch({ type: SET_EXPANDED, selectedOption });
  };
}

export function setFocusedOption({
  focusedOption,
  focusListBox,
  autoselect,
  expanded,
  selectionStart,
  suggestedOption,
}) {
  return {
    type: SET_FOCUSED_OPTION,
    focusedOption,
    focusListBox,
    autoselect,
    expanded,
    selectionStart,
    suggestedOption,
  };
}

export function onSelectValue(newValue, expanded) {
  return (dispatch, getState, getProps) => {
    const { onValue, inputRef, closeOnSelect } = getProps();
    const expand = expanded === undefined ? !closeOnSelect : expanded;
    dispatch({ type: SET_CLOSED, expanded: expand });
    if (newValue?.unselectable) {
      return;
    }
    const { current: input } = inputRef;
    input.value = newValue?.label ?? '';
    if (document.activeElement === input && input.setSelectionRange) {
      input.setSelectionRange(input.value.length, input.value.length, 'forward');
    }
    onValue?.(newValue ? newValue.value : null);
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusListBox, focusedOption, suggestedOption } = getState();
    const {
      options, inputRef, lastKeyRef, skipOption: skip,
      selectOnly, disabled, readOnly,
    } = getProps();

    if (disabled || readOnly) {
      return;
    }

    const { altKey, metaKey, ctrlKey, shiftKey } = event;
    const key = getKey(event);

    // Navigation keyboard shortcuts reference
    //
    // All:
    //   Left / Right = move cursor
    //   Backspace = delete last character
    //   Delete = delete next character
    // Mac:
    //   Ctrl + h = Backspace
    //   Cmd + Backspace = Backspace to the start of line
    //   Alt + Backspace = Backspace to the start of line
    //   Ctrl + d = Delete
    //   Ctrl + k = Delete to end of line
    //   Alt + Delete = Delete last word
    //   Alt + left / right = move cursor to start / end current or previous / next word
    //   Cmd + left / right = move cursor to start / end of line
    // Windows:
    //   Ctrl + Backspace = Backspace to the start of line
    //   Home / End = move cursor to start / end of line
    //   Ctrl + left / right = move cursor to start / end current or previous / next word
    // Linux:
    //   Home / End = move cursor to start / end of line
    //   Ctrl + Delete = Delete next word
    //   Ctrl + Backspace = Delete previous word
    //   Alt + left / right = move cursor to start / end current or previous / next word

    lastKeyRef.current = key;

    if (key === 'Delete') {
      dispatch({ type: SET_FOCUSED_OPTION, focusedOption: null });
    }

    if (event.target !== inputRef.current
      && !selectOnly
      && focusListBox
      && (
        ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(key)
        || !rNonPrintableKey.test(key)
        || (!isMac() && ['Home', 'End'].includes(key))
      )) {
      // If the user is manipulating text or moving the cursor
      // return focus to the input
      // Mostly this works, but sadly it doesn't work with composition events (Dead key)
      dispatch({ type: SET_FOCUS_LIST_BOX, focusListBox: false });
      inputRef.current.focus();
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch({ type: SET_CLOSED });
      inputRef.current.focus();
      return;
    }

    const index = focusedOption ? focusedOption.index : -1;

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          if (selectOnly) {
            dispatch(onSelectValue(focusedOption));
          } else {
            dispatch({ type: SET_CLOSED });
          }
          inputRef.current.focus();
        } else if (expanded) {
          dispatch(setFocusedOption({
            focusedOption: previousInList(options, index, { skip, allowEmpty: !selectOnly }),
            focusListBox: true,
          }));
        } else {
          dispatch(setExpanded());
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setFocusedOption({
            focusedOption: nextInList(options, index, { skip, allowEmpty: !selectOnly }),
            focusListBox: true,
          }));
        } else {
          dispatch(setExpanded());
        }
        break;
      case 'Home':
        // First item - on Windows on an editable combo box Home moves the cursor to the start
        if (expanded && (isMac() || selectOnly)) {
          event.preventDefault();
          dispatch(setFocusedOption({
            focusedOption: nextInList(options, -1, { skip }),
            focusListBox: true,
          }));
        }
        break;
      case 'End':
        // Last item - on Windows on an editable combo box End moves the cursor to the end
        if (expanded && (isMac() || selectOnly)) {
          event.preventDefault();
          dispatch(setFocusedOption({
            focusedOption: previousInList(options, -1, { skip }),
            focusListBox: true,
          }));
        }
        break;
      case 'PageDown':
        // Next page of items
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedOption({
            focusedOption: movePage('down', options, focusedOption, { skip }),
            focusListBox: true,
          }));
        }
        break;
      case 'PageUp':
        // Next page of items
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedOption({
            focusedOption: movePage('up', options, focusedOption, { skip }),
            focusListBox: true,
          }));
        }
        break;
      case 'Enter':
        // Select current item if one is selected
        if (!expanded) {
          if (selectOnly) {
            dispatch(setExpanded());
          }
          break;
        }
        event.preventDefault();
        if (focusedOption && !focusedOption?.unselectable) {
          dispatch(onSelectValue(focusedOption));
          if (document.activeElement !== inputRef.current) {
            // Mac Firefox still needs the focus reset even without managedFocus
            inputRef.current.focus();
          }
        }
        break;
      case 'Tab': {
        const { tabBetweenOptions, tabAutocomplete, value } = getProps();
        if (tabAutocomplete && suggestedOption && expanded && !focusListBox
          && suggestedOption.identity !== value?.identity
          && !shiftKey && !altKey && !ctrlKey && !metaKey
        ) {
          event.preventDefault();
          dispatch(onSelectValue(suggestedOption));
          break;
        }

        if (tabBetweenOptions && event.target === inputRef.current && expanded) {
          let option;
          if (shiftKey) {
            if (index === -1) {
              break;
            }
            option = previousInList(options, index, { skip, allowEmpty: !selectOnly });
          } else {
            option = nextInList(options, index, { skip, allowEmpty: !selectOnly });
          }
          if (option || shiftKey) {
            dispatch(setFocusedOption({
              focusedOption: option,
              focusListBox: true,
            }));
            event.preventDefault();
          }
          break;
        }

        // Native select uses tab to select an option
        if (expanded && selectOnly) {
          event.preventDefault();
          if (focusedOption && !focusedOption?.unselectable) {
            dispatch(onSelectValue(focusedOption));
          } else {
            dispatch({ type: SET_CLOSED });
          }
          inputRef.current.focus();
        }
        break;
      }
      default:
    }
  };
}

export function onChange(event) {
  return (dispatch, getState, getProps) => {
    const { inlineAutoselect, focusListBox, focusedOption } = getState();
    const {
      autoselect,
      onChange: passedOnChange,
      value,
      lastKeyRef: { current: key },
      selectedOption,
      options,
      findSuggestion,
    } = getProps();
    const { target: { selectionStart } } = event;
    let { target: { value: search } } = event;

    // let setInlineAutoselect = false;
    // // If the selection length equals the search length trigger the display of an autocomplete
    // if (autoselect === 'inline' && focusListBox && search && selectionStart === search.length) {
    //   setInlineAutoselect = true;
    // }

    // if (inlineAutoselect) {
    //   // If backspace was pressed we also want to remove an extra character
    //   if (key === 'Backspace') {
    //     search = search.slice(0, -1);
    //     setInlineAutoselect = false;
    //   }
    //   // If delete was pressed, remove the autoselected option
    //   if (key === 'Delete') {
    //     setInlineAutoselect = false;
    //   }
    // }

    // Send onSearch

    const suggestedOption = findSuggestedOption({ options, findSuggestion, search });

    dispatch({
      type: SET_SEARCH,
      search,
      autoselect: true,
      selectionStart,
      selectedOption,
      suggestedOption,
    });
    if (!search && (focusedOption || value)) {
      dispatch(onSelectValue(null, true));
      return;
    }
    passedOnChange?.(event);
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { selectedOption, expandOnFocus, disabled, readOnly } = getProps();

    if (disabled || readOnly) {
      return;
    }

    dispatch(setFocusedOption({
      focusedOption: selectedOption,
      expanded: expandOnFocus,
      focusListBox: false,
    }));
  };
}

export function onFocusInput() {
  return (dispatch, getState, getProps) => {
    const { disabled, readOnly } = getProps();

    if (disabled || readOnly) {
      return;
    }

    dispatch({ type: SET_FOCUS_LIST_BOX, focusListBox: false });
  };
}

export function onFocusOption(option) {
  return (dispatch, getState) => {
    const { focusedOption, expanded } = getState();

    if (!expanded || focusedOption.identity === option.identity) {
      return;
    }

    dispatch(setFocusedOption({ focusedOption: option, focusListBox: true }));
  };
}

export function onInputMouseUp(e) {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded || e.button > 0) {
      return;
    }

    const { selectedOption, expandOnFocus, disabled, readOnly } = getProps();

    if (disabled || readOnly) {
      return;
    }

    dispatch(setFocusedOption({ focusedOption: selectedOption, expanded: expandOnFocus }));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedOption } = getState();
    const { value, selectOnBlur, tabBetweenOptions, disabled, readOnly } = getProps();

    if (disabled || readOnly) {
      return;
    }

    if (selectOnBlur
      && expanded
      && !tabBetweenOptions
      && focusedOption
      && value?.identity !== focusedOption?.identity
    ) {
      dispatch(onSelectValue(focusedOption));
      return;
    }

    dispatch({ type: SET_CLOSED });
  };
}

export function onClickOption(event, option) {
  return (dispatch, getState, getProps) => {
    if (event.button > 0) {
      return;
    }

    const { inputRef } = getProps();
    dispatch(onSelectValue(option));
    inputRef.current.focus();
  };
}

export function onClearValue(event) {
  return (dispatch, setState, getProps) => {
    if (event.type === 'click' && event.button > 0) {
      return;
    }
    if (event.type === 'keydown' && ![' ', 'Enter'].includes(event.key)) {
      return;
    }
    const { expandOnFocus, disabled, readOnly } = getProps();
    if (disabled || readOnly) {
      return;
    }
    dispatch(onSelectValue(null, expandOnFocus));
  };
}

export function onOptionsChanged() {
  return (dispatch, getState, getProps) => {
    const { focusedOption, expanded, search } = getState();
    if (!expanded) {
      return;
    }
    const { options, inputRef, selectOnly, selectedOption, findSuggestion } = getProps();
    let newOption = options.find((o) => o.identity === focusedOption?.identity);
    if (selectOnly && !newOption) {
      newOption = selectedOption;
    }

    // TODO: If the selection length equals the search length trigger the display of an autocomplete

    const suggestedOption = findSuggestedOption({ options, findSuggestion, search });

    dispatch(setFocusedOption({
      focusedOption: newOption,
      autoselect: true,
      selectionStart: inputRef.current.selectionStart,
      suggestedOption,
    }));
  };
}

export function onValueChanged() {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedOption } = getState();
    if (!expanded) {
      return;
    }
    const { options, selectOnly, value } = getProps();

    let newOption = options.find((o) => o.identity === value?.identity) || null;
    if (selectOnly && !newOption) {
      newOption = focusedOption;
    }

    dispatch(setFocusedOption({
      focusedOption: newOption,
    }));
  };
}
