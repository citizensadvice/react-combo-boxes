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
    const { current: listbox } = listboxRef;
    const { current: input } = inputRef;
    // The ref may change before the animation frame
    if (listbox?.isConnected && input?.isConnected) {
      []
        .concat(onLayoutListBox)
        .filter(Boolean)
        .forEach((fn) => fn({ listbox, input }));
    }
  });

  const animateLayout = useEvent(() => {
    if (!onLayoutListBox) {
      return;
    }
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(layout);
  });

  useLayoutEffect(() => {
    if (showListBox) {
      animateLayout();
    } else {
      // Call layout functions to clean-up
      cancelAnimationFrame(animationFrameRef.current);
      layout();
    }
  }, [animateLayout, layout, options, showListBox]);

  useEffect(() => {
    const { current: listbox } = listboxRef;

    if (!showListBox) {
      return undefined;
    }

    const handleScroll = (e) => {
      if (listbox && e.target.contains(listbox)) {
        animateLayout();
      }
    };

    window.addEventListener('resize', animateLayout, { passive: true });
    document.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', animateLayout, { passive: true });
      document.removeEventListener('scroll', handleScroll, {
        passive: true,
        capture: true,
      });
    };
  }, [showListBox, animateLayout, listboxRef]);
}
