import { useRef, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { useEvent } from '../hooks/use_event';

export function LayoutListBox({ onLayoutListBox, options, listBoxRef }) {
  const animationFrameRef = useRef();

  const layout = useEvent(() => {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      [].concat(onLayoutListBox).filter(Boolean).forEach((fn) => fn(listBoxRef.current));
    });
  });

  useLayoutEffect(() => {
    layout();
  }, [layout, options]);

  useEffect(() => {
    window.addEventListener('resize', layout, { passive: true });
    window.addEventListener('scroll', layout, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', layout, { passive: true });
      window.removeEventListener('scroll', layout, { passive: true });
    };
  }, [layout]);

  return null;
}

LayoutListBox.propTypes = {
  onLayoutListBox: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]).isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  listBoxRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};
