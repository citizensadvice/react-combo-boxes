import { useState, useEffect, useCallback } from 'react';

function calculateMaxWidth(el, selector) {
  el.maxWidth = ''; // eslint-disable-line no-param-reassign
  const contained = el.closest(selector) || document.body;
  const elBounding = el.getBoundingClientRect();
  const extras = Math.ceil(elBounding.width - el.clientWidth)
    + (parseFloat(getComputedStyle(el).marginRight) || 0);
  const maxWidth = `${contained.getBoundingClientRect().right - extras - elBounding.left}px`;
  el.style.maxWidth = maxWidth; // eslint-disable-line no-param-reassign
  return maxWidth;
}

function calculateMaxHeight(el) {
  el.style.maxHeight = ''; // eslint-disable-line no-param-reassign

  const elBounding = el.getBoundingClientRect();
  const windowEnd = window.innerHeight;
  let maxHeight = '';

  if (elBounding.bottom > windowEnd) {
    const extras = Math.ceil(elBounding.height - el.clientHeight)
      + (parseFloat(getComputedStyle(el).marginBottom) || 0);
    const newHeight = elBounding.height - (elBounding.bottom - windowEnd) - extras;
    const newMaxHeight = Math.max(newHeight, 0);
    maxHeight = `${newMaxHeight}px`;
  }
  el.style.maxHeight = maxHeight; // eslint-disable-line no-param-reassign
  return maxHeight;
}

export function useConfineListBox(selector = 'body') {
  const [style, setStyle] = useState({});
  const [handler, setHandler] = useState(null);

  // Called when the list box is opened, closed, or the options or selected option changes
  const layoutListBox = useCallback(({ expanded, listbox }) => {
    const updateProps = () => {
      if (!expanded || !listbox) {
        return;
      }

      setStyle({
        maxWidth: calculateMaxWidth(listbox, selector),
        maxHeight: calculateMaxHeight(listbox),
      });
    };

    updateProps();
    setHandler(() => updateProps);
  }, [selector]);

  useEffect(() => {
    if (!handler) {
      return undefined;
    }
    window.addEventListener('resize', handler, { passive: true });
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('resize', handler, { passive: true });
      window.removeEventListener('scroll', handler, { passive: true });
    };
  }, [handler]);

  return [style, layoutListBox];
}
