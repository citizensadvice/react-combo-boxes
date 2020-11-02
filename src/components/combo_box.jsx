import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context';
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
import { componentValidator } from '../validators/component_validator';
import { stringOrArray } from '../validators/string_or_array';
import { findOption } from '../helpers/find_option';
import { useCombineRefs } from '../hooks/use_combine_refs';
import { allowProps } from '../helpers/allow_props';
import { ListBox } from './list_box';
import { ScreenReaderMessage } from './screen_reader_message';
import { classPrefix } from '../constants/class_prefix';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';
import { isSafari } from '../sniffers/is_safari';
import { isMac } from '../sniffers/is_mac';

const allowAttributes = [
  'autoComplete', 'autoCapitalize', 'autoCorrect', 'autoFocus', 'disabled', 'inputMode',
  'maxLength', 'minLength', 'pattern', 'placeholder', 'readOnly',
  'required', 'size', 'spellCheck', 'aria-invalid',
];

function defaultFoundOptionsMessage(options) {
  return `${options.length} option${options.length > 1 ? 's' : ''} found`;
}

export const ComboBox = forwardRef(({ placeholder, ...rawProps }, ref) => {
  const optionisedProps = { ...useNormalisedOptions(rawProps), placeholder };
  const {
    'aria-describedby': ariaDescribedBy, 'aria-labelledby': ariaLabelledBy,
    busyDebounce, options, value, selectedOption, id, className,
    notFoundMessage, foundOptionsMessage, onLayoutListBox, managedFocus, busy, onSearch,
    autoselect, showSelectedLabel,
    onBlur: passedOnBlur, onFocus: passedOnFocus,
    ListBoxComponent, listBoxProps,
    WrapperComponent, wrapperProps,
    BeforeInputComponent,
    InputComponent, inputProps,
    DownArrowComponent, downArrowProps,
    ClearButtonComponent, clearButtonProps,
    NotFoundComponent, notFoundProps,
    FoundDescriptionComponent,
    ScreenReaderMessageComponent,
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
    expanded && !!options.length
      && !(options.length === 1
        && options[0].identity === selectedOption?.identity
        && options[0].label === (search ?? value?.label)
      )
  ), [expanded, options, selectedOption, search, value]);

  useLayoutEffect(() => {
    if (focusedOption && focusListBox && showListBox) {
      if (managedFocus) {
        focusedRef.current?.focus();
      } else {
        focusedRef.current?.scrollIntoView?.({ block: 'nearest' });
      }
    } else if (expanded && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
      inputRef.current?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [expanded, managedFocus, focusedOption, focusListBox, showListBox]);

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

  const showNotFound = notFoundMessage && busy === false && expanded && !options.length
    && search?.trim() && search !== value?.label;
  const ariaBusy = showBusy && search?.trim() && search !== (value?.label);
  const combinedRef = useCombineRefs(inputRef, ref);
  const context = {
    props: optionisedProps,
    expanded: showListBox,
    notFound: showNotFound,
    currentOption: focusedOption,
    search,
    suggestedOption,
    'aria-busy': ariaBusy,
    'aria-autocomplete': ariaAutocomplete,
  };
  const clickOption = useCallback((e, option) => dispatch(onClick(e, option)), []);

  return (
    <Context.Provider value={context}>
      <WrapperComponent
        aria-busy={ariaBusy ? 'true' : 'false'}
        className={className}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={comboRef}
        {...wrapperProps}
      >
        <BeforeInputComponent />
        <InputComponent
          id={id}
          className={`${classPrefix}combobox__input`}
          type="text"
          role="combobox"
          autoComplete="off"
          // aria-haspopup="listbox" is implicit
          aria-autocomplete={ariaAutocomplete}
          aria-controls={`${id}_listbox`} // ARIA 1.2 pattern
          aria-expanded={showListBox ? 'true' : 'false'}
          aria-activedescendant={(showListBox && focusListBox && focusedOption?.key) || null}
          value={inputLabel || ''}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onChange={(e) => dispatch(onChange(e))}
          onMouseUp={(e) => dispatch(onInputMouseUp(e))}
          onFocus={(e) => dispatch(onFocusInput(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, `${id}_found_description`, ariaDescribedBy)}
          aria-labelledby={joinTokens(ariaLabelledBy)}
          ref={combinedRef}
          tabIndex={managedFocus && showListBox && focusListBox ? -1 : null}
          {...allowProps(optionisedProps, ...allowAttributes)}
          {...inputProps}
        />
        <DownArrowComponent
          id={`${id}_down_arrow`}
          className={`${classPrefix}combobox__down-arrow`}
          hidden={value || !options.length}
          {...downArrowProps}
        />
        <ClearButtonComponent
          id={`${id}_clear_button`}
          role="button"
          aria-label="Clear"
          aria-labelledby={joinTokens(`${id}_clear_button`, ariaLabelledBy, id)}
          className={`${classPrefix}combobox__clear-button`}
          onClick={(e) => dispatch(onClearValue(e))}
          onKeyDown={(e) => dispatch(onClearValue(e))}
          hidden={!value || search === ''}
          tabIndex={-1}
          {...clearButtonProps}
        />
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          tabIndex={-1}
          hidden={!showListBox}
          aria-activedescendant={(showListBox && focusListBox && focusedOption?.key) || null}
          aria-labelledby={joinTokens(ariaLabelledBy)}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onSelectOption={clickOption}
          focusedRef={focusedRef}
          {...listBoxProps}
        />
        <FoundDescriptionComponent
          id={`${id}_found_description`}
          className={providedVisuallyHiddenClassName}
        >
          {showListBox ? foundOptionsMessage(options) : null }
        </FoundDescriptionComponent>
        <NotFoundComponent
          id={`${id}_not_found`}
          className={`${classPrefix}combobox__not-found`}
          hidden={!showNotFound}
          {...notFoundProps}
        >
          {showNotFound ? notFoundMessage : null}
        </NotFoundComponent>
        <ScreenReaderMessageComponent
          hidden={!showNotFound && !showListBox}
        />
      </WrapperComponent>
    </Context.Provider>
  );
});

ComboBox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  mapOption: PropTypes.func,
  value: PropTypes.any,

  busy: PropTypes.oneOf([false, true, null]),
  busyDebounce: PropTypes.number,

  'aria-describedby': stringOrArray,
  'aria-labelledby': stringOrArray.isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,

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
  showSelectedLabel: PropTypes.bool,
  skipOption: PropTypes.func,
  tabAutocomplete: PropTypes.bool,

  WrapperComponent: componentValidator,
  wrapperProps: PropTypes.object,
  BeforeInputComponent: componentValidator,
  InputComponent: componentValidator,
  inputProps: PropTypes.object,
  ListBoxComponent: componentValidator,
  listBoxProps: PropTypes.object,
  ListBoxListComponent: componentValidator,
  listBoxListProps: PropTypes.object,
  GroupComponent: componentValidator,
  groupProps: PropTypes.object,
  GroupLabelComponent: componentValidator,
  groupLabelProps: PropTypes.object,
  OptionComponent: componentValidator,
  optionProps: PropTypes.object,
  ValueComponent: componentValidator,
  valueProps: PropTypes.object,
  DownArrowComponent: componentValidator,
  downArrowProps: PropTypes.object,
  ClearButtonComponent: componentValidator,
  clearButtonProps: PropTypes.object,
  FoundDescriptionComponent: componentValidator,
  NotFoundComponent: componentValidator,
  notFoundProps: PropTypes.object,
  ScreenReaderMessageComponent: componentValidator,
  visuallyHiddenClassName: PropTypes.string,
};

ComboBox.defaultProps = {
  mapOption: null,
  value: null,

  busy: false,
  busyDebounce: 400,

  'aria-describedby': null,
  placeholder: null,
  className: `${classPrefix}combobox`,

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
  skipOption: undefined,
  showSelectedLabel: undefined,
  tabAutocomplete: false,

  WrapperComponent: 'div',
  wrapperProps: null,
  BeforeInputComponent: Fragment,
  InputComponent: 'input',
  inputProps: null,
  ListBoxComponent: ListBox,
  listBoxProps: null,
  ListBoxListComponent: undefined,
  listBoxListProps: null,
  GroupComponent: undefined,
  groupProps: null,
  GroupLabelComponent: undefined,
  groupLabelProps: null,
  OptionComponent: undefined,
  optionProps: null,
  ValueComponent: Fragment,
  valueProps: null,
  DownArrowComponent: 'span',
  downArrowProps: null,
  ClearButtonComponent: 'span',
  clearButtonProps: null,
  FoundDescriptionComponent: 'div',
  NotFoundComponent: 'div',
  notFoundProps: null,
  ScreenReaderMessageComponent: ScreenReaderMessage,
  visuallyHiddenClassName,
};

ComboBox.displayName = 'ComboBox';
