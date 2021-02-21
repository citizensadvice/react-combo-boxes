import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer';
import { reducer } from './combo_box/reducer';
import { initialState } from './combo_box/initial_state';
import {
  onKeyDown, onChange, onFocus, onInputMouseUp, onClearValue, onBlur,
  onClick, onOptionsChanged, onValueChanged, onFocusInput,
} from './combo_box/actions';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { useOnBlur } from '../hooks/use_on_blur';
import { useMounted } from '../hooks/use_mounted';
import { joinTokens } from '../helpers/join_tokens';
import { stringOrArray } from '../validators/string_or_array';
import { findOption } from '../helpers/find_option';
import { useCombineRefs } from '../hooks/use_combine_refs';
import { ListBox } from './list_box';
import { AriaLiveMessage } from './aria_live_message';
import { classPrefix } from '../constants/class_prefix';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';
import { isSafari } from '../sniffers/is_safari';
import { isMac } from '../sniffers/is_mac';
import { scrollIntoView as defaultScrollIntoView } from '../helpers/scroll_into_view';

function defaultFoundOptionsMessage(options) {
  return `${options.length} option${options.length > 1 ? 's' : ''} found`;
}

export const ComboBox = forwardRef(({ placeholder, ...rawProps }, ref) => {
  const optionisedProps = Object.freeze({ ...useNormalisedOptions(rawProps), placeholder });
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    autoselect,
    busy,
    busyDebounce,
    className,
    disabled,
    errorMessage,
    foundOptionsMessage,
    id,
    inputMode,
    managedFocus,
    maxLength,
    minLength,
    notFoundMessage,
    nullOptions,
    onBlur: passedOnBlur,
    onFocus: passedOnFocus,
    onLayoutListBox,
    onSearch,
    options,
    pattern,
    readOnly,
    renderClearButton,
    renderAriaDescription,
    renderDownArrow,
    renderInput,
    renderNotFound,
    renderErrorMessage,
    renderWrapper,
    required,
    scrollIntoView,
    selectedOption,
    showSelectedLabel,
    size,
    spellCheck,
    value,
    visuallyHiddenClassName: providedVisuallyHiddenClassName,
  } = optionisedProps;

  const comboRef = useRef();
  const inputRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();
  const lastKeyRef = useRef();
  const busyTimeoutRef = useRef();
  const mounted = useMounted();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, inputRef, lastKeyRef },
    initialState,
  );
  const [showBusy, setShowBusy] = useState(false);

  const {
    expanded, focusedOption, search,
    focusListBox, inlineAutoselect, suggestedOption,
  } = state;

  const [handleBlur, handleFocus] = useOnBlur(
    comboRef,
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

  const inputLabel = useMemo(() => {
    if (inlineAutoselect
      || (((showSelectedLabel && !focusedOption?.unselectable) ?? autoselect === 'inline') && focusListBox)
    ) {
      return focusedOption?.label;
    }
    return search ?? value?.label;
  }, [
    inlineAutoselect, showSelectedLabel, autoselect,
    focusListBox, focusedOption, search, value,
  ]);

  useLayoutEffect(() => {
    if (search && autoselect === 'inline' && inlineAutoselect && focusedOption && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(search.length, focusedOption.label.length, 'backwards');
    }
  }, [inlineAutoselect, focusedOption, search, autoselect]);

  const ariaAutocomplete = useMemo(() => {
    if (autoselect === 'inline') {
      if (!onSearch) {
        return 'inline';
      }
      return 'both';
    }
    if (!onSearch) {
      return 'none';
    }
    return 'list';
  }, [onSearch, autoselect]);

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
    expanded
      && !errorMessage
      && !!options.length
      && !(options.length === 1
        && options[0].identity === selectedOption?.identity
        && options[0].label === (search ?? value?.label)
      )
  ), [expanded, options, selectedOption, search, value, errorMessage]);

  useLayoutEffect(() => {
    if (showListBox && focusedRef.current) {
      scrollIntoView(focusedRef.current);
    }
    if (focusedOption && focusListBox && showListBox) {
      if (managedFocus) {
        focusedRef.current?.focus();
      }
    } else if (expanded && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded, managedFocus, focusedOption, focusListBox, showListBox, scrollIntoView]);

  useEffect(() => {
    if (busy && !busyDebounce) {
      setShowBusy(true);
    } else if (busy) {
      busyTimeoutRef.current = setTimeout(() => {
        setShowBusy(true);
      }, busyDebounce);
    } else {
      setShowBusy(false);
    }
    return () => {
      clearTimeout(busyTimeoutRef.current);
    };
  }, [busy, busyDebounce, busyTimeoutRef]);

  const lastExpandedRef = useRef(showListBox);
  useLayoutEffect(() => {
    if (!onLayoutListBox || (!showListBox && !lastExpandedRef.current)) {
      return;
    }
    lastExpandedRef.current = showListBox;
    onLayoutListBox({
      listbox: listRef.current,
      combobox: inputRef.current,
      expanded: showListBox,
    });
  }, [onLayoutListBox, showListBox, options]);

  const showNotFound = notFoundMessage
    && !busy
    && expanded
    && !options.length
    && !nullOptions
    && !errorMessage
    && search?.trim()
    && search !== value?.label;

  const ariaBusy = showBusy && search?.trim() && search !== (value?.label);
  const combinedRef = useCombineRefs(inputRef, ref);
  const componentState = Object.freeze({
    expanded: showListBox,
    notFound: showNotFound,
    currentOption: focusedOption,
    search,
    suggestedOption,
    'aria-busy': ariaBusy,
    'aria-autocomplete': ariaAutocomplete,
  });
  const clickOption = useCallback((e, option) => dispatch(onClick(e, option)), []);

  return renderWrapper({
    'aria-busy': ariaBusy ? 'true' : 'false',
    className,
    onBlur: handleBlur,
    onFocus: handleFocus,
    ref: comboRef,
    children: (
      <>
        {renderInput({
          id,
          className: `${classPrefix}combobox__input`,
          type: 'text',
          role: 'combobox',
          'aria-autocomplete': ariaAutocomplete,
          'aria-controls': `${id}_listbox`,
          'aria-expanded': showListBox ? 'true' : 'false',
          'aria-activedescendant': (showListBox && focusListBox && focusedOption?.key) || null,
          'aria-describedby': joinTokens(showNotFound && `${id}_not_found`, errorMessage && `${id}_error_message`, `${id}_aria_description`, ariaDescribedBy),
          'aria-labelledby': joinTokens(ariaLabelledBy),
          value: inputLabel || '',
          onKeyDown: (e) => dispatch(onKeyDown(e)),
          onChange: (e) => dispatch(onChange(e)),
          onMouseUp: (e) => dispatch(onInputMouseUp(e)),
          onFocus: (e) => dispatch(onFocusInput(e)),
          ref: combinedRef,
          tabIndex: managedFocus && showListBox && focusListBox ? -1 : null,
          'aria-invalid': ariaInvalid,
          autoCapitalize,
          autoComplete,
          autoCorrect,
          autoFocus,
          disabled,
          inputMode,
          maxLength,
          minLength,
          pattern,
          placeholder,
          readOnly,
          required,
          size,
          spellCheck,
        }, componentState, optionisedProps)}
        {renderDownArrow({
          id: `${id}_down_arrow`,
          className: `${classPrefix}combobox__down-arrow`,
          hidden: value || !options.length,
        }, componentState, optionisedProps)}
        {renderClearButton({
          id: `${id}_clear_button`,
          role: 'button',
          'aria-label': 'Clear',
          'aria-labelledby': joinTokens(`${id}_clear_button`, ariaLabelledBy, id),
          className: `${classPrefix}combobox__clear-button`,
          onClick: (e) => dispatch(onClearValue(e)),
          onKeyDown: (e) => dispatch(onClearValue(e)),
          hidden: !value || search === '',
          tabIndex: -1,
        }, componentState, optionisedProps)}
        <ListBox
          ref={listRef}
          id={`${id}_listbox`}
          tabIndex={-1}
          hidden={!showListBox}
          aria-activedescendant={(showListBox && focusListBox && focusedOption?.key) || null}
          aria-labelledby={joinTokens(ariaLabelledBy)}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onSelectOption={clickOption}
          focusedRef={focusedRef}
          componentProps={optionisedProps}
          componentState={componentState}
        />
        {foundOptionsMessage && renderAriaDescription({
          id: `${id}_aria_description`,
          className: providedVisuallyHiddenClassName,
          children: showListBox ? foundOptionsMessage(options) : null,
        }, componentState, optionisedProps)}
        {notFoundMessage && renderNotFound({
          id: `${id}_not_found`,
          className: `${classPrefix}combobox__not-found`,
          hidden: !showNotFound,
          children: showNotFound ? notFoundMessage : null,
        }, componentState, optionisedProps)}
        {errorMessage && renderErrorMessage({
          id: `${id}_error_message`,
          className: `${classPrefix}combobox__error-message`,
          hidden: !errorMessage,
          children: errorMessage,
        }, componentState, optionisedProps)}
        <AriaLiveMessage
          hidden={!showNotFound && !showListBox}
          componentProps={optionisedProps}
          componentState={componentState}
        />
      </>
    ),
  }, componentState, optionisedProps);
});

