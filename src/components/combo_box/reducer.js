import { shallowEqualObjects } from 'shallow-equal';
import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_OPTION, SET_FOCUS_LIST_BOX } from './actions';

function applyAutoselect(state, { setAutoselect, setInlineAutoselect }) {
  const { focusListBox, suggestedOption } = state;

  if (focusListBox || (!setAutoselect && !setInlineAutoselect) || !suggestedOption) {
    return {
      ...state,
      inlineAutoselect: false,
    };
  }

  return {
    ...state,
    focusedOption: suggestedOption,
    inlineAutoselect: setInlineAutoselect,
  };
}

function reduce(state, { type, ...params }) {
  switch (type) {
    case SET_SEARCH: {
      const { focusedOption, search, suggestedOption } = params;
      return {
        ...state,
        search,
        focusedOption,
        expanded: true,
        focusListBox: false,
        suggestedOption,
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
        suggestedOption = null,
      } = params;

      const focusListBox = (paramFocusListBox ?? state.focusListBox) && !!focusedOption;

      return {
        ...state,
        expanded: expanded ?? true,
        focusListBox,
        focusedOption,
        suggestedOption: focusListBox ? null : suggestedOption,
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

export function reducer(state, action) {
  const newState = [
    reduce,
    applyAutoselect,
  ].reduce((currentState, fn) => fn(currentState, action), state);

  if (shallowEqualObjects(newState, state)) {
    return state;
  }

  return newState;
}
