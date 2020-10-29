let value;

export function isMac() {
  if (value === undefined) {
    value = /mac|iphone|ipad|ipod/i.test(navigator.platform);
  }
  return value;
}
