import { render } from '@testing-library/react';
import { SubstringHighlight } from './substring_highlight';
import '../../__mock_highlight__';

it('highlights empty string', () => {
  const { container } = render(
    <SubstringHighlight
      value=""
      search=""
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span />
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('highlights with an empty search', () => {
  const { container } = render(
    <SubstringHighlight
      value="foo"
      search=""
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

it('highlights with no match', () => {
  const { container } = render(
    <SubstringHighlight
      value="foo barfoo"
      search="fizz"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo barfoo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('highlights with a match', () => {
  const { container } = render(
    <SubstringHighlight
      value="foo barfoo"
      search="foo"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo barfoo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights(
    ['foo', 0, 3],
    ['foo', 7, 10],
  );
});

it('inverses the a highlight', () => {
  const { container } = render(
    <SubstringHighlight
      value="foo barfoo"
      search="foo"
      inverse
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo barfoo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'bar',
    4,
    7,
  ]);
});
