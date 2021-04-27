/**
 * Ensure the element is visible in the list box
 *
 * This scrolls the list box, and then the entire page as required.
 *
 * There is a native scrollIntoView method.  This works great in Chrome and Firefox however:
 *
 * - in IE11 it always jumps the element to the top of the page
 * - in Safari it does not support scroll-padding-top so cannot handle sticky table headers.
 * - in Safari it does not support all arguments, and can scroll the element to the centre.
 */
export function scrollIntoView(element) {
  if (!element) {
    return;
  }

  let parent = element.offsetParent;

  if (!parent) {
    return;
  }

  if (parent.matches('table')) {
    parent = parent.offsetParent;
  }

  if (!parent || parent.matches('body')) {
    return;
  }

  // Ensure the list box is correctly scrolled

  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.clientHeight;

  const parentTop = parent.scrollTop;
  const parentBottom = parentTop + parent.clientHeight;

  const scrollPaddingTop = parseFloat(window.getComputedStyle(parent).scrollPaddingTop) || 0;

  if (parentTop - scrollPaddingTop > elementTop) {
    parent.scrollTop = elementTop - scrollPaddingTop;
  } else if (parentBottom < elementBottom) {
    parent.scrollTop = elementBottom - (parentBottom - parentTop);
  }

  // Ensure the element is on-screen

  const elementRect = element.getBoundingClientRect();
  const height = document.body.clientHeight;

  if (elementRect.top < 0) {
    window.scrollTo(window.scrollX, window.scrollY + elementRect.top);
  } else if (elementRect.bottom > height) {
    window.scrollTo(window.scrollX, window.scrollY + elementRect.bottom - height);
  }
}
