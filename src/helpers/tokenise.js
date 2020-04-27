import { rSpace } from '../constants/r_space';
import { toSearchableString } from './to_searchable_string';

export function tokenise(item) {
  return toSearchableString(item)
    .split(rSpace)
    .filter(Boolean);
}
