(() => {
  let cursor = document.querySelector('nav a:not([href])');
  if (!cursor) {
    return;
  }
  do {
    cursor = cursor.parentNode.closest('details');
    if (!cursor) {
      break;
    }
    cursor.open = true;
  } while (true); // eslint-disable-line no-constant-condition
})();
