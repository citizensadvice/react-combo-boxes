export function nearestScrollable(option, listbox) {
  let cursor = option.parentNode;

  do {
    const { overflowY } = window.getComputedStyle(cursor);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      cursor.scrollHeight > cursor.clientHeight
    ) {
      return cursor;
    }

    if (cursor === listbox) {
      return undefined;
    }
    cursor = cursor.parentNode;
  } while (cursor && !cursor.matches('body'));

  return undefined;
}
