/**
 * Prevent the list box being taller than the viewport, of the document body
 *
 * @param {String} [options.contain = 'body'] selector to contain the list box within
 * @param {Number} [options.minMaxHeight = 0] minimum max height
 * @param {Boolean} [options.allowMove = true] allow moving the listbox above the input
 */
export function layoutMaxHeight(
  { listbox, input },
  { contain = 'body', minMaxHeight = 0, allowReposition = true } = {},
) {
  if (listbox.hidden) {
    return;
  }
  // This height determines when the listbox should be moved above
  listbox.style.setProperty('max-height', '10em');

  const listboxBounding = listbox.getBoundingClientRect();
  const inputBounding = input.getBoundingClientRect();
  const container = contain ? listbox.closest(contain) : null;
  const containerBounding = container?.getBoundingClientRect();
  let containerBottom = Infinity;
  let containerTop = -Infinity;
  if (containerBounding) {
    const clientBottom =
      containerBounding.height - container.clientHeight - container.clientTop;
    containerBottom = containerBounding.bottom - clientBottom;
    containerTop = containerBounding.top + container.clientTop;
  }
  const windowEnd = document.documentElement.clientHeight;
  const styles = getComputedStyle(listbox);

  let extras = Math.max(parseFloat(styles.marginBottom) || 0, 0);
  extras += Math.max(parseFloat(styles.marginTop) || 0, 0);
  if (styles.boxSizing !== 'border-box') {
    extras += parseFloat(styles.paddingTop) || 0;
    extras += parseFloat(styles.paddingBottom) || 0;
    extras += parseFloat(styles.borderTopWidth) || 0;
    extras += parseFloat(styles.borderBottomWidth) || 0;
  }

  const maxBottom = Math.min(windowEnd, containerBottom);
  const maxTop = Math.max(0, containerTop);

  let maxHeight;
  let orientation;
  let bottom;
  const percentBottom = Math.min(
    (maxBottom - inputBounding.bottom - extras) / listboxBounding.height,
    1,
  );
  const percentTop = Math.min(
    (inputBounding.top - maxTop - extras) / listboxBounding.height,
    1,
  );

  if (allowReposition && percentTop * 0.8 > percentBottom) {
    // Move to top
    orientation = 'top';
    bottom = inputBounding.height;
    maxHeight = Math.max(minMaxHeight, inputBounding.top - maxTop - extras);
  } else {
    // Keep at bottom
    maxHeight = Math.max(
      minMaxHeight,
      maxBottom - extras - listboxBounding.top,
    );
  }

  if (orientation) {
    listbox.dataset.orientation = orientation;
  } else {
    delete listbox.dataset.orientation;
  }
  listbox.style.setProperty('bottom', bottom ? `${bottom}px` : '');
  listbox.style.setProperty('max-height', maxHeight ? `${maxHeight}px` : '');
}
