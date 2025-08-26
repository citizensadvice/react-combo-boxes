import { render } from '@testing-library/react';
import { PrefixHighlight } from './prefix_highlight';
import '../../__mock_highlight__';

it('highlights empty string', () => {
  const { container } = render(
    <PrefixHighlight
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
    <PrefixHighlight
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
    <PrefixHighlight
      value="foobar foo"
      search="bar"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foobar foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('highlights with a match', () => {
  const { container } = render(
    <PrefixHighlight
      value="foobar foo"
      search="foo"
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foobar foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'foo',
    0,
    3,
  ]);
});

it('inverses the a highlight', () => {
  const { container } = render(
    <PrefixHighlight
      value="foobar foo"
      search="foo"
      inverse
    />,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foobar foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'bar foo',
    3,
    10,
  ]);
});
