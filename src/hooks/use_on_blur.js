import { useCallback, useEffect, useState, useRef } from 'react';

/**
 * @private
 *
 * This generates blur and focus
 * handlers that fire if the focus moves from within an element and does not return
 */
export function useOnBlur(ref, blurFn, focusFn) {
  const [focus, setFocus] = useState(false);
  const timeoutRef = useRef();

  // Ensure the timeout does not run after unmounting
  useEffect(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  const onBlur = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        blurFn();
        setFocus(false);
      }
    }, 0);
  }, [blurFn, ref]);

  const onFocus = useCallback(() => {
    if (!focus) {
      focusFn();
      setFocus(true);
    }
  }, [focusFn, focus]);

  useEffect(() => {
    if (!focus) {
      return undefined;
    }
    window.addEventListener('focus', onBlur, { passive: true });

    return () => {
      window.removeEventListener('focus', onBlur, { passive: true });
    };
  }, [onBlur, focus]);

  return [onBlur, onFocus];
}
