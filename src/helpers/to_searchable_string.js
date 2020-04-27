import { toNormalizedString } from './to_normalized_string';
import { rPunctuation } from '../constants/r_punctuation';
import { rSpace } from '../constants/r_space';

export function toSearchableString(text) {
  return toNormalizedString(text)
    .toLowerCase()
    .replace(rPunctuation, ' ')
    .replace(rSpace, ' ')
    .trim();
}
