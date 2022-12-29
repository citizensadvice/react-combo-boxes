import { useRef, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { useEvent } from '../hooks/use_event';

export function LayoutListBox({ onLayoutListBox, options, listboxRef, inputRef }) {
  const animationFrameRef = useRef();

  const layout = useEvent(() => {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      [].concat(onLayoutListBox).filter(Boolean).forEach((fn) => fn({
        listbox: listboxRef.current,
        input: inputRef.current,
      }));
    });
  });

  useLayoutEffect(() => {
    layout();
  }, [layout, options]);

  useEffect(() => {
    const { current: listbox } = listboxRef;

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
  }, [layout, listboxRef]);

  return null;
}

LayoutListBox.propTypes = {
  onLayoutListBox: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]).isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  listboxRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  inputRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};
