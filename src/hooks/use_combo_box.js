import { useCallback, useEffect, useLayoutEffect, useRef, useMemo, useState } from 'react';
import { useNormalisedOptions } from './use_normalised_options';
import { useOnBlur } from './use_on_blur';
import { initialState } from '../components/combo_box/initial_state';
import { reducer } from '../components/combo_box/reducer';
import { useEvent } from './use_event';
import { useModified } from './use_modified';
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
import { visuallyHiddenClassName as defaultVisuallyHiddenClassName } from '../constants/visually_hidden_class_name';

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
    className,
    classPrefix,
    disabled,
    editable,
    findOption = defaultFindOption,
    id,
    managedFocus,
    onBlur: passedOnBlur,
    onFocus: passedOnFocus,
    onLayoutFocusedOption: _onLayoutFocusedOption = defaultOnLayoutFocusedOption,
    options,
    readOnly,
    ref,
    selectOnBlur,
    selectedOption,
    skipOption,
    tabBetweenOptions,
    value,
    visuallyHiddenClassName = defaultVisuallyHiddenClassName,
  } = props;

  const wrapperRef = useRef();
  const inputRef = useRef();
  const listboxRef = useRef();
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

  useModified(
    options.length ? options : null,
    () => {
      dispatch(onOptionsChanged());
    },
  );

  useModified(
    value?.identity,
    () => {
      dispatch(onValueChanged());
    },
  );

  // Do not show the list box if the only option is the currently selected option
  const showListBox = expanded
    && !!options.length
    && !(options.length === 1
      && options[0].identity === selectedOption?.identity
      && options[0].label === (search ?? value?.label)
    );

  const onLayoutFocusedOption = useEvent(() => {
    [].concat(_onLayoutFocusedOption).filter(Boolean).forEach((fn) => {
      fn({ option: focusedRef.current, listbox: listboxRef.current, input: inputRef.current });
    });
  });

  useLayoutEffect(
    () => {
      if (showListBox && onLayoutFocusedOption) {
        onLayoutFocusedOption();
      }
      if (focusedOption && focusListBox && showListBox) {
        if (managedFocus) {
          focusedRef.current?.focus();
        }
      } else if (expanded && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    },
    [
      expanded, managedFocus, focusedOption, focusListBox,
      showListBox, options, onLayoutFocusedOption,
    ],
  );

  const [prefixSearch, setPrefixSearch] = useState('');

  const setFirstFoundOption = useEvent((s) => {
    if (editable || !s.trim() || !options?.length || !findOption) {
      return;
    }
    if (options?.length && findOption && !disabled) {
      const found = options.find((o) => findOption(o, s) && !skipOption?.(o));
      if (found) {
        if (expanded) {
          dispatch(setFocusedOption(found));
        } else if (selectOnBlur) {
          dispatch(onSelectValue(found));
        }
      }
    }
  });

  // If the search changes update the option
  useEffect(() => {
    const timeout = setTimeout(() => setPrefixSearch(''), 1000);
    setFirstFoundOption(prefixSearch);
    return () => clearTimeout(timeout);
  }, [prefixSearch, setFirstFoundOption]);

  const handleWrapperKey = useCallback((event) => {
    const { key, altKey, ctrlKey, metaKey, type } = event;

    if (altKey || ctrlKey || metaKey) {
      return;
    }

    if (!expanded && ((type === 'keyup' && key === ' ') || (type === 'keydown' && key === 'Enter'))) {
      dispatch(setExpanded());
      event.preventDefault();
      return;
    }

    if (type === 'keyup') {
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

  const handleClickOption = useCallback((e, option) => dispatch(onClickOption(e, option)), []);
  const handleFocusOption = useCallback((_, option) => dispatch(onFocusOption(option)), []);
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

  const context = useMemo(() => ({
    visuallyHiddenClassName,
    dispatch,
  }), [dispatch, visuallyHiddenClassName]);

  return {
    wrapperProps: {
      ref: wrapperRef,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: editable ? null : handleWrapperKey,
      onKeyUp: editable ? null : handleWrapperKey,
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
      'aria-label': 'Clear',
      'aria-labelledby': joinTokens(`${id}_clear_button`, ariaLabelledBy, id),
      className: makeBEMClass(classPrefix, 'clear-button'),
      hidden: disabled || readOnly || !value || search === '',
      id: `${id}_clear_button`,
      onClick: handleClearValue,
      onKeyDown: handleClearValue,
      onKeyUp: handleClearValue,
      role: 'button',
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
    context,
  };
}
