import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { setExpanded, setFocusedOption, onSelectValue } from './combo_box/actions';
import { rNonPrintableKey } from '../constants/r_non_printable_key';
import { DISPATCH } from '../constants/dispatch';

export const Searchable = forwardRef((props, ref) => {
  const [search, setSearch] = useState('');

  const { componentProps, componentState, ...wrapperProps } = props;
  const { expanded, [DISPATCH]: dispatch } = componentState;
  const { options, findOption, renderWrapper, disabled } = componentProps;

  // If the search changes update the option
  useEffect(() => {
    if (!search.trim() || !options?.length || !findOption) {
      return undefined;
    }

    const timeout = setTimeout(() => setSearch(''), 1000);

    if (options?.length && findOption && !disabled) {
      const found = options.find((o) => findOption(o, search));
      if (found) {
        if (expanded) {
          dispatch(setFocusedOption({ focusedOption: found }));
        } else {
          dispatch(onSelectValue(found));
        }
      }
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function onKeyDown(event) {
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
      setSearch((value) => `${value}${key}`);
      event.preventDefault();
    }
  }

  function onClick(e) {
    if (e.button > 0 || expanded || disabled) {
      return;
    }
    dispatch(setExpanded());
  }

  return renderWrapper({
    ...wrapperProps,
    'aria-busy': null,
    ref,
    onKeyDown,
    onClick,
  }, componentState, componentProps);
});

Searchable.propTypes = {
  componentProps: PropTypes.shape({
    disabled: PropTypes.bool,
    options: PropTypes.array,
    findOption: PropTypes.func,
    renderWrapper: PropTypes.func.isRequired,
  }).isRequired,
  componentState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    [DISPATCH]: PropTypes.func.isRequired,
  }).isRequired,
};
