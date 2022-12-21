import { shallowEqualObjects } from 'shallow-equal';
import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_OPTION, SET_FOCUS_LIST_BOX } from './actions';

// TODO: move to actions
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

function reduce(state, { type, ...params }) {
  switch (type) {
    case SET_SEARCH: {
      const { search, selectedOption, suggestedOption } = params;
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
        suggestedOption: search ? suggestedOption : null,
      };
    }
    case SET_EXPANDED: {
      const { selectedOption } = params;

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
        focusListBox: paramFocusListBox,
        focusedOption,
        expanded,
        suggestedOption,
      } = params;
      const {
        search,
        focusListBox: stateFocusListBox,
      } = state;

      const focusListBox = (paramFocusListBox ?? stateFocusListBox) && !!focusedOption;

      return {
        ...state,
        expanded: expanded ?? true,
        focusListBox,
        focusedOption,
        suggestedOption: (search && !focusListBox) ? suggestedOption : null,
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
    applyAutoselect,
  ].reduce((currentState, fn) => fn(currentState, action, props), state);

  if (shallowEqualObjects(newState, state)) {
    return state;
  }

  return newState;
}
