export function findOption(option, search) {
  if (option.unselectable) {
    return null;
  }
  return option.label
    .trim()
    .toLowerCase()
    .startsWith(search.trim().toLowerCase());
}
