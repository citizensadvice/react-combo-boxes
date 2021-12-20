import { useCallback, useEffect, useLayoutEffect, useRef, useMemo, useState } from 'react';
import { useNormalisedOptions } from './use_normalised_options';
import { useOnBlur } from './use_on_blur';
import { useMounted } from './use_mounted';
import { initialState } from '../components/combo_box/initial_state';
import { reducer } from '../components/combo_box/reducer';
import { useCombineRefs } from './use_combine_refs';
import {
  onKeyDown, onChange, onFocus, onInputMouseUp, onClearValue, onBlur,
  onClickOption, onOptionsChanged, onValueChanged, onFocusInput, onFocusOption,
  setFocusedOption, onSelectValue, setExpanded, setClosed,
} from '../components/combo_box/actions';
import { useThunkReducer as useReducer } from './use_thunk_reducer';
import { makeBEMClass } from '../helpers/make_bem_class';
import { rNonPrintableKey } from '../constants/r_non_printable_key';
import { joinTokens } from '../helpers/join_tokens';
import { findOption as defaultFindOption } from '../helpers/find_option';
import { scrollIntoView } from '../layout/scroll_into_view';

function preventDefault(e) {
  e.preventDefault();
}

function defaultOnLayoutFocusedOption({ option }) {
  return scrollIntoView(option);
}