ComboBox.propTypes = {
  mapOption: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any),
  value: PropTypes.any,

  busy: PropTypes.oneOf([false, true, null]),
  busyDebounce: PropTypes.number,

  'aria-describedby': stringOrArray,
  'aria-labelledby': stringOrArray.isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,

  'aria-invalid': PropTypes.string,
  autoComplete: PropTypes.string,
  autoCapitalize: PropTypes.string,
  autoCorrect: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  inputMode: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.number,
  spellCheck: PropTypes.string,

  errorMessage: PropTypes.node,
  notFoundMessage: PropTypes.node,
  foundOptionsMessage: PropTypes.func,

  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onLayoutListBox: PropTypes.func,
  onSearch: PropTypes.func,
  onValue: PropTypes.func,

  autoselect: PropTypes.oneOf([false, true, 'inline']),
  expandOnFocus: PropTypes.bool,
  findSuggestion: PropTypes.func,
  managedFocus: PropTypes.bool,
  scrollIntoView: PropTypes.func,
  showSelectedLabel: PropTypes.bool,
  skipOption: PropTypes.func,
  tabAutocomplete: PropTypes.bool,

  renderWrapper: PropTypes.func,
  renderInput: PropTypes.func,
  renderListBox: PropTypes.func,
  renderGroup: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderGroupAccessibleLabel: PropTypes.func,
  renderOption: PropTypes.func,
  renderValue: PropTypes.func,
  renderDownArrow: PropTypes.func,
  renderClearButton: PropTypes.func,
  renderNotFound: PropTypes.func,
  renderErrorMessage: PropTypes.func,
  renderAriaDescription: PropTypes.func,
  renderAriaLiveMessage: PropTypes.func,

  visuallyHiddenClassName: PropTypes.string,
};

