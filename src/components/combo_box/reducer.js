import { shallowEqualObjects } from 'shallow-equal';
import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_OPTION, SET_FOCUS_LIST_BOX } from './actions';

// AT RISK: It is debatable autoselect in this form is actually useful
function applyAutoselect(state, { type, ...params }, props) {
  const { autoselect } = props;

  if (!autoselect) {
    return state;
  }

  switch (type) {
    case SET_FOCUSED_OPTION:
    case SET_SEARCH: {
      const { lastKeyRef: { current: key } } = props;
      const { focusListBox, search, inlineAutoselect, suggestedOption } = state;

      if (focusListBox || !search || !params.autoselect) {
        break;
      }

      if (type === SET_SEARCH && key === 'Backspace' && inlineAutoselect) {
        return {
          ...state,
          focusedOption: null,
          inlineAutoselect: false,
          search: search.slice(0, -1),
        };
      }

      if (key === 'Backspace' || key === 'Delete') {
        return {
          ...state,
          focusedOption: null,
          inlineAutoselect: false,
        };
      }

      if (!suggestedOption) {
        break;
      }

      return {
        ...state,
        focusedOption: suggestedOption,
        inlineAutoselect: autoselect === 'inline' && params.selectionStart === search.length,
      };
    }
    default:
  }

  return {
    ...state,
    inlineAutoselect: false,
  };
}

function applySuggestedOption(state, { type }, props) {
  switch (type) {
    case SET_FOCUSED_OPTION:
    case SET_SEARCH: {
      const { options, findSuggestion } = props;
      const { focusListBox, search } = state;

      if (!search || focusListBox) {
        return {
          ...state,
          suggestedOption: null,
        };
      }

      let suggestedOption = null;
      for (let i = 0; i < options.length; i += 1) {
        const result = findSuggestion(options[i], search);
        if (result) {
          suggestedOption = options[i];
          break;
        }
        if (result === false) {
          break;
        }
      }

      return {
        ...state,
        suggestedOption,
      };
    }
    default:
  }

  return state;
}

function reduce(state, { type, ...params }, props) {
  switch (type) {
    case SET_SEARCH: {
      const { search } = params;
      const { selectedOption } = props;
      let { focusedOption } = state;
      if (!search) {
        focusedOption = null;
      } else if (!state.expanded) {
        focusedOption = selectedOption;
      }
      return {
        ...state,
        search,
        focusedOption,
        expanded: true,
        focusListBox: false,
      };
    }
    case SET_EXPANDED: {
      const { selectedOption } = props;

      return {
        ...state,
        expanded: true,
        focusedOption: selectedOption,
        focusListBox: true,
      };
    }
    case SET_CLOSED: {
      const { expanded } = params;

      return {
        ...state,
        expanded: !!expanded,
        focusedOption: null,
        focusListBox: false,
        search: null,
      };
    }
    case SET_FOCUSED_OPTION: {
      const {
        focusListBox,
        focusedOption,
        expanded,
      } = params;

      return {
        ...state,
        expanded: expanded ?? true,
        focusListBox: (focusListBox == null ? state.focusListBox : focusListBox) && focusedOption,
        focusedOption,
      };
    }
    case SET_FOCUS_LIST_BOX: {
      const {
        focusListBox,
      } = params;

      return {
        ...state,
        focusListBox,
      };
    }
    /* istanbul ignore next */
    default:
      return state;
  }
}

export function reducer(state, action, props) {
  const newState = [
    reduce,
    applySuggestedOption,
    applyAutoselect,
  ].reduce((currentState, fn) => fn(currentState, action, props), state);

  if (shallowEqualObjects(newState, state)) {
    return state;
  }

  return newState;
}
