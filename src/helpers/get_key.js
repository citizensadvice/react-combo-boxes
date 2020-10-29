import { isMac } from '../sniffers/is_mac';

export function getKey(event) {
  const { key, ctrlKey, altKey, metaKey } = event;

  if (!isMac()) {
    return key;
  }

  if (key === 'h' && ctrlKey && !altKey && !metaKey) {
    return 'Backspace';
  }

  if ((key === 'd' || key === 'k') && ctrlKey && !altKey && !metaKey) {
    return 'Delete';
  }

  return key;
}
