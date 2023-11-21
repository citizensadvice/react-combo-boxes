import { useCallback } from 'react';

/**
 * @private
 *
 * This generates blur and focus
 * handlers that fire if the focus moves from within an element and does not return
 */
export function useOnBlur(ref, blurFn, focusFn) {
  const onBlur = useCallback(
    (e) => {
      if (!e.relatedTarget || !ref.current.contains(e.relatedTarget)) {
        blurFn();
      }
    },
    [blurFn, ref],
  );

  const onFocus = useCallback(
    (e) => {
      if (!e.relatedTarget || !ref.current.contains(e.relatedTarget)) {
        focusFn();
      }
    },
    [focusFn, ref],
  );

  return [onBlur, onFocus];
}
