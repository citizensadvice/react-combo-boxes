export function indexValue(option) {
  return (option?.label || String(option ?? '')).trim();
}
