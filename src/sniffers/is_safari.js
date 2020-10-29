let value;

export function isSafari() {
  if (value === undefined) {
    value = /apple/i.test(navigator.vendor);
  }
  return value;
}
