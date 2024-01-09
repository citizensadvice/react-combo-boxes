export function layoutMaxWidth(
  { listbox },
  { contain = 'body', minMaxWidth = 0 } = {},
) {
  if (listbox.hidden) {
    return;
  }
  const elBounding = listbox.getBoundingClientRect();
  const container = contain ? listbox.closest(contain) : null;
  const containerBounding = container?.getBoundingClientRect();
  let containerRight = Infinity;
  if (containerBounding) {
    const clientRight =
      containerBounding.width - container.clientWidth - container.clientLeft;
    containerRight = containerBounding.right - clientRight;
  }
  const windowRight = document.documentElement.clientWidth;
  const styles = getComputedStyle(listbox);

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

  listbox.style.setProperty('max-width', maxWidth ? `${maxWidth}px` : '');
}
