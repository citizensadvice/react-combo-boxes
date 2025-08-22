import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { inverseHighlight } from '../../helpers/inverse_highlight';

function emptyHighlight(highlight) {
  return (
    !highlight.length ||
    (highlight.length === 1 && typeof highlight[0] === 'string')
  );
}

export function Highlight({ children, inverse = false }) {
  let highlighted = children;

  if (inverse) {
    highlighted = inverseHighlight(highlighted);
  }

  const ref = useRef();

  useLayoutEffect(() => {
    const { current } = ref;

    if (!current) {
      return;
    }

    if (emptyHighlight(highlighted)) {
      return;
    }

    if (!CSS.highlights) {
      return;
    }

    let highlight = CSS.highlights.get('react-combo-boxes');
    if (!highlight) {
      highlight = new window.Highlight();
      CSS.highlights.set('react-combo-boxes', highlight);
    }

    let index = 0;
    const added = highlighted
      .map((part) => {
        if (Array.isArray(part)) {
          const range = new Range();
          range.setStart(current.firstChild, index);
          range.setEnd(current.firstChild, index + part[0].length);
          highlight.add(range);
          index += part[0].length;
          return range;
        } else {
          index += part.length;
        }
      })
      .filter(Boolean);

    return () => {
      added.forEach((range) => highlight.delete(range));
    };
  });

  return <span ref={ref}>{highlighted.join('')}</span>;
}

Highlight.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  ).isRequired,
  inverse: PropTypes.bool,
};
