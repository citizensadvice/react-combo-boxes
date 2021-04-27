/**
 *  If a table has a fixed width and there is more space than required
 *  it will evenly space the table cells.
 *
 *  This can result in a lot of white space between cells
 *
 *  This reallocates this excess white-space to the last table cell
 */
export function layoutColumnsAlignLeft(listbox) {
  const table = listbox.querySelector('table');
  if (!table) {
    return;
  }

  const cols = [...table.querySelectorAll('col')];
  cols.forEach((col) => {
    col.style.removeProperty('width');
    col.style.removeProperty('min-width');
  });

  const width = table.clientWidth;

  table.style.setProperty('width', 'auto');
  table.style.setProperty('min-width', 'auto');
  const autoWidth = table.clientWidth;

  if (autoWidth < width) {
    const columnWidths = cols.map((col) => col.getBoundingClientRect().width);
    cols.forEach((col, i) => {
      if (i === cols.length - 1) {
        // The last cell gets all the space
        col.style.setProperty('width', '100%');
      } else {
        // Make sure the other cells retain their natural width
        col.style.setProperty('min-width', `${columnWidths[i]}px`);
      }
    });
  }
  table.style.removeProperty('width');
  table.style.removeProperty('min-width');
}