export function useComboBox(rawProps) {
  const props = Object.freeze({
    ...rawProps,
    ...useNormalisedOptions(rawProps),
  });

  const {
    'aria-labelledby': ariaLabelledBy,
    id,
    options,
    value,
    onBlur: passedOnBlur,
    onFocus: passedOnFocus,
    onLayoutListBox,
    onLayoutFocusedOption = defaultOnLayoutFocusedOption,
    onSearch,
    selectedOption,
    managedFocus,
    tabBetweenOptions,
    ref,
    className,
    classPrefix,
    disabled,
    readOnly,
    findOption = defaultFindOption,
    skipOption,
    selectOnBlur,
    expandOnHover,
    mouseleaveTimeout = 500,
    mouseenterTimeout = 100,
    editable,
  } = props;

  const wrapperRef = useRef();
  const inputRef = useRef();
  const listboxRef = useRef();
  const mounted = useMounted();
  const focusedRef = useRef();
  const lastKeyRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...props, inputRef, lastKeyRef, wrapperRef, listboxRef, focusedRef },
    initialState,
  );

  const { expanded, search, focusedOption, focusListBox } = state;

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

  const searchValue = (search ?? value?.label) || '';
  useEffect(() => {
    if (!mounted) {
      return;
    }
    if (onSearch) {
      onSearch(searchValue);
    }
    // Prevent infinite loop - onSearch can update with each render
  }, [searchValue, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Do not show the list box is the only option is the currently selected option
  const showListBox = useMemo(() => (
    expanded && !!options.length
      && !(options.length === 1
        && options[0].identity === selectedOption?.identity
        && options[0].label === (search ?? value?.label)
      )
  ), [expanded, options, selectedOption, search, value]);

  useLayoutEffect(() => {
    if (!onLayoutListBox) {
      return;
    }
    onLayoutListBox({
      expanded: showListBox,
      listbox: listboxRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showListBox, options]);

  useLayoutEffect(() => {
    if (showListBox && focusedRef.current && onLayoutFocusedOption) {
      onLayoutFocusedOption({ option: focusedRef.current, listbox: listboxRef.current });
    }
    if (focusedOption && focusListBox && showListBox) {
      if (managedFocus) {
        focusedRef.current?.focus();
      }
    } else if (expanded && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, managedFocus, focusedOption, focusListBox, showListBox]);

  const [prefixSearch, setPrefixSearch] = useState('');
  useEffect(() => {
    if (editable || !prefixSearch.trim() || !options?.length || !findOption) {
      return undefined;
    }

    const timeout = setTimeout(() => setPrefixSearch(''), 1000);

    if (options?.length && findOption && !disabled) {
      const found = options.find((o) => findOption(o, prefixSearch) && !skipOption?.(o));
      if (found) {
        if (expanded) {
          dispatch(setFocusedOption({ focusedOption: found }));
        } else if (selectOnBlur) {
          dispatch(onSelectValue(found));
        }
      }
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefixSearch]);

  const handleWrapperKeyDown = useCallback((event) => {
    const { key, altKey, ctrlKey, metaKey } = event;

    if (altKey || ctrlKey || metaKey) {
      return;
    }

    if (!expanded && (key === ' ' || key === 'Enter')) {
      dispatch(setExpanded());
      event.preventDefault();
      return;
    }

    if (!rNonPrintableKey.test(key)) {
      setPrefixSearch((v) => `${v}${key}`);
      event.preventDefault();
    }
  }, [dispatch, expanded]);

  const handleButtonClick = useCallback((e) => {
    if (e.button > 0 || disabled) {
      return;
    }
    if (expanded) {
      dispatch(setClosed());
    } else {
      dispatch(setExpanded());
    }
  }, [expanded, disabled, dispatch]);

  const mouseenterRef = useRef();
  const mouseleaveRef = useRef();

  const onMouseEnter = useCallback((e) => {
    if (e.defaultPrevented) {
      return;
    }
    clearTimeout(mouseleaveRef.current);
    clearTimeout(mouseenterRef.current);
    mouseenterRef.current = setTimeout(() => dispatch(setExpanded()), mouseenterTimeout);
  }, [mouseenterTimeout]);

  const onMouseMove = useCallback(() => {
    if (mouseenterRef.current) {
      clearTimeout(mouseenterRef.current);
      mouseenterRef.current = setTimeout(() => dispatch(setExpanded()), mouseenterTimeout);
    }
  }, [mouseenterTimeout]);

  const onMouseLeave = useCallback((e) => {
    if (e.defaultPrevented) {
      return;
    }
    clearTimeout(mouseenterRef.current);
    clearTimeout(mouseleaveRef.current);
    mouseleaveRef.current = setTimeout(() => dispatch(setClosed()), mouseleaveTimeout);
  }, [mouseleaveTimeout]);

  useEffect(() => () => {
    clearTimeout(mouseleaveRef.current);
    clearTimeout(mouseenterRef.current);
  }, [expanded, focusedOption]);

  const handleClickOption = useCallback((e, option) => dispatch(onClickOption(e, option)), []);
  const handleFocusOption = useCallback((e, option) => dispatch(onFocusOption(option)), []);
  const handleClearValue = useCallback((e) => dispatch(onClearValue(e)), []);
  const handleKeyDown = useCallback((e) => dispatch(onKeyDown(e)), []);
  const handleChange = useCallback((e) => dispatch(onChange(e)), []);
  const handleInputMouseUp = useCallback((e) => dispatch(onInputMouseUp(e)), []);
  const handleInputFocus = useCallback((e) => dispatch(onFocusInput(e)), []);

  const combinedInputRef = useCombineRefs(inputRef, ref);

  const optionsWithProps = useMemo(
    () => options.map((option) => {
      const { key, html, disabled: optionDisabled } = option;
      const selected = focusedOption?.key === key;

      return {
        ...option,
        selected,
        props: {
          id: key,
          key,
          role: 'option',
          tabIndex: tabBetweenOptions && managedFocus ? 0 : -1,
          'aria-selected': selected ? 'true' : null,
          'aria-disabled': optionDisabled ? 'true' : null,
          ref: selected ? focusedRef : null,
          className: makeBEMClass(classPrefix, 'option'),
          ...html,
          onClick: optionDisabled ? null : (e) => handleClickOption(e, option),
          onFocus: (e) => handleFocusOption(e, option),
        },
      };
    }),
    [
      options,
      focusedOption,
      handleClickOption,
      handleFocusOption,
      managedFocus,
      tabBetweenOptions,
      classPrefix,
    ],
  );

  return {
    wrapperProps: {
      ref: wrapperRef,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: editable ? null : handleWrapperKeyDown,
      onMouseEnter: expandOnHover ? onMouseEnter : null,
      onMouseLeave: expandOnHover ? onMouseLeave : null,
      onMouseMove: expandOnHover ? onMouseMove : null,
      className: className || makeBEMClass(classPrefix),
    },
    inputProps: {
      ref: combinedInputRef,
      id,
      onKeyDown: handleKeyDown,
      onChange: handleChange,
      onMouseUp: handleInputMouseUp,
      onFocus: handleInputFocus,
      onClick: editable ? null : handleButtonClick,
      tabIndex: managedFocus && showListBox && focusListBox && !tabBetweenOptions ? -1 : null,
      'aria-expanded': showListBox ? 'true' : 'false',
      'aria-activedescendant': (showListBox && focusListBox && focusedOption?.key) || null,
      'aria-owns': `${id}_listbox`,
      'aria-labelledby': joinTokens(ariaLabelledBy),
      role: 'combobox',
      className: makeBEMClass(classPrefix, 'input'),
    },
    listBoxProps: {
      ref: listboxRef,
      onMouseDown: preventDefault,
      id: `${id}_listbox`,
      tabIndex: -1,
      hidden: !showListBox,
      'aria-labelledby': joinTokens(ariaLabelledBy),
      'aria-activedescendant': (showListBox && focusListBox && focusedOption?.key) || null,
      onKeyDown: handleKeyDown,
      role: 'listbox',
      className: makeBEMClass(classPrefix, 'listbox'),
    },
    clearButtonProps: {
      role: 'button',
      onClick: handleClearValue,
      onKeyDown: handleClearValue,
      className: makeBEMClass(classPrefix, 'clear-button'),
      hidden: disabled || readOnly || !value || search === '',
      tabIndex: -1,
    },
    state: Object.freeze({
      ...state,
      showListBox,
    }),
    props: Object.freeze({
      ...props,
      options: optionsWithProps,
    }),
    dispatch,
  };
}
