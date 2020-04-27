import { indexValue } from '../helpers/index_value';
import { tokenSearcher } from './token_searcher';

function tokenise(text) {
  return [text.trimStart().toLowerCase()];
}

export function prefixSearcher(options, { index = indexValue } = {}) {
  return tokenSearcher(options, { index, tokenise });
}
