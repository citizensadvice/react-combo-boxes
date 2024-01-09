import { useRef, useEffect, useLayoutEffect } from 'react';

import { useEvent } from './use_event';

export function useLayoutListBox({
  showListBox,
  onLayoutListBox,
  options,
  listboxRef,
  inputRef,
}) {
  const animationFrameRef = useRef();

  const layout = useEvent(() => {
    if (!onLayoutListBox) {
      return;
    }
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      // The ref may change before the animation frame
      const { current: listbox } = listboxRef;
      const { current: input } = inputRef;
      if (!listbox || !input) {
        return;
      }
      []
        .concat(onLayoutListBox)
        .filter(Boolean)
        .forEach((fn) => fn({ listbox, input }));
    });
  });

  useLayoutEffect(() => {
    layout();
  }, [layout, options, showListBox]);

  useEffect(() => {
    const { current: listbox } = listboxRef;

    if (!showListBox) {
      return undefined;
    }

    function handleScroll(e) {
      if (e.target.contains(listbox)) {
        layout();
      }
    }

    window.addEventListener('resize', layout, { passive: true });
    document.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', layout, { passive: true });
      document.removeEventListener('scroll', handleScroll, {
        passive: true,
        capture: true,
      });
    };
  }, [showListBox, layout, listboxRef]);
}
