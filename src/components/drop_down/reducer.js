import { shallowEqualObjects } from 'shallow-equal';
import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH, SET_FOCUSED_OPTION, SET_SELECTED } from './actions';

function reduce(state, { type, ...params }) {
  switch (type) {
    case SET_EXPANDED: {
      const { expanded } = params;
      return {
        ...state,
        expanded,
      };
    }
    case CLEAR_SEARCH:
      return {
        ...state,
        search: '',
      };
    case SET_SEARCH_KEY: {
      const { key } = params;
      return {
        ...state,
        search: (state.search || '') + key.toLowerCase(),
      };
    }
    case SET_SELECTED:
      return {
        ...state,
        expanded: false,
        focusedOption: null,
      };
    case SET_FOCUSED_OPTION: {
      const { focusedOption, expanded } = params;
      return {
        ...state,
        focusedOption,
        expanded: expanded === undefined ? state.expanded : expanded,
      };
    }
    /* istanbul ignore next */
    default:
      return state;
  }
}

export function reducer(state, action, props) {
  const newState = reduce(state, action, props);
  if (shallowEqualObjects(newState, state)) {
    return state;
  }
  return newState;
}
