import { nearestScrollable } from '../helpers/nearest_scrollable';

/**
 * Ensure the option is visible in the list box
 *
 * This scrolls the list box, and then the entire page as required.
 *
 * The native scrollIntoView is not sufficiently supported in Safari
 */
export function scrollIntoView({ option, listbox, input }) {
  if (!option) {
    if (listbox) {
      listbox.scrollTop = 0;
    }
    return;
  }

  const parent = nearestScrollable(option, listbox);

  if (!parent) {
    return;
  }

  // Ensure the list box is correctly scrolled
  const elementTop = option.offsetTop;
  const elementBottom = elementTop + option.clientHeight;

  const parentTop = parent.scrollTop;
  const parentBottom = parentTop + parent.clientHeight;

  const scrollPaddingTop =
    parseFloat(window.getComputedStyle(parent).scrollPaddingTop) || 0;

  if (parentTop - scrollPaddingTop > elementTop) {
    parent.scrollTop = elementTop - scrollPaddingTop;
  } else if (parentBottom < elementBottom) {
    parent.scrollTop = elementBottom - (parentBottom - parentTop);
  }

  // Ensure the element is on-screen

  const elementRect = option.getBoundingClientRect();
  const height = document.documentElement.clientHeight;

  if (elementRect.top < 0) {
    parent.scrollTop = elementTop - scrollPaddingTop;
    const inputRect = input.getBoundingClientRect();
    window.scrollTo(window.scrollX, window.scrollY + inputRect.top);
  } else if (elementRect.bottom > height) {
    window.scrollTo(
      window.scrollX,
      window.scrollY + elementRect.bottom - height,
    );
  }
}
