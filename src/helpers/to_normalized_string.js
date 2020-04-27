import { rAccent } from '../constants/r_accent';

export function toNormalizedString(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (String.prototype.normalize) {
    // This won't work in IE11, but for everything else it strips accents
    // Splits, for example, é into e + unicode accent, then filters the accents out
    return String(value).normalize('NFD').replace(rAccent, '');
  }
  return String(value);
}
