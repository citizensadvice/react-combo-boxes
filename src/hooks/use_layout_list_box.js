import { useRef, useEffect, useCallback, useState } from 'react';

export function useLayoutListBox(...helpers) {
  const [enabled, setEnabled] = useState();
  const listboxRef = useRef();
  const animationFrameRef = useRef();
  const handlerRef = useRef();

  handlerRef.current = () => {
    helpers.forEach((helper) => helper(listboxRef.current));
  };

  const handlerWithAnimationFrame = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(handlerRef.current);
  }, []);

  // Called when the list box is opened, closed, or the options or selected option changes
  const onLayoutListBox = useCallback(({ expanded, listbox }) => {
    setEnabled(expanded);
    if (!expanded) {
      return;
    }
    listboxRef.current = listbox;
    handlerWithAnimationFrame();
  }, [handlerWithAnimationFrame]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    handlerWithAnimationFrame();

    window.addEventListener('resize', handlerWithAnimationFrame, { passive: true });
    window.addEventListener('scroll', handlerWithAnimationFrame, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handlerWithAnimationFrame, { passive: true });
      window.removeEventListener('scroll', handlerWithAnimationFrame, { passive: true });
    };
  }, [enabled, handlerWithAnimationFrame]);

  return onLayoutListBox;
}
