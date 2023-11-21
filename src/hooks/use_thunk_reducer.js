import { useCallback, useRef, useReducer } from 'react';

/**
 * Like a redux thunk reducer
 *
 * If dispatch returns a method it is called with dispatch, getState, getProps
 *
 * @param {Function} reducer the reducer
 * @param {Object} props the props to pass to the thunk, and to initialise state
 * @param {Function} initialState method to generate the initial state
 */
export function useThunkReducer(reducer, props, initialState) {
  // Holds the latest props
  const propsRef = useRef(props);

  const propsReducer = (state, action) => {
    const newState = reducer(state, action, propsRef.current);
    return newState;
  };

  const [state, dispatch] = useReducer(propsReducer, props, initialState);

  // Holds the latest state
  const stateRef = useRef(state);

  stateRef.current = state;
  propsRef.current = props;

  // Special dispatch that will call a returned function with (dispatch, getState, getProps)
  const thunkDispatch = useCallback(
    (data) =>
      typeof data === 'function'
        ? data(
            thunkDispatch,
            () => stateRef.current,
            () => propsRef.current,
          )
        : dispatch(data),
    [],
  );

  return [state, thunkDispatch];
}
