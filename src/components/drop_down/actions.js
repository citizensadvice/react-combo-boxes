import { nextInList } from '../../helpers/next_in_list';
import { previousInList } from '../../helpers/previous_in_list';
import { rNonPrintableKey } from '../../constants/r_non_printable_key';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_SELECTED = 'SET_SELECTED';
export const SET_FOCUSED_OPTION = 'SET_FOCUSED_OPTION';

export function clearSearch() {
  return { type: CLEAR_SEARCH };
}

export function setFocusedOption(focusedOption, expanded) {
  return { type: SET_FOCUSED_OPTION, focusedOption, expanded };
}

export function onSelectValue(newValue) {
  return (dispatch, getState, getProps) => {
    const { onValue } = getProps();
    if (!newValue || newValue.unselectable) {
      dispatch({ type: SET_EXPANDED, expanded: false });
      return;
    }
    dispatch({ type: SET_SELECTED });
    onValue?.(newValue?.value);
  };
}

export function onToggleOpen(event) {
  return (dispatch, getState, getProps) => {
    const { disabled, options } = getProps();
    if (event?.button > 0 || disabled) {
      return;
    }
    if (!options.length) {
      event.preventDefault();
      return;
    }
    const { expanded } = getState();
    const { selectedOption } = getProps();
    if (expanded) {
      dispatch({ type: SET_EXPANDED, expanded: false });
    } else {
      dispatch(setFocusedOption(selectedOption, true));
    }
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedOption } = getState();
    const { disabled, options, comboBoxRef, skipOption: skip, selectedOption } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (disabled || !options.length) {
      event.preventDefault();
      return;
    }

    if (!expanded && (key === 'Enter' || key === ' ')) {
      event.preventDefault();
      dispatch(onToggleOpen());
      return;
    }

    const index = focusedOption ? focusedOption.index : -1;

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          if (expanded) {
            dispatch(onSelectValue(focusedOption));
            comboBoxRef.current.focus();
          }
        } else if (!expanded) {
          dispatch(setFocusedOption(selectedOption, true));
        } else {
          dispatch(setFocusedOption(previousInList(options, index, { skip })));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setFocusedOption(nextInList(options, index, { skip })));
        } else if (!expanded) {
          dispatch(setFocusedOption(selectedOption, true));
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedOption(nextInList(options, -1, { skip })));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedOption(previousInList(options, -1, { skip })));
        }
        break;
      case 'Escape':
      case 'Enter':
      case 'Tab':
        // Select current item if one is selected
        if (expanded) {
          event.preventDefault();
          if (focusedOption?.unselectable) {
            if (key !== 'Enter') {
              dispatch({ type: SET_EXPANDED, expanded: false });
              comboBoxRef.current.focus();
            }
            return;
          }
          dispatch(onSelectValue(focusedOption));
          comboBoxRef.current.focus();
        }
        break;
      default:
        if (!rNonPrintableKey.test(key) && !altKey && !ctrlKey && !metaKey) {
          event.preventDefault();
          dispatch({ type: SET_SEARCH_KEY, key });
        }
    }
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }
    const { selectedOption } = getProps();
    dispatch(setFocusedOption(selectedOption));
  };
}

export function onBlur() {
  return (dispatch, getState) => {
    const { focusedOption, expanded } = getState();
    if (expanded) {
      dispatch(onSelectValue(focusedOption));
    }
  };
}

export function onClick(event, option) {
  return (dispatch, getState, getProps) => {
    if (event.button > 0) {
      return;
    }

    const { comboBoxRef } = getProps();
    dispatch(onSelectValue(option));
    comboBoxRef.current.focus();
  };
}

export function onOptionsChanged() {
  return (dispatch, getState, getProps) => {
    const { focusedOption, expanded } = getState();
    if (!expanded || !focusedOption) {
      return;
    }
    const { options } = getProps();
    dispatch(setFocusedOption(
      options.find((o) => o.identity === focusedOption.identity) || options[0],
    ));
  };
}

export function onValueChanged() {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedOption } = getState();
    if (!expanded) {
      return;
    }
    const { options, value } = getProps();

    dispatch(setFocusedOption(
      options.find((o) => o.identity === value?.identity) || focusedOption,
    ));
  };
}
