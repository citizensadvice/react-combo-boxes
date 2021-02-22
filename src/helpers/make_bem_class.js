export function makeBEMClass(prefix, ...values) {
  if (!prefix) {
    return null;
  }

  return values.map((value) => `${prefix}__${value}`).join(' ') || prefix;
}
