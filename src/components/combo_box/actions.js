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

function setFocusedOption({ focusedOption, focusListBox, autoselect, expanded, selectionStart }) {
  return {
    type: SET_FOCUSED_OPTION,
    focusedOption,
    focusListBox,
    autoselect,
    expanded,
    selectionStart,
  };
}

function onSelectValue(newValue, expanded = false) {
  return (dispatch, getState, getProps) => {
    const { onValue, inputRef } = getProps();
    dispatch({ type: SET_CLOSED, expanded });
    if (newValue?.unselectable) {
      return;
    }
    const { current: input } = inputRef;
    input.value = newValue?.label ?? '';
    input.dispatchEvent(new Event('click', { bubbles: true }));
    if (document.activeElement === input) {
      input.setSelectionRange(input.value.length, input.value.length, 'forward');
    }
    onValue?.(newValue ? newValue.value : null);
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusListBox, focusedOption, suggestedOption } = getState();
    const { options, inputRef, managedFocus, lastKeyRef, skipOption: skip } = getProps();
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

    if (managedFocus
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
          dispatch({ type: SET_CLOSED });
          inputRef.current.focus();
        } else if (expanded) {
          dispatch(setFocusedOption({
            focusedOption: previousInList(options, index, { skip, allowEmpty: true }),
            focusListBox: true,
          }));
        } else {
          dispatch({ type: SET_EXPANDED });
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setFocusedOption({
            focusedOption: nextInList(options, index, { skip, allowEmpty: true }),
            focusListBox: true,
          }));
        } else {
          dispatch({ type: SET_EXPANDED });
        }
        break;
      case 'Home':
        // First item
        if (expanded && isMac()) {
          event.preventDefault();
          dispatch(setFocusedOption({
            focusedOption: nextInList(options, -1, { skip }),
            focusListBox: true,
          }));
        }
        break;
      case 'End':
        // Last item
        if (expanded && isMac()) {
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
        const { tabAutocomplete, value } = getProps();
        if (tabAutocomplete && suggestedOption && expanded && !focusListBox
          && suggestedOption.identity !== value?.identity
          && !shiftKey && !altKey && !ctrlKey && !metaKey
        ) {
          event.preventDefault();
          dispatch(onSelectValue(suggestedOption));
        }
        break;
      }
      default:
    }
  };
}

export function onChange(event) {
  return (dispatch, getState, getProps) => {
    const { focusedOption } = getState();
    const { onChange: passedOnChange, value } = getProps();
    const { target: { value: search, selectionStart } } = event;
    dispatch({ type: SET_SEARCH, search, autoselect: true, selectionStart });
    if (!search && (focusedOption || value)) {
      dispatch(onSelectValue(null, true));
      return;
    }
    passedOnChange?.(event);
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { selectedOption, expandOnFocus } = getProps();
    dispatch(setFocusedOption({
      focusedOption: selectedOption,
      expanded: expandOnFocus,
      focusListBox: false,
    }));
  };
}

export function onFocusInput() {
  return { type: SET_FOCUS_LIST_BOX, focusListBox: false };
}

export function onInputMouseUp(e) {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded || e.button > 0) {
      return;
    }
    const { selectedOption, expandOnFocus } = getProps();
    dispatch(setFocusedOption({ focusedOption: selectedOption, expanded: expandOnFocus }));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { focusedOption } = getState();
    const { value, selectOnBlur } = getProps();

    if (selectOnBlur && focusedOption && value?.identify !== focusedOption?.identity) {
      dispatch(onSelectValue(focusedOption));
      return;
    }

    dispatch({ type: SET_CLOSED });
  };
}

export function onClick(event, option) {
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
    const { expandOnFocus } = getProps();
    dispatch(onSelectValue(null, expandOnFocus));
  };
}

export function onOptionsChanged() {
  return (dispatch, getState, getProps) => {
    const { focusedOption, expanded } = getState();
    if (!expanded) {
      return;
    }
    const { options, inputRef } = getProps();
    const newOption = options.find((o) => o.identity === focusedOption?.identity);

    dispatch(setFocusedOption({
      focusedOption: newOption,
      autoselect: true,
      selectionStart: inputRef.current.selectionStart,
    }));
  };
}

export function onValueChanged() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (!expanded) {
      return;
    }
    const { options, value } = getProps();

    dispatch(setFocusedOption({
      focusedOption: options.find((o) => o.identity === value?.identity) || null,
    }));
  };
}