ComboBox.defaultProps = {
  options: null,
  mapOption: null,
  value: null,

  busy: false,
  busyDebounce: 400,

  'aria-describedby': null,
  className: `${classPrefix}combobox`,

  'aria-invalid': null,
  autoComplete: 'off',
  autoCapitalize: null,
  autoCorrect: null,
  autoFocus: null,
  disabled: null,
  inputMode: null,
  maxLength: null,
  minLength: null,
  pattern: null,
  placeholder: null,
  readOnly: null,
  required: null,
  size: null,
  spellCheck: null,

  errorMessage: null,
  notFoundMessage: 'No matches found',
  foundOptionsMessage: defaultFoundOptionsMessage,

  onBlur: null,
  onChange: null,
  onFocus: null,
  onLayoutListBox: null,
  onSearch: null,
  onValue: null,

  autoselect: false,
  expandOnFocus: true,
  findSuggestion: findOption,
  managedFocus: !(isMac() && !isSafari()),
  scrollIntoView: defaultScrollIntoView,
  skipOption: undefined,
  showSelectedLabel: undefined,
  tabAutocomplete: false,

  renderWrapper: (props) => <div {...props} />,
  renderInput: (props) => <input {...props} />,
  renderListBox: (props) => <ul {...props} />,
  renderGroup: (props) => <Fragment {...props} />,
  renderGroupLabel: (props) => <li {...props} />,
  renderGroupAccessibleLabel: (props) => <span {...props} />,
  renderOption: (props) => <li {...props} />,
  renderValue: (props) => <Fragment {...props} />,
  renderDownArrow: (props) => <span {...props} />,
  renderClearButton: (props) => <span {...props} />,
  renderNotFound: (props) => <div {...props} />,
  renderErrorMessage: (props) => <div {...props} />,
  renderAriaDescription: (props) => <div {...props} />,
  renderAriaLiveMessage: (props) => <div {...props} />,

  visuallyHiddenClassName,
};

ComboBox.displayName = 'ComboBox';
