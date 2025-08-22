import { render } from '@testing-library/react';
import { DelimitedHighlight } from './delimited_highlight';
import '../../__mock_highlight__';

it('highlights empty string', () => {
  const { container } = render(
    <DelimitedHighlight
      value=""
      start="<em>"
      end="</em>"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span />
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('highlights with no match', () => {
  const { container } = render(
    <DelimitedHighlight
      value="foo"
      start="<em>"
      end="</em>"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('highlights with a match', () => {
  const { container } = render(
    <DelimitedHighlight
      value="foo <em>bar</em>"
      start="<em>"
      end="</em>"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo bar
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'bar',
    4,
    7,
  ]);
});

it('inverses a highlight', () => {
  const { container } = render(
    <DelimitedHighlight
      value="foo <em>bar</em>"
      start="<em>"
      end="</em>"
      inverse
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo bar
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'foo',
    0,
    3,
  ]);
});
