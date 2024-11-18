import { useEffect } from 'react';
import { useEvent } from './use_event';

/**
 * @private
 *
 * This generates blur and focus
 * handlers that fire if the focus moves from within an element and does not return
 */
export function useOnBlur(ref, blurFn, focusFn) {
  const handleRefocus = useEvent((e) => {
    if (!e.relatedTarget || !ref.current.contains(e.relatedTarget)) {
      blurFn();
    }
  });

  const onBlur = useEvent((e) => {
    if (!document.hasFocus()) {
      // If the focus leaves the browser window keep the picker open
      // but check if it should close when the focus re-enters
      // Mostly this makes it nicer to use the browser console
      document.addEventListener('focus', handleRefocus);
      return;
    }
    if (!e.relatedTarget || !ref.current.contains(e.relatedTarget)) {
      blurFn();
    }
  });

  const onFocus = useEvent((e) => {
    if (!e.relatedTarget || !ref.current.contains(e.relatedTarget)) {
      focusFn();
    }
  });

  useEffect(
    () => () => {
      document.removeEventListener('focus', handleRefocus, { once: true });
    },
    [handleRefocus],
  );

  return [onBlur, onFocus];
}
