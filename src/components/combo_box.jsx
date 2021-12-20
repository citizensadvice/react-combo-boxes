import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { makeBEMClass } from '../helpers/make_bem_class';
import { joinTokens } from '../helpers/join_tokens';
import { stringOrArray } from '../validators/string_or_array';
import { findOption } from '../helpers/find_option';
import { useCombineRefs } from '../hooks/use_combine_refs';
import { AriaLiveMessage } from './aria_live_message';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';
import { scrollIntoView } from '../layout/scroll_into_view';
import { listBoxRenderer as defaultListBoxRenderer } from '../helpers/list_box_renderer';
import { useComboBox } from '../hooks/use_combo_box';

export const ComboBox = forwardRef((rawProps, ref) => {
  const {
    wrapperProps,
    inputProps,
    listBoxProps,
    clearButtonProps,
    state,
    props: normalisedProps,
  } = useComboBox({ ...rawProps, ref });

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
    classPrefix,
    disabled,
    foundOptionsMessage,
    id,
    inputMode,
    listBoxRenderer,
    maxLength,
    minLength,
    notFoundMessage,
    nullOptions,
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
    selectedOptionMessage,
    showSelectedLabel,
    size,
    spellCheck,
    value,
    visuallyHiddenClassName: providedVisuallyHiddenClassName,
  } = normalisedProps;

  const {
    expanded, focusedOption, search,
    focusListBox, inlineAutoselect, suggestedOption, showListBox,
  } = state;

  const busyTimeoutRef = useRef();
  const inputRef = useRef();
  const [showBusy, setShowBusy] = useState(false);

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

  const ariaBusy = showBusy && search?.trim() && search !== (value?.label);
  const combinedRef = useCombineRefs(inputProps.ref, inputRef, ref);
  const renderState = Object.freeze({
    expanded: showListBox,
    notFound: showNotFound,
    currentOption: focusedOption,
    search,
    suggestedOption,
    'aria-busy': ariaBusy,
    'aria-autocomplete': ariaAutocomplete,
  });

  return renderWrapper({
    ...wrapperProps,
    'aria-busy': ariaBusy ? 'true' : 'false',
    children: (
      <>
        {renderInput({
          ...inputProps,
          ref: combinedRef,
          type: 'text',
          'aria-autocomplete': ariaAutocomplete,
          'aria-describedby': joinTokens(ariaDescribedBy, assistiveHint && `${id}_aria_description`),
          value: inputLabel || '',
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
        }, renderState, normalisedProps)}
        {renderDownArrow({
          id: `${id}_down_arrow`,
          className: makeBEMClass(classPrefix, 'down-arrow'),
          hidden: value || !options.length,
        }, renderState, normalisedProps)}
        {renderClearButton({
          ...clearButtonProps,
          id: `${id}_clear_button`,
          'aria-label': 'Clear',
          'aria-labelledby': joinTokens(`${id}_clear_button`, ariaLabelledBy, id),
        }, renderState, normalisedProps)}
        {listBoxRenderer(renderState, normalisedProps, listBoxProps)}
        {assistiveHint && renderAriaDescription({
          id: `${id}_aria_description`,
          className: providedVisuallyHiddenClassName,
          children: assistiveHint,
        }, renderState, normalisedProps)}
        {notFoundMessage && renderNotFound({
          id: `${id}_not_found`,
          className: makeBEMClass(classPrefix, 'not-found'),
          hidden: !showNotFound,
          children: showNotFound ? notFoundMessage() : null,
        }, renderState, normalisedProps)}
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
      </>
    ),
  }, renderState, normalisedProps);
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
  onLayoutFocusedOption: PropTypes.func,
  onLayoutListBox: PropTypes.func,
  onSearch: PropTypes.func,
  onValue: PropTypes.func,

  editable: PropTypes.bool,
  autoselect: PropTypes.oneOf([false, true, 'inline']),
  expandOnFocus: PropTypes.bool,
  findSuggestion: PropTypes.func,
  managedFocus: PropTypes.bool,
  selectOnBlur: PropTypes.bool,
  mustHaveSelection: PropTypes.bool,
  showSelectedLabel: PropTypes.bool,
  skipOption: PropTypes.func,
  tabAutocomplete: PropTypes.bool,
  tabBetweenOptions: PropTypes.bool,

  assistiveHint: PropTypes.string,
  notFoundMessage: PropTypes.func,
  foundOptionsMessage: PropTypes.func,
  selectedOptionMessage: PropTypes.func,

  listBoxRenderer: PropTypes.func,
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
  onLayoutFocusedOption: ({ option }) => scrollIntoView(option),
  onLayoutListBox: null,
  onSearch: null,
  onValue: null,

  editable: true,
  autoselect: false,
  expandOnFocus: true,
  findSuggestion: findOption,
  managedFocus: true,
  selectOnBlur: true,
  mustHaveSelection: false,
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

  listBoxRenderer: defaultListBoxRenderer,
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
  renderAriaDescription: (props) => <div {...props} />,

  visuallyHiddenClassName,
};

ComboBox.displayName = 'ComboBox';
