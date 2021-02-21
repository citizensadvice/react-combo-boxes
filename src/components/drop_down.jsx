import React, { useRef, useEffect, useLayoutEffect, Fragment, forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
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
import { stringOrArray } from '../validators/string_or_array';
import { useCombineRefs } from '../hooks/use_combine_refs';
import { findOption } from '../helpers/find_option';
import { ListBox } from './list_box';
import { classPrefix } from '../constants/class_prefix';
import { joinTokens } from '../helpers/join_tokens';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';
import { scrollIntoView as defaultScrollIntoView } from '../helpers/scroll_into_view';

export const DropDown = forwardRef((rawProps, ref) => {
  const optionisedProps = Object.freeze({
    ...rawProps,
    ...useNormalisedOptions(rawProps, { mustHaveSelection: true }),
  });
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    children,
    disabled,
    findOption: currentFindOption,
    id,
    managedFocus,
    onBlur: passedOnBlur,
    onFocus: passedOnFocus,
    onLayoutListBox,
    options,
    renderComboBox,
    renderWrapper,
    required,
    scrollIntoView,
    selectedOption,
    value,
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
    if (expanded && focusedRef.current) {
      scrollIntoView(focusedRef.current);
    }
    if (expanded && focusedOption && managedFocus) {
      focusedRef.current?.focus();
    } else if (expanded && document.activeElement !== comboBoxRef.current) {
      comboBoxRef.current.focus();
    }
  }, [expanded, managedFocus, focusedOption, scrollIntoView]);

  const lastExpandedRef = useRef(expanded);
  useEffect(() => {
    if (!onLayoutListBox || (!expanded && !lastExpandedRef.current)) {
      return;
    }
    lastExpandedRef.current = expanded;
    onLayoutListBox({
      expanded,
      listbox: listRef.current,
      combobox: comboBoxRef.current,
    });
  }, [onLayoutListBox, expanded]);

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
  const clickOption = useCallback((e, option) => dispatch(onClick(e, option)), []);
  const componentState = Object.freeze({ expanded, search, currentOption: focusedOption });

  return renderWrapper({
    onBlur: handleBlur,
    onFocus: handleFocus,
    onKeyDown: (e) => dispatch(onKeyDown(e)),
    className: `${classPrefix}dropdown`,
    children: (
      <>
        {renderComboBox({
          role: 'combobox',
          id,
          className: `${classPrefix}dropdown__combobox`,
          'aria-controls': `${id}_listbox`,
          'aria-expanded': expanded ? 'true' : 'false',
          'aria-activedescendant': (expanded && focusedOption?.key) || null,
          'aria-labelledby': joinTokens(ariaLabelledBy, id),
          'aria-describedby': joinTokens(ariaDescribedBy),
          'aria-required': required ? 'true' : null,
          'aria-disabled': disabled ? 'true' : null,
          'aria-invalid': ariaInvalid == null ? undefined : String(ariaInvalid),
          tabIndex: disabled ? null : 0,
          ref: combinedRef,
          onClick: (e) => dispatch(onToggleOpen(e)),
          onMouseDown: (e) => e.preventDefault(),
          children: (children ?? value?.label ?? selectedOption?.label) || '\u00A0',
        }, componentState, optionisedProps)}
        <ListBox
          ref={listRef}
          id={`${id}_listbox`}
          hidden={!expanded}
          aria-activedescendant={(expanded && focusedOption?.key) || null}
          aria-labelledby={joinTokens(ariaLabelledBy)}
          tabIndex={-1}
          onSelectOption={clickOption}
          focusedRef={focusedRef}
          componentState={componentState}
          componentProps={optionisedProps}
        />
      </>
    ),
  }, componentState, optionisedProps);
});

DropDown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  mapOption: PropTypes.func,
  placeholderOption: PropTypes.string,
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
  scrollIntoView: PropTypes.func,
  skipOption: PropTypes.func,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onValue: PropTypes.func,
  onLayoutListBox: PropTypes.func,

  renderWrapper: PropTypes.func,
  renderListBox: PropTypes.func,
  renderComboBox: PropTypes.func,
  renderGroup: PropTypes.func,
  renderGroupLabel: PropTypes.func,
  renderGroupAccessibleLabel: PropTypes.func,
  renderOption: PropTypes.func,
  renderValue: PropTypes.func,

  visuallyHiddenClassName: PropTypes.string,
};

DropDown.defaultProps = {
  children: null,
  mapOption: null,
  placeholderOption: null,
  value: null,

  'aria-describedby': null,
  'aria-invalid': null,
  disabled: false,
  required: false,

  findOption,
  managedFocus: true,
  scrollIntoView: defaultScrollIntoView,
  skipOption: undefined,

  onBlur: null,
  onFocus: null,
  onValue: null,
  onLayoutListBox: null,

  renderWrapper: (props) => <div {...props} />,
  renderListBox: (props) => <ul {...props} />,
  renderComboBox: (props) => <div {...props} />,
  renderGroup: (props) => <Fragment {...props} />,
  renderGroupLabel: (props) => <li {...props} />,
  renderGroupAccessibleLabel: (props) => <span {...props} />,
  renderOption: (props) => <li {...props} />,
  renderValue: (props) => <Fragment {...props} />,

  visuallyHiddenClassName,
};

DropDown.displayName = 'DropDown';
