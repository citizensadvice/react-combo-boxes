import { useRef, useState, useLayoutEffect, useCallback } from 'react';

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
  const extras = Math.ceil(elBounding.height - el.clientHeight)
    + (parseFloat(getComputedStyle(el).marginBottom) || 0);
  const newHeight = elBounding.height - (elBounding.bottom - windowEnd) - extras;
  const newMaxHeight = Math.max(newHeight, 0);
  const maxHeight = `${newMaxHeight}px`;

  el.style.maxHeight = maxHeight; // eslint-disable-line no-param-reassign
  return maxHeight;
}

export function useConfineListBox(selector = 'body') {
  const [style, setStyle] = useState({});
  const [currentExpanded, setCurrentExpanded] = useState(false);
  const listboxRef = useRef(null);

  const handler = useCallback(() => {
    const { current: listbox } = listboxRef;
    const { scrollTop } = listbox;
    setStyle({
      maxWidth: calculateMaxWidth(listbox, selector),
      maxHeight: calculateMaxHeight(listbox),
    });
    listbox.scrollTop = scrollTop; // eslint-disable-line no-param-reassign
  }, [selector]);

  // Called when the list box is opened, closed, or the options or selected option changes
  const layoutListBox = useCallback(({ expanded, listbox }) => {
    if (!expanded || !listbox) {
      setCurrentExpanded(() => false);
      return;
    }
    setCurrentExpanded(true);
    listboxRef.current = listbox;
  }, []);

  useLayoutEffect(() => {
    if (!currentExpanded) {
      return undefined;
    }
    handler();

    let frame;
    const handlerWithAnimationFrame = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(handler);
    };

    window.addEventListener('resize', handlerWithAnimationFrame, { passive: true });
    window.addEventListener('scroll', handlerWithAnimationFrame, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handlerWithAnimationFrame, { passive: true });
      window.removeEventListener('scroll', handlerWithAnimationFrame, { passive: true });
    };
  }, [currentExpanded, handler]);

  return [style, layoutListBox];
}
