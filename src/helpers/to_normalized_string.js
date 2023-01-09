import { rAccent } from '../constants/r_accent';

export function toNormalizedString(value) {
  if (value === null || value === undefined) {
    return '';
  }
  // Splits, for example, é into e + unicode accent, then filters the accents out
  return String(value).normalize('NFD').replace(rAccent, '');
}
