import { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

const debouceMilliseconds = 1400; // https://github.com/alphagov/accessible-autocomplete/blob/935f0d43aea1c606e6b38985e3fe7049ddbe98be/src/status.js#L18

function reducer({ swap }, message) {
  return { swap: !swap, message };
}

export function AriaLiveMessage({
  showListBox,
  showNotFound,
  options,
  focusedOption,
  visuallyHiddenClassName,
  notFoundMessage,
  foundOptionsMessage,
  selectedOptionMessage,
}) {
  const [{ message, swap }, dispatch] = useReducer(reducer, '');

  useEffect(() => {
    let newMessage = '';

    if (showNotFound) {
      newMessage = notFoundMessage?.();
    } else if (showListBox) {
      newMessage = foundOptionsMessage?.(options);
      if (focusedOption) {
        newMessage += ` ${selectedOptionMessage?.(focusedOption, options)}`;
      }
    }

    const timeout = setTimeout(() => dispatch(newMessage), debouceMilliseconds);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, focusedOption, options, showNotFound, showListBox]);

  return (
    // Alternate the message between two status
    // Apparently this is better https://github.com/alphagov/accessible-autocomplete/commit/309836e12d8cfc0eea36d57e11ebf20fb885b447
    <div className={visuallyHiddenClassName}>
      <div
        role="status"
        aria-atomic="true"
        aria-live="polite"
      >
        {!swap ? message : '' }
      </div>
      <div
        role="status"
        aria-atomic="true"
        aria-live="polite"
      >
        {swap ? message : '' }
      </div>
    </div>
  );
}

AriaLiveMessage.propTypes = {
  showListBox: PropTypes.bool.isRequired,
  showNotFound: PropTypes.bool.isRequired,
  options: PropTypes.array,
  focusedOption: PropTypes.shape({
    label: PropTypes.string,
  }),
  visuallyHiddenClassName: PropTypes.string.isRequired,
  notFoundMessage: PropTypes.func,
  foundOptionsMessage: PropTypes.func,
  selectedOptionMessage: PropTypes.func,
};

AriaLiveMessage.defaultProps = {
  options: null,
  focusedOption: null,
  notFoundMessage: null,
  foundOptionsMessage: null,
  selectedOptionMessage: null,
};
