import {
  useRef,
  useEffect,
  useLayoutEffect,
  Fragment,
  useMemo,
  forwardRef,
  useState,
  useCallback,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer';
import { reducer } from './combo_box/reducer';
import { initialState } from './combo_box/initial_state';
import {
  onKeyDown,
  onChange,
  onFocus,
  onInputMouseUp,
  onClearValue,
  onBlur,
  onClickOption,
  onWrapperKeyDown,
  onOptionsChanged,
  onValueChanged,
  onFocusInput,
} from './combo_box/actions';
import { useEvent } from '../hooks/use_event';
import { useModified } from '../hooks/use_modified';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { useOnBlur } from '../hooks/use_on_blur';
import { makeBEMClass } from '../helpers/make_bem_class';
import { joinTokens } from '../helpers/join_tokens';
import { stringOrArray } from '../validators/string_or_array';
import { findOption } from '../helpers/find_option';
import { useCombineRefs } from '../hooks/use_combine_refs';
import { ListBox } from './list_box';
import { AriaLiveMessage } from './aria_live_message';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { visuallyHiddenClassName as defaultVisuallyHiddenClassName } from '../constants/visually_hidden_class_name';
import { scrollIntoView } from '../layout/scroll_into_view';
import { useLayoutListBox } from '../hooks/use_layout_list_box';
import { Context } from './combo_box/context';

const defaultRenderWrapper = (props) => <div {...props} />;
const defaultRenderInput = (props) => <input {...props} />;
const defaultRenderListBox = (props) => <ul {...props} />;
const defaultRenderGroup = ({ key, ...props }) => (
  <Fragment
    key={key}
    {...props}
  />
);
const defaultRenderGroupLabel = (props) => <li {...props} />;
// eslint-disable-next-line react/jsx-no-useless-fragment
const defaultRenderGroupName = (props) => <Fragment {...props} />;
const defaultRenderOption = ({ key, ...props }) => (
  <li
    key={key}
    {...props}
  />
);
// eslint-disable-next-line react/jsx-no-useless-fragment
const defaultRenderValue = (props) => <Fragment {...props} />;
const defaultRenderDownArrow = (props) => <span {...props} />;
const defaultRenderClearButton = (props) => <span {...props} />;
const defaultRenderNotFound = (props) => <div {...props} />;
const defaultRenderAriaDescription = (props) => <div {...props} />;

const defaultNotFoundMessage = () => 'No results found';
const defaultFoundOptionsMessage = (options) =>
  `${options.length} result${options.length > 1 ? 's are' : ' is'} available`;
const defaultSelectedOptionMessage = (option, options) =>
  `${option.label} ${option.index + 1} of ${options.length} is highlighted`;

export const ComboBox = memo(
  forwardRef(
    (
      {
        id,
        options: _options = null,
        mapOption = null,
        value: _value,
        placeholderOption,
        mustHaveSelection = false,

        busy = false,
        busyDebounce = 400,

        'aria-describedby': ariaDescribedBy = null,
        className = null,
        classPrefix = `${defaultClassPrefix}combobox`,
        'aria-labelledby': ariaLabelledBy,

        'aria-invalid': ariaInvalid = null,
        autoComplete = 'off',
        autoCapitalize = null,
        autoCorrect = null,
        autoFocus = null,
        disabled = false,
        inputMode = null,
        maxLength = null,
        minLength = null,
        pattern = null,
        placeholder = null,
        readOnly = null,
        required = null,
        size = null,
        spellCheck = null,

        onBlur: passedOnBlur = null,
        onChange: passedOnChange = null,
        onFocus: passedOnFocus = null,
        onLayoutFocusedOption: _onLayoutFocusedOption = scrollIntoView,
        onLayoutListBox = null,
        onSearch = null,
        onValue = null,

        editable = true,
        autoselect = false,
        clearOnSelect = false,
        closeOnSelect = true,
        expandOnFocus = true,
        findSuggestion = findOption,
        selectOnBlur = true,
        skipOption,
        showSelectedLabel,
        tabAutocomplete = false,
        tabBetweenOptions = false,

        assistiveHint = 'When results are available use up and down arrows to review and enter to select',
        notFoundMessage = defaultNotFoundMessage,
        foundOptionsMessage = defaultFoundOptionsMessage,
        selectedOptionMessage = defaultSelectedOptionMessage,

        renderWrapper = defaultRenderWrapper,
        renderInput = defaultRenderInput,
        renderListBox = defaultRenderListBox,
        renderGroup = defaultRenderGroup,
        renderGroupLabel = defaultRenderGroupLabel,
        renderGroupName = defaultRenderGroupName,
        renderOption = defaultRenderOption,
        renderValue = defaultRenderValue,
        renderDownArrow = defaultRenderDownArrow,
        renderClearButton = defaultRenderClearButton,
        renderNotFound = defaultRenderNotFound,
        renderAriaDescription = defaultRenderAriaDescription,

        visuallyHiddenClassName = defaultVisuallyHiddenClassName,

        ...props
      },
      ref,
    ) => {
      const normalisedOptions = useNormalisedOptions({
        id,
        value: _value,
        options: _options,
        mapOption,
        placeholderOption,
        mustHaveSelection,
      });

      const optionisedProps = Object.freeze({
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': ariaInvalid,
        'aria-labelledby': ariaLabelledBy,
        assistiveHint,
        autoCapitalize,
        autoComplete,
        autoCorrect,
        autoFocus,
        autoselect,
        busy,
        busyDebounce,
        className,
        classPrefix,
        clearOnSelect,
        closeOnSelect,
        disabled,
        editable,
        expandOnFocus,
        findSuggestion,
        foundOptionsMessage,
        id,
        inputMode,
        maxLength,
        minLength,
        mustHaveSelection,
        notFoundMessage,
        onBlur: passedOnBlur,
        onChange: passedOnChange,
        onFocus: passedOnFocus,
        onLayoutFocusedOption: _onLayoutFocusedOption,
        onLayoutListBox,
        onSearch,
        onValue,
        pattern,
        placeholder,
        readOnly,
        renderAriaDescription,
        renderClearButton,
        renderDownArrow,
        renderGroup,
        renderGroupLabel,
        renderGroupName,
        renderInput,
        renderListBox,
        renderNotFound,
        renderOption,
        renderValue,
        renderWrapper,
        required,
        selectOnBlur,
        selectedOptionMessage,
        showSelectedLabel,
        size,
        skipOption,
        spellCheck,
        tabAutocomplete,
        tabBetweenOptions,
        visuallyHiddenClassName,
        ...props,
        ...normalisedOptions,
      });

      const { nullOptions, options, selectedOption, value } = normalisedOptions;

      const comboRef = useRef();
      const inputRef = useRef();
      const listRef = useRef();
      const focusedRef = useRef();
      const lastKeyRef = useRef();
      const busyTimeoutRef = useRef();

      const [state, dispatch] = useReducer(
        reducer,
        { ...optionisedProps, inputRef, listRef, lastKeyRef },
        initialState,
      );
      const [showBusy, setShowBusy] = useState(false);

      const {
        expanded,
        focusedOption,
        search,
        focusListBox,
        inlineAutoselect,
        suggestedOption,
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

      const inputLabel = useMemo(() => {
        if (
          inlineAutoselect ||
          (((showSelectedLabel && !focusedOption?.unselectable) ??
            autoselect === 'inline') &&
            focusListBox)
        ) {
          return focusedOption?.label;
        }
        return search ?? value?.label;
      }, [
        inlineAutoselect,
        showSelectedLabel,
        autoselect,
        focusListBox,
        focusedOption,
        search,
        value,
      ]);

      useLayoutEffect(() => {
        if (
          search &&
          autoselect === 'inline' &&
          inlineAutoselect &&
          focusedOption &&
          document.activeElement === inputRef.current
        ) {
          inputRef.current.setSelectionRange(
            search.length,
            focusedOption.label.length,
            'backward',
          );
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

      useModified(options.length ? options : null, () => {
        dispatch(onOptionsChanged());
      });

      useModified(value?.identity, () => {
        dispatch(onValueChanged());
      });

      // If the value changes and the list box is active and no search is set trigger onSearch with the new label
      useEffect(() => {
        if (search === null && expanded) {
          onSearch?.(value?.label);
        }
      }, [value?.identity]); // eslint-disable-line react-hooks/exhaustive-deps

      // Do not show the list box is the only option is the currently selected option
      const showListBox = useMemo(
        () =>
          expanded &&
          !!options.length &&
          !(
            options.length === 1 &&
            options[0].identity === selectedOption?.identity &&
            options[0].label === (search ?? value?.label)
          ),
        [expanded, options, selectedOption, search, value],
      );

      const onLayoutFocusedOption = useEvent(() => {
        []
          .concat(_onLayoutFocusedOption)
          .filter(Boolean)
          .forEach((fn) => {
            fn({
              option: focusedRef.current,
              listbox: listRef.current,
              input: inputRef.current,
            });
          });
      });

      useLayoutEffect(() => {
        if (showListBox && onLayoutFocusedOption) {
          onLayoutFocusedOption();
        }
      }, [focusedOption, showListBox, onLayoutFocusedOption]);

      useLayoutListBox({
        showListBox,
        onLayoutListBox,
        options,
        listboxRef: listRef,
        inputRef,
      });

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

      const showNotFound =
        !busy &&
        expanded &&
        !options.length &&
        !nullOptions &&
        !!search?.trim() &&
        search !== value?.label;

      const ariaBusy =
        showBusy && ((search?.trim() && search !== value?.label) || expanded);
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
      const clickOption = useCallback(
        (e, option) => dispatch(onClickOption(e, option)),
        [],
      );

      const context = useMemo(
        () => ({
          visuallyHiddenClassName,
          dispatch,
        }),
        [dispatch, visuallyHiddenClassName],
      );

      return (
        <Context.Provider value={context}>
          {renderWrapper(
            {
              'aria-busy': ariaBusy ? 'true' : 'false',
              className: className || makeBEMClass(classPrefix),
              onBlur: handleBlur,
              onFocus: handleFocus,
              onKeyDown: (e) => dispatch(onWrapperKeyDown(e)),
              ref: comboRef,
              children: (
                <>
                  {renderInput(
                    {
                      id,
                      className: makeBEMClass(classPrefix, 'input'),
                      type: 'text',
                      role: 'combobox',
                      'aria-autocomplete': ariaAutocomplete,
                      'aria-controls': `${id}_listbox`,
                      'aria-expanded': showListBox ? 'true' : 'false',
                      'aria-activedescendant':
                        (showListBox && focusListBox && focusedOption?.key) ||
                        null,
                      'aria-describedby': joinTokens(
                        ariaDescribedBy,
                        assistiveHint && `${id}_aria_description`,
                      ),
                      'aria-labelledby': joinTokens(ariaLabelledBy),
                      value: inputLabel || '',
                      onKeyDown: (e) => dispatch(onKeyDown(e)),
                      onChange: (e) => dispatch(onChange(e)),
                      onMouseUp: (e) => dispatch(onInputMouseUp(e)),
                      onFocus: (e) => dispatch(onFocusInput(e)),
                      ref: combinedRef,
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
                    },
                    componentState,
                    optionisedProps,
                  )}
                  {renderDownArrow(
                    {
                      id: `${id}_down_arrow`,
                      className: makeBEMClass(classPrefix, 'down-arrow'),
                      hidden: value?.label || !options.length || disabled,
                    },
                    componentState,
                    optionisedProps,
                  )}
                  {renderClearButton(
                    {
                      id: `${id}_clear_button`,
                      role: 'button',
                      'aria-label': 'Clear',
                      'aria-labelledby': joinTokens(
                        `${id}_clear_button`,
                        ariaLabelledBy,
                        id,
                      ),
                      className: makeBEMClass(classPrefix, 'clear-button'),
                      onClick: (e) => dispatch(onClearValue(e)),
                      onKeyDown: (e) => dispatch(onClearValue(e)),
                      onKeyUp: (e) => dispatch(onClearValue(e)),
                      hidden:
                        disabled || readOnly || !value?.label || search === '',
                      tabIndex: -1,
                    },
                    componentState,
                    optionisedProps,
                  )}
                  <ListBox
                    ref={listRef}
                    id={`${id}_listbox`}
                    tabIndex={-1}
                    hidden={!showListBox}
                    aria-labelledby={joinTokens(ariaLabelledBy)}
                    onSelectOption={clickOption}
                    focusedRef={focusedRef}
                    componentProps={optionisedProps}
                    componentState={componentState}
                  />
                  {assistiveHint &&
                    renderAriaDescription(
                      {
                        id: `${id}_aria_description`,
                        className: visuallyHiddenClassName,
                        children: assistiveHint,
                      },
                      componentState,
                      optionisedProps,
                    )}
                  {notFoundMessage &&
                    renderNotFound(
                      {
                        id: `${id}_not_found`,
                        className: makeBEMClass(classPrefix, 'not-found'),
                        hidden: !showNotFound,
                        children: showNotFound ? notFoundMessage() : null,
                      },
                      componentState,
                      optionisedProps,
                    )}
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
            },
            componentState,
            optionisedProps,
          )}
        </Context.Provider>
      );
    },
  ),
);

ComboBox.propTypes = {
  mapOption: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any),
  value: PropTypes.any,
  placeholderOption: PropTypes.any,

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

  editable: PropTypes.bool,
  autoselect: PropTypes.oneOf([false, true, 'inline']),
  clearOnSelect: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  expandOnFocus: PropTypes.bool,
  findSuggestion: PropTypes.func,
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

  renderWrapper: PropTypes.func,
  renderInput: PropTypes.func,
  renderListBox: PropTypes.func,
  renderGroup: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderGroupName: PropTypes.func,
  renderOption: PropTypes.func,
  renderValue: PropTypes.func,
  renderDownArrow: PropTypes.func,
  renderClearButton: PropTypes.func,
  renderNotFound: PropTypes.func,
  renderAriaDescription: PropTypes.func,

  visuallyHiddenClassName: PropTypes.string,
};

ComboBox.displayName = 'ComboBox';
