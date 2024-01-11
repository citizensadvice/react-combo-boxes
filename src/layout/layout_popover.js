import { computePosition, offset, platform } from '@floating-ui/react';

/**
 * Turn the listbox into a popover
 *
 * This fixes situations where the list box is displayed inside a model, or a scrolling element
 *
 * Uses an actual popover where supported  (as of November 2023 Chrome/Edge/Safari >= 17)
 * Otherwise this is the same as position fixed
 */
export function layoutPopover({ listbox, input }) {
  if (listbox.hidden) {
    if (listbox.popover) {
      listbox.hidePopover();
    }
    return;
  }
  // Clear existing styles
  listbox.style.setProperty('bottom', '');
  // Needs to be position fixed
  listbox.style.setProperty('position', 'fixed');

  // eslint-disable-next-line no-prototype-builtins
  if (HTMLElement.prototype.hasOwnProperty('popover')) {
    listbox.popover = 'manual';
    // This will ensure the listbox is always in the top layer
    listbox.showPopover();
  }

  // The default is `min-width: 100%`, this doesn't work when position fixed
  // The 100% is the width of the input element
  listbox.style.minWidth = `${input.getBoundingClientRect().width}px`;

  // Need to compensate for the existing margin for a top orientation
  let offsetY = 0;
  if (listbox.dataset.orientation === 'top') {
    const style = window.getComputedStyle(listbox);
    offsetY = parseFloat(style.marginTop) - parseFloat(style.borderBottom);
  }

  computePosition(input, listbox, {
    placement:
      listbox.dataset.orientation === 'top' ? 'top-start' : 'bottom-start',
    platform,
    strategy: 'fixed',
    middleware: [offset(offsetY)],
  }).then(({ x, y }) => {
    listbox.style.setProperty('left', `${x}px`);
    listbox.style.setProperty('top', `${y}px`);
  });
}
