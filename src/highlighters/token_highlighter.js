import { normaliseHighlight } from '../helpers/normalise_highlight';
import { rAccent } from '../constants/r_accent';
import { rPunctuation } from '../constants/r_punctuation';
import { rSpace } from '../constants/r_space';
import { tokenise } from '../helpers/tokenise';

/**
 * Highlights terms inside a search query
 *
 * tokenHighligher('lorem foobar', 'foo')
 * = ['lorem ', ['foo'], 'bar']
 */
export function tokenHighlighter(term, query) {
  if (String.prototype.normalize) {
    // Splits, for example, é into e + unicode accent
    term = term.normalize('NFD');
  }
  const tokenised = tokenise(query);
  const result = [];
  let cursor = 0;
  let char = '';
  let buffer = '';
  let currentTerm = '';
  let highlightEnds = 0;
  let match;
  // Because of the accent and punctuation handling, a parser is the easiest approach
  do {
    char = term[cursor++] || '';
    if (rAccent.test(char)) {
      // Skip accents
      if (currentTerm && match && currentTerm.length === match.length) {
        // If we have a complete match, ensure additional accent characters are included in
        // the highlighted section
        highlightEnds += 1;
      }
    } else if (!char || rSpace.test(char) || rPunctuation.test(char)) {
      // Breaks a term
      if (currentTerm) {
        if (highlightEnds) {
          result.push(
            [buffer.slice(0, highlightEnds)],
            buffer.slice(highlightEnds),
          );
        } else {
          result.push(buffer);
        }
        currentTerm = '';
        buffer = '';
      }
    } else {
      if (!currentTerm && buffer) {
        result.push(buffer);
        buffer = '';
      }
      currentTerm += char.toLowerCase();

      match = tokenised.find((token) => currentTerm.indexOf(token) === 0);
      if (match) {
        if (currentTerm.length <= match.length) {
          highlightEnds = buffer.length + 1;
        }
      } else {
        highlightEnds = 0;
      }
    }
    buffer += char;
  } while (char);
  if (buffer) {
    result.push(buffer);
  }
  return normaliseHighlight(result);
}
