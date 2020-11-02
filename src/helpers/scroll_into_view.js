/**
 * Ensure the element is visible in the list box
 *
 * This scrolls the list box, and then the entire page as required.
 *
 * The built-in scrollIntoView works badly in IE11, and fails to scroll
 * a parentbox when it is height limited.
 */
export function scrollIntoView(element) {
  if (!element) {
    return;
  }

  let parent = element.offsetParent;
  if (parent.matches('table')) {
    parent = parent.offsetParent;
  }

  if (!parent || parent.matches('body')) {
    return;
  }

  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.clientHeight;

  const parentTop = parent.scrollTop;
  const parentBottom = parentTop + parent.clientHeight;

  if (parentTop > elementTop) {
    parent.scrollTop = elementTop;
  } else if (parentBottom < elementBottom) {
    parent.scrollTop = elementBottom - (parentBottom - parentTop);
  }

  const elementRect = element.getBoundingClientRect();
  const height = document.body.clientHeight;

  if (elementRect.top < 0) {
    window.scrollTo(window.scrollX, window.scrollY + elementRect.top);
  } else if (elementRect.bottom > height) {
    window.scrollTo(window.scrollX, window.scrollY + elementRect.bottom - height);
  }
}
