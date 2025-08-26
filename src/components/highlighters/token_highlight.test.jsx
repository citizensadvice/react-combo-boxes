import { render } from '@testing-library/react';
import { TokenHighlight } from './token_highlight';
import '../../__mock_highlight__';

it('highlights empty string', () => {
  const { container } = render(
    <TokenHighlight
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
    <TokenHighlight
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
    <TokenHighlight
      value="foo foobar"
      search="bar"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo foobar
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('highlights with a match', () => {
  const { container } = render(
    <TokenHighlight
      value="foo foobar"
      search="foo"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo foobar
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights(
    ['foo', 0, 3],
    ['foo', 4, 7],
  );
});

it('inverses the a highlight', () => {
  const { container } = render(
    <TokenHighlight
      value="foo foobar"
      search="foo"
      inverse
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo foobar
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'bar',
    7,
    10,
  ]);
});
