let value;

export function isIE() {
  if (value === undefined) {
    value = /Trident/i.test(navigator.userAgent);
  }
  return value;
}
