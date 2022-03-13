export function layoutMaxWidth(el, { contain = 'body', minMaxWidth = 0 } = {}) {
  const elBounding = el.getBoundingClientRect();
  const container = el.closest(contain);
  const containerBounding = container.getBoundingClientRect();
  const clientRight = containerBounding.width - container.clientWidth - container.clientLeft;
  const containerRight = containerBounding.right - clientRight;
  const windowRight = document.documentElement.clientWidth;
  const styles = getComputedStyle(el);

  let extras = parseFloat(styles.marginRight) || 0;
  if (styles.boxSizing !== 'border-box') {
    extras += parseFloat(styles.paddingLeft) || 0;
    extras += parseFloat(styles.paddingRight) || 0;
    extras += parseFloat(styles.borderLeftWidth) || 0;
    extras += parseFloat(styles.borderRightWidth) || 0;
  }

  const maxWidth = Math.max(
    minMaxWidth,
    Math.min(windowRight, containerRight) - extras - elBounding.left,
  );

  el.style.setProperty('max-width', maxWidth ? `${maxWidth}px` : '');
}
