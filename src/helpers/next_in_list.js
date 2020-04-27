export function nextInList(
  options,
  index,
  { allowEmpty = false, skip, startIndex = index },
) {
  let i = index + 1;
  if (i >= options.length) {
    if (allowEmpty) {
      return null;
    }
    i = 0;
  }
  if (startIndex === i) {
    return options[i];
  }
  if (skip?.(options[i])) {
    return nextInList(options, i, { allowEmpty, skip, startIndex });
  }
  return options[i];
}
