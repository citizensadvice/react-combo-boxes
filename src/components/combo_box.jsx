import { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer';
import { reducer } from './combo_box/reducer';
import { initialState } from './combo_box/initial_state';
import {
  onKeyDown, onChange, onFocus, onInputMouseUp, onClearValue, onBlur,
  onClickOption, onOptionsChanged, onValueChanged, onFocusInput, onFocusOption,
} from './combo_box/actions';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { useOnBlur } from '../hooks/use_on_blur';
import { useMounted } from '../hooks/use_mounted';
import { makeBEMClass } from '../helpers/make_bem_class';
import { joinTokens } from '../helpers/join_tokens';
import { stringOrArray } from '../validators/string_or_array';
import { findOption } from '../helpers/find_option';
import { useCombineRefs } from '../hooks/use_combine_refs';
import { ListBox } from './list_box';
import { AriaLiveMessage } from './aria_live_message';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';
import { scrollIntoView } from '../layout/scroll_into_view';
import { DISPATCH } from '../constants/dispatch';
import { LayoutListBox } from './layout_list_box';

export const ComboBox = forwardRef((rawProps, ref) => {
  const optionisedProps = Object.freeze({
    ...rawProps,
    ...useNormalisedOptions(rawProps, { mustHaveSelection: rawProps.selectOnly }),
  });
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    autoselect,
    assistiveHint,
    busy,
    busyDebounce,
    className,
    classPrefix,
    disabled,
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
    onLayoutFocusedOption,
    onLayoutListBox,
    onSearch,
    options,
    pattern,
    placeholder,
    readOnly,
    renderClearButton,
    renderAriaDescription,
    renderDownArrow,
    renderInput,
    renderNotFound,
    renderWrapper,
    required,
    selectedOption,
    selectedOptionMessage,
    showSelectedLabel,
    size,
    spellCheck,
    tabBetweenOptions,
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
      inputRef.current.setSelectionRange(search.length, focusedOption.label.length, 'backward');
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
      && !!options.length
      && !(options.length === 1
        && options[0].identity === selectedOption?.identity
        && options[0].label === (search ?? value?.label)
      )
  ), [expanded, options, selectedOption, search, value]);

  // TODO: wrap layout in an event hook
  useLayoutEffect(() => {
    if (showListBox && onLayoutFocusedOption) {
      [].concat(onLayoutFocusedOption).filter(Boolean).forEach((fn) => {
        fn({ option: focusedRef.current, listbox: listRef.current });
      });
    }
    if (focusedOption && focusListBox && showListBox) {
      if (managedFocus) {
        focusedRef.current?.focus();
      }
    } else if (expanded && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, managedFocus, focusedOption, focusListBox, showListBox, options]);

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

  const showNotFound = !busy
    && expanded
    && !options.length
    && !nullOptions
    && !!search?.trim()
    && search !== value?.label;

  const ariaBusy = showBusy && ((search?.trim() && search !== (value?.label)) || expanded);
  const combinedRef = useCombineRefs(inputRef, ref);
  const componentState = Object.freeze({
    expanded: showListBox,
    notFound: showNotFound,
    currentOption: focusedOption,
    search,
    suggestedOption,
    'aria-busy': ariaBusy,
    'aria-autocomplete': ariaAutocomplete,
    [DISPATCH]: dispatch,
  });
  const clickOption = useCallback((e, option) => dispatch(onClickOption(e, option)), []);
  const focusOption = useCallback((e, option) => dispatch(onFocusOption(option)), []);

  return renderWrapper({
    'aria-busy': ariaBusy ? 'true' : 'false',
    className: className || makeBEMClass(classPrefix),
    onBlur: handleBlur,
    onFocus: handleFocus,
    ref: comboRef,
    children: (
      <>
        {renderInput({
          id,
          className: makeBEMClass(classPrefix, 'input'),
          type: 'text',
          role: 'combobox',
          'aria-autocomplete': ariaAutocomplete,
          'aria-owns': `${id}_listbox`,
          'aria-expanded': showListBox ? 'true' : 'false',
          'aria-activedescendant': (showListBox && focusListBox && focusedOption?.key) || null,
          'aria-describedby': joinTokens(ariaDescribedBy, assistiveHint && `${id}_aria_description`),
          'aria-labelledby': joinTokens(ariaLabelledBy),
          value: inputLabel || '',
          onKeyDown: (e) => dispatch(onKeyDown(e)),
          onChange: (e) => dispatch(onChange(e)),
          onMouseUp: (e) => dispatch(onInputMouseUp(e)),
          onFocus: (e) => dispatch(onFocusInput(e)),
          ref: combinedRef,
          tabIndex: managedFocus && showListBox && focusListBox && !tabBetweenOptions ? -1 : null,
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
          className: makeBEMClass(classPrefix, 'down-arrow'),
          hidden: value || !options.length,
        }, componentState, optionisedProps)}
        {renderClearButton({
          id: `${id}_clear_button`,
          role: 'button',
          'aria-label': 'Clear',
          'aria-labelledby': joinTokens(`${id}_clear_button`, ariaLabelledBy, id),
          className: makeBEMClass(classPrefix, 'clear-button'),
          onClick: (e) => dispatch(onClearValue(e)),
          onKeyDown: (e) => dispatch(onClearValue(e)),
          hidden: disabled || readOnly || !value || search === '',
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
          onFocusOption={focusOption}
          focusedRef={focusedRef}
          componentProps={optionisedProps}
          componentState={componentState}
        />
        {assistiveHint && renderAriaDescription({
          id: `${id}_aria_description`,
          className: providedVisuallyHiddenClassName,
          children: assistiveHint,
        }, componentState, optionisedProps)}
        {notFoundMessage && renderNotFound({
          id: `${id}_not_found`,
          className: makeBEMClass(classPrefix, 'not-found'),
          hidden: !showNotFound,
          children: showNotFound ? notFoundMessage() : null,
        }, componentState, optionisedProps)}
        <AriaLiveMessage
          visuallyHiddenClassName={visuallyHiddenClassName}
          options={options}
          showNotFound={showNotFound}
          showListBox={showListBox}
          focusedOption={focusedOption}
          notFoundMessage={notFoundMessage}
          foundOptionsMessage={foundOptionsMessage}
          selectedOptionMessage={selectedOptionMessage}
        />
        {showListBox && onLayoutListBox && (
          <LayoutListBox
            onLayoutListBox={onLayoutListBox}
            options={options}
            listBoxRef={listRef}
          />
        )}
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
  classPrefix: PropTypes.string,
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

  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onLayoutFocusedOption: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  onLayoutListBox: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  onSearch: PropTypes.func,
  onValue: PropTypes.func,

  autoselect: PropTypes.oneOf([false, true, 'inline']),
  closeOnSelect: PropTypes.bool,
  expandOnFocus: PropTypes.bool,
  findSuggestion: PropTypes.func,
  managedFocus: PropTypes.bool,
  selectOnBlur: PropTypes.bool,
  selectOnly: PropTypes.bool,
  showSelectedLabel: PropTypes.bool,
  skipOption: PropTypes.func,
  tabAutocomplete: PropTypes.bool,
  tabBetweenOptions: PropTypes.bool,

  assistiveHint: PropTypes.string,
  notFoundMessage: PropTypes.func,
  foundOptionsMessage: PropTypes.func,
  selectedOptionMessage: PropTypes.func,

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
  renderAriaDescription: PropTypes.func,

  visuallyHiddenClassName: PropTypes.string,
};

ComboBox.defaultProps = {
  options: null,
  mapOption: null,
  value: null,

  busy: false,
  busyDebounce: 400,

  'aria-describedby': null,
  className: null,
  classPrefix: `${defaultClassPrefix}combobox`,

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

  onBlur: null,
  onChange: null,
  onFocus: null,
  onLayoutFocusedOption: ({ option, listbox }) => scrollIntoView(option, listbox),
  onLayoutListBox: null,
  onSearch: null,
  onValue: null,

  autoselect: false,
  closeOnSelect: true,
  expandOnFocus: true,
  findSuggestion: findOption,
  managedFocus: true,
  selectOnBlur: true,
  selectOnly: false,
  skipOption: undefined,
  showSelectedLabel: undefined,
  tabAutocomplete: false,
  tabBetweenOptions: false,

  assistiveHint: 'When results are available use up and down arrows to review and enter to select',
  notFoundMessage: () => 'No results found',
  foundOptionsMessage: (options) => (
    `${options.length} result${options.length > 1 ? 's are' : ' is'} available`
  ),
  selectedOptionMessage: (option, options) => (
    `${option.label} ${option.index + 1} of ${options.length} is highlighted`
  ),

  renderWrapper: (props) => <div {...props} />,
  renderInput: (props) => <input {...props} />,
  renderListBox: (props) => <ul {...props} />,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  renderGroup: (props) => <Fragment {...props} />,
  renderGroupLabel: (props) => <li {...props} />,
  renderGroupAccessibleLabel: (props) => <span {...props} />,
  renderOption: (props) => <li {...props} />,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  renderValue: (props) => <Fragment {...props} />,
  renderDownArrow: (props) => <span {...props} />,
  renderClearButton: (props) => <span {...props} />,
  renderNotFound: (props) => <div {...props} />,
  renderAriaDescription: (props) => <div {...props} />,

  visuallyHiddenClassName,
};

ComboBox.displayName = 'ComboBox';
