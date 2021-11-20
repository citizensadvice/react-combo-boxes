import { useCallback, useLayoutEffect, useReducer, useRef } from 'react';
import { useNormalisedOptions } from './use_normalised_options';
import { useOnBlur } from './use_on_blur';
import { useMounted } from './use_mounted';
import { initialState } from '../components/combo_box/initial_state';
import { reducer } from '../components/combo_box/reducer';
import {
  onKeyDown, onChange, onFocus, onInputMouseUp, onClearValue, onBlur,
  onClickOption, onOptionsChanged, onValueChanged, onFocusInput, onFocusOption,
} from '../components/combo_box/actions';

export function useListBox(rawProps) {
  const props = Object.freeze({
    ...rawProps,
    ...useNormalisedOptions(rawProps, { mustHaveSelection: rawProps.selectOnly }),
  });

  const {
    options,
    value,
    onBlur: passedOnBlur,
    onFocus: passedOnFocus,
  } = props;

  const wrapperRef = useRef();
  const inputRef = useRef();
  const listboxRef = useRef();
  const mounted = useMounted();
  const lastKeyRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...props, inputRef, lastKeyRef },
    initialState,
  );

  const [handleBlur, handleFocus] = useOnBlur(
    wrapperRef,
    useCallback(() => {
      dispatch(onBlur());
      passedOnBlur?.();
    }, [passedOnBlur]),
    useCallback(() => {
      dispatch(onFocus());
      passedOnFocus?.();
    }, [passedOnFocus]),
  );

  const optionsCheck = options.length ? options : null;
  useLayoutEffect(() => {
    if (!mounted) {
      return;
    }
    dispatch(onOptionsChanged());
  }, [optionsCheck, mounted]);

  const valueIdentity = value?.identity;
  useLayoutEffect(() => {
    if (!mounted) {
      return;
    }
    dispatch(onValueChanged());
  }, [valueIdentity, mounted]);

  const handleClickOption = useCallback((e, option) => dispatch(onClickOption(e, option)), []);
  const handleFocusOption = useCallback((e, option) => dispatch(onFocusOption(option)), []);
  const handleClearValue = useCallback((e) => dispatch(onClearValue(e)), []);
  const handleKeyDown = useCallback((e) => dispatch(onKeyDown(e)), []);
  const handleChange = useCallback((e) => dispatch(onChange(e)), []);
  const handleInputMouseUp = useCallback((e) => dispatch(onInputMouseUp(e)), []);
  const handleInputFocus = useCallback((e) => dispatch(onFocusInput(e)), []);

  return {
    wrapperProps: {
      ref: wrapperRef,
      onBlur: handleBlur,
      onFocus: handleFocus,
    },
    inputProps: {
      ref: inputRef,
      onKeyDown: handleKeyDown,
      onChange: handleChange,
      onMouseUp: handleInputMouseUp,
      onFocus: handleInputFocus,
    },
    listboxProps: {
      ref: listboxRef,
      onSelectOption: handleClickOption,
      onFocusOption: handleFocusOption,
    },
    clearButtonProps: {
      onClick: handleClearValue,
      onKeyDown: handleClearValue,
    },
    state,
    props,
    dispatch,
  };
}
