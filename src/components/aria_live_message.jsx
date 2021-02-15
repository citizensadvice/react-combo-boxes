import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export function AriaLiveMessage({
  hidden,
  componentProps,
  componentProps: {
    options,
    notFoundMessage,
    foundOptionsMessage,
    visuallyHiddenClassName,
    renderAriaLiveMessage,
  },
  componentState,
}) {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (hidden) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setMessage(options.length ? foundOptionsMessage(options) : notFoundMessage);
    }, 500);

    return () => clearTimeout(timeout);
  }, [options, hidden, foundOptionsMessage, notFoundMessage]);

  return renderAriaLiveMessage({
    'aria-atomic': 'true',
    'aria-live': 'polite',
    className: visuallyHiddenClassName,
    children: message,
  }, componentState, componentProps);
}

AriaLiveMessage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  componentProps: PropTypes.shape({
    options: PropTypes.array.isRequired,
    notFoundMessage: PropTypes.node,
    foundOptionsMessage: PropTypes.func.isRequired,
    visuallyHiddenClassName: PropTypes.string.isRequired,
    renderAriaLiveMessage: PropTypes.func.isRequired,
  }).isRequired,
};
