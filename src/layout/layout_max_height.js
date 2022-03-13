/**
 * Prevent the list box being taller than the viewport, of the document body
 *
 * @param {String} [options.contain = 'body'] selector to contain the list box within
 * @param {Number} [options.minMaxHeight = 0] minimum max height
 */
export function layoutMaxHeight(el, { contain = 'body', minMaxHeight = 0 } = {}) {
  const elBounding = el.getBoundingClientRect();
  const container = el.closest(contain);
  const containerBounding = container.getBoundingClientRect();
  const clientBottom = containerBounding.height - container.clientHeight - container.clientTop;
  const containerBottom = containerBounding.bottom - clientBottom;
  const windowEnd = document.documentElement.clientHeight;
  const styles = getComputedStyle(el);

  let extras = parseFloat(styles.marginBottom) || 0;
  if (styles.boxSizing !== 'border-box') {
    extras += parseFloat(styles.paddingTop) || 0;
    extras += parseFloat(styles.paddingBottom) || 0;
    extras += parseFloat(styles.borderTopWidth) || 0;
    extras += parseFloat(styles.borderBottomWidth) || 0;
  }

  const maxHeight = Math.max(
    minMaxHeight,
    Math.min(windowEnd, containerBottom) - extras - elBounding.top,
  );

  el.style.setProperty('max-height', maxHeight ? `${maxHeight}px` : '');
}
