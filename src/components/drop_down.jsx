import React, { useRef, useEffect, useLayoutEffect, Fragment, forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer';
import { reducer } from './drop_down/reducer';
import { initialState } from './drop_down/initial_state';
import {
  clearSearch, onKeyDown, onBlur,
  onToggleOpen, onFocus, onClick,
  onSelectValue, setFocusedOption, onOptionsChanged, onValueChanged,
} from './drop_down/actions';
import { useNormalisedOptions } from '../hooks/use_normalised_options';
import { useOnBlur } from '../hooks/use_on_blur';
import { useMounted } from '../hooks/use_mounted';
import { componentValidator } from '../validators/component_validator';
import { stringOrArray } from '../validators/string_or_array';
import { useCombineRefs } from '../hooks/use_combine_refs';
import { findOption } from '../helpers/find_option';
import { ListBox } from './list_box';
import { classPrefix } from '../constants/class_prefix';
import { joinTokens } from '../helpers/join_tokens';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';

export const DropDown = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps, { mustHaveSelection: true });
  const {
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    required, disabled,
    options, value, id,
    children, managedFocus, onLayoutListBox,
    selectedOption, findOption: currentFindOption,
    onBlur: passedOnBlur, onFocus: passedOnFocus,
    ListBoxComponent, listBoxProps,
    WrapperComponent, wrapperProps,
    ComboBoxComponent, comboBoxProps,
    visuallyHiddenClassName: providedVisuallyHiddenClassName,
  } = optionisedProps;
  const comboBoxRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();
  const mounted = useMounted();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, comboBoxRef, listRef },
    initialState,
  );

  const { expanded, search, focusedOption } = state;
  const [handleBlur, handleFocus] = useOnBlur(
    listRef,
    useCallback(() => {
      dispatch(onBlur());
      passedOnBlur?.();
    }, [passedOnBlur]),
    useCallback(() => {
      dispatch(onFocus());
      passedOnFocus?.();
    }, [passedOnFocus]),
  );

  useEffect(() => {
    if (!search?.trim?.()) {
      return undefined;
    }
    const found = options.find((o) => currentFindOption(o, search));
    if (found) {
      if (expanded) {
        dispatch(setFocusedOption(found));
      } else {
        dispatch(onSelectValue(found));
      }
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, search, expanded, currentFindOption]);

  useLayoutEffect(() => {
    if (expanded && focusedOption && managedFocus) {
      focusedRef.current?.focus?.();
    } else if (expanded) {
      comboBoxRef.current.focus();
    }
  }, [expanded, managedFocus, focusedOption]);

  const lastExpandedRef = useRef(expanded);
  useLayoutEffect(() => {
    if (!onLayoutListBox || (!expanded && !lastExpandedRef.current)) {
      return;
    }
    lastExpandedRef.current = expanded;
    onLayoutListBox({
      expanded,
      listbox: listRef.current,
      combobox: comboBoxRef.current,
      option: focusedRef.current,
    });
  }, [onLayoutListBox, expanded, focusedOption]);

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

  const combinedRef = useCombineRefs(comboBoxRef, ref);
  const context = {
    props: optionisedProps,
    expanded,
    currentOption: focusedOption,
  };
  const clickOption = useCallback((e, option) => dispatch(onClick(e, option)), []);

  return (
    <Context.Provider value={context}>
      <WrapperComponent
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={(e) => dispatch(onKeyDown(e))}
        className={`${classPrefix}dropdown`}
        {...wrapperProps}
      >
        <div // Some screen-readers don't read the value
          id={`${id}_value`}
          className={providedVisuallyHiddenClassName}
        >
          {(children ?? value?.label ?? selectedOption?.label) || '\u00A0'}
        </div>
        <ComboBoxComponent
          role="combobox"
          id={id}
          className={`${classPrefix}dropdown__combobox`}
          aria-controls={`${id}_listbox`}
          aria-expanded={expanded ? 'true' : 'false'}
          aria-activedescendant={(expanded && focusedOption?.key) || null}
          aria-labelledby={joinTokens(ariaLabelledBy, `${id}_value`)}
          aria-describedby={joinTokens(ariaDescribedBy)}
          aria-required={required ? 'true' : null}
          aria-disabled={disabled ? 'true' : null}
          aria-invalid={ariaInvalid == null ? undefined : String(ariaInvalid)}
          tabIndex={disabled ? null : 0}
          ref={combinedRef}
          onClick={(e) => dispatch(onToggleOpen(e))}
          onMouseDown={(e) => e.preventDefault()}
          {...comboBoxProps}
        >
          {(children ?? value?.label ?? selectedOption?.label) || '\u00A0'}
        </ComboBoxComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          hidden={!expanded}
          aria-activedescendant={(expanded && focusedOption?.key) || null}
          aria-labelledby={joinTokens(ariaLabelledBy)}
          tabIndex={-1}
          onSelectOption={clickOption}
          focusedRef={focusedRef}
          {...listBoxProps}
        />
      </WrapperComponent>
    </Context.Provider>
  );
});

DropDown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  mapOption: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.node,

  'aria-describedby': stringOrArray,
  'aria-labelledby': stringOrArray.isRequired,
  'aria-invalid': PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,

  findOption: PropTypes.func,
  managedFocus: PropTypes.bool,
  skipOption: PropTypes.func,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onValue: PropTypes.func,
  onLayoutListBox: PropTypes.func,

  WrapperComponent: componentValidator,
  wrapperProps: PropTypes.object,
  ListBoxComponent: componentValidator,
  listBoxProps: PropTypes.object,
  ListBoxListComponent: componentValidator,
  listBoxListProps: PropTypes.object,
  ComboBoxComponent: componentValidator,
  comboBoxProps: PropTypes.object,
  GroupComponent: componentValidator,
  groupProps: PropTypes.object,
  GroupLabelComponent: componentValidator,
  groupLabelProps: PropTypes.object,
  OptionComponent: componentValidator,
  optionProps: PropTypes.object,
  ValueComponent: componentValidator,
  valueProps: PropTypes.object,
  visuallyHiddenClassName: PropTypes.string,
};

DropDown.defaultProps = {
  children: null,
  mapOption: null,
  placeholder: null,
  value: null,

  'aria-describedby': null,
  'aria-invalid': null,
  disabled: false,
  required: false,

  findOption,
  managedFocus: true,
  skipOption: undefined,

  onBlur: null,
  onFocus: null,
  onValue: null,
  onLayoutListBox: null,

  WrapperComponent: 'div',
  wrapperProps: null,
  ComboBoxComponent: 'div',
  comboBoxProps: null,
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
  visuallyHiddenClassName,
};

DropDown.displayName = 'DropDown';
