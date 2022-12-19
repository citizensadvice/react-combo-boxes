import { useCallback, useLayoutEffect, useRef } from 'react';

// https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
export function useEvent(handler) {
  const handlerRef = useRef(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    const fn = handlerRef.current;
    return fn(...args);
  }, []);
}
