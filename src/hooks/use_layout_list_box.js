import { useRef, useEffect, useLayoutEffect } from 'react';

import { useEvent } from './use_event';

export function useLayoutListBox({ showListBox, onLayoutListBox, options, listboxRef, inputRef }) {
  const animationFrameRef = useRef();

  const layout = useEvent(() => {
    if (!onLayoutListBox) {
      return;
    }
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      [].concat(onLayoutListBox).filter(Boolean).forEach((fn) => fn({
        listbox: listboxRef.current,
        input: inputRef.current,
      }));
    });
  });

  useLayoutEffect(() => {
    if (!showListBox) {
      return;
    }
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
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', layout, { passive: true });
      document.removeEventListener('scroll', handleScroll, { passive: true, capture: true });
    };
  }, [showListBox, layout, listboxRef]);
}
