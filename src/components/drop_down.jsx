import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from './combo_box';
import { classPrefix as defaultClassPrefix } from '../constants/class_prefix';
import { makeBEMClass } from '../helpers/make_bem_class';
import { rNonPrintableKey } from '../constants/r_non_printable_key';
import {
  setExpanded,
  setFocusedOption,
  onSelectValue,
} from './combo_box/actions';
import { findOption as defaultFindOption } from '../helpers/find_option';
import { joinTokens } from '../helpers/join_tokens';
import { useEvent } from '../hooks/use_event';
import { Context } from './combo_box/context';

function renderNull() {
  return null;
}

const defaultRenderComboBox = (props) => <div {...props} />;
const defaultRenderWrapper = (props) => <div {...props} />;
const defaultRenderListBox = (props) => <ul {...props} />;
const defaultRenderListBoxWrapper = (props) => <div {...props} />;

function renderInput(props, state, componentProps) {
  const {
    id,
    classPrefix,
    children,
    disabled,
    required,
    value,
    selectedOption,
    renderComboBox,
  } = componentProps;
  return renderComboBox(
    {
      ...props,
      'aria-autocomplete': null,
      'aria-disabled': disabled ? 'true' : null,
      'aria-labelledby': joinTokens(props['aria-labelledby'], id),
      'aria-required': required ? 'true' : null,
      autoComplete: null,
      children: (children ?? value?.label ?? selectedOption?.label) || '\u00A0',
      className: makeBEMClass(classPrefix, 'combobox'),
      tabIndex: disabled ? null : 0,
      type: null,
      value: null,
    },
    state,
    componentProps,
  );
}

const ComboBoxWrapper = forwardRef((props, ref) => {
  const [search, setSearch] = useState('');
  const { dispatch } = useContext(Context);

  const { componentProps, componentState, ...wrapperProps } = props;
  const { expanded } = componentState;
  const { options, findOption, renderWrapper, disabled } = componentProps;

  const setFirstFoundOption = useEvent((s) => {
    if (!s.trim() || !options?.length || !findOption) {
      return;
    }
    if (options?.length && findOption && !disabled) {
      const found = options.find((o) => findOption(o, s));
      if (found) {
        if (expanded) {
          dispatch(setFocusedOption(found));
        } else {
          dispatch(onSelectValue(found));
        }
      }
    }
  });

  // If the search changes update the option
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(''), 1000);
    setFirstFoundOption(search);
    return () => clearTimeout(timeout);
  }, [search, setFirstFoundOption]);

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

  return renderWrapper(
    {
      ...wrapperProps,
      'aria-busy': null,
      ref,
      onKeyDown,
      onClick,
    },
    componentState,
    componentProps,
  );
});

ComboBoxWrapper.propTypes = {
  componentProps: PropTypes.shape({
    disabled: PropTypes.bool,
    options: PropTypes.array,
    findOption: PropTypes.func,
    renderWrapper: PropTypes.func.isRequired,
  }).isRequired,
  componentState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
  }).isRequired,
};

ComboBoxWrapper.displayName = 'comboBoxWrapper';

export const DropDown = forwardRef(
  (
    {
      children = null,
      classPrefix = `${defaultClassPrefix}dropdown`,
      required = false,
      renderComboBox = defaultRenderComboBox,
      renderListBoxWrapper = defaultRenderListBoxWrapper,
      renderWrapper = defaultRenderWrapper,
      renderListBox = defaultRenderListBox,
      findOption = defaultFindOption,
      ...props
    },
    ref,
  ) => {
    const newRenderWrapper = useCallback(
      (wrapperProps, componentState, componentProps) => (
        <ComboBoxWrapper
          {...wrapperProps}
          componentState={componentState}
          componentProps={{ ...componentProps, renderWrapper }}
        />
      ),
      [renderWrapper],
    );

    const newRenderListBox = useCallback(
      (wrapperProps, componentState, componentProps) =>
        componentProps.renderListBoxWrapper(
          {
            className: makeBEMClass(
              componentProps.classPrefix,
              'listbox-wrapper',
            ),
            children: renderListBox(
              wrapperProps,
              componentState,
              componentProps,
            ),
          },
          componentState,
          componentProps,
        ),
      [renderListBox],
    );

    return (
      <ComboBox
        ref={ref}
        renderInput={renderInput}
        classPrefix={classPrefix}
        disabled={false}
        editable={false}
        expandOnFocus={false}
        required={required}
        foundOptionsMessage={null}
        notFoundMessage={null}
        renderClearButton={renderNull}
        renderDownArrow={renderNull}
        renderComboBox={renderComboBox}
        renderListBoxWrapper={renderListBoxWrapper}
        mustHaveSelection
        findOption={findOption}
        {...props}
        renderWrapper={newRenderWrapper}
        renderListBox={newRenderListBox}
      >
        {children}
      </ComboBox>
    );
  },
);

DropDown.propTypes = {
  children: PropTypes.node,
  classPrefix: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  expandOnFocus: PropTypes.bool,
  required: PropTypes.bool,
  foundOptionsMessage: PropTypes.func,
  notFoundMessage: PropTypes.node,
  renderWrapper: PropTypes.func,
  renderClearButton: PropTypes.func,
  renderComboBox: PropTypes.func,
  renderDownArrow: PropTypes.func,
  renderListBox: PropTypes.func,
  renderListBoxWrapper: PropTypes.func,
  mustHaveSelection: PropTypes.bool,
  findOption: PropTypes.func,
};

DropDown.displayName = 'DropDown';
