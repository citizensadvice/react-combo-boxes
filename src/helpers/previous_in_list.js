export function previousInList(
  options,
  index,
  { allowEmpty = false, skip, startIndex = index },
) {
  let i = index - 1;
  if (i === -1 && allowEmpty) {
    return null;
  }
  if (i < 0) {
    i = options.length - 1;
  }
  if (startIndex === i) {
    return options[i];
  }
  if (skip?.(options[i])) {
    return previousInList(options, i, { allowEmpty, skip, startIndex });
  }
  return options[i];
}
