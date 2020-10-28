import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context';

export function ScreenReaderMessage({ hidden }) {
  const [message, setMessage] = useState(null);
  const { props: {
    options, notFoundMessage, foundOptionsMessage, visuallyHiddenClassName,
  } } = useContext(Context);

  useEffect(() => {
    if (hidden) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setMessage(options.length ? foundOptionsMessage(options) : notFoundMessage);
    }, 500);

    return () => clearTimeout(timeout);
  }, [options, hidden, foundOptionsMessage, notFoundMessage]);

  return (
    <div
      className={visuallyHiddenClassName}
      aria-atomic="true"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

ScreenReaderMessage.propTypes = {
  hidden: PropTypes.bool.isRequired,
};
