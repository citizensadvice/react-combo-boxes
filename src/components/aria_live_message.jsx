import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useEvent } from '../hooks/use_event';

const debouceMilliseconds = 1400; // https://github.com/alphagov/accessible-autocomplete/blob/935f0d43aea1c606e6b38985e3fe7049ddbe98be/src/status.js#L18

export function AriaLiveMessage({
  showListBox,
  showNotFound,
  options = null,
  focusedOption = null,
  visuallyHiddenClassName,
  notFoundMessage = null,
  foundOptionsMessage = null,
  selectedOptionMessage = null,
}) {
  const [message, setMessage] = useState('');

  const makeMessage = useEvent(() => {
    let newMessage = '';

    if (showNotFound) {
      newMessage = notFoundMessage?.();
    } else if (showListBox) {
      newMessage = foundOptionsMessage?.(options) || '';
      if (focusedOption) {
        if (newMessage) {
          newMessage += ', ';
        }
        newMessage += selectedOptionMessage?.(focusedOption, options);
      }
    }

    return newMessage;
  });

  useEffect(() => {
    const newMessage = makeMessage();
    const timeout = setTimeout(
      () => setMessage(newMessage),
      debouceMilliseconds,
    );
    return () => clearTimeout(timeout);
  }, [showListBox, showNotFound, options, focusedOption, makeMessage]);

  // Some user-agents will not read out changes to text nodes, so use
  // key to ensure the div is recreated
  return (
    <div className={visuallyHiddenClassName}>
      <div
        role="status"
        aria-atomic="true"
        aria-live="polite"
      >
        <div key={message}>{message}</div>
      </div>
    </div>
  );
}

AriaLiveMessage.propTypes = {
  showListBox: PropTypes.bool.isRequired,
  showNotFound: PropTypes.bool.isRequired,
  options: PropTypes.array,
  focusedOption: PropTypes.shape({
    index: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  visuallyHiddenClassName: PropTypes.string.isRequired,
  notFoundMessage: PropTypes.func,
  foundOptionsMessage: PropTypes.func,
  selectedOptionMessage: PropTypes.func,
};
