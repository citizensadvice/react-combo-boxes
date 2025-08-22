import { render } from '@testing-library/react';
import { Highlight } from './highlight';
import '../../__mock_highlight__';

it('renders a highlight', () => {
  const { container } = render(<Highlight>{['f', ['o'], 'o']}</Highlight>);
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights(['o', 1, 2]);
});

it('renders an inverse highlight', () => {
  const { container } = render(
    <Highlight inverse>{['f', ['o'], 'o']}</Highlight>,
  );
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights(
    ['f', 0, 1],
    ['o', 2, 3],
  );
});

it('renders a single item with no highlight', () => {
  const { container } = render(<Highlight>{['foo']}</Highlight>);
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('renders an inverse single item highlight', () => {
  const { container } = render(<Highlight inverse>{['foo']}</Highlight>);
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span>
       foo
     </span>
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'foo',
    0,
    3,
  ]);
});

it('renders an empty highlight', () => {
  const { container } = render(<Highlight>{[]}</Highlight>);
  expect(container).toMatchInlineSnapshot(`
   <div>
     <span />
   </div>
  `);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});

it('removes a highlight if changed', () => {
  const { rerender } = render(<Highlight>{[['foo'], ['bar']]}</Highlight>);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights(
    ['foo', 0, 3],
    ['bar', 3, 6],
  );
  rerender(<Highlight>{['foo', ['bar']]}</Highlight>);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights([
    'bar',
    3,
    6,
  ]);
});

it('removes a highlight if removed', () => {
  const { rerender } = render(<Highlight>{[['foo'], ['bar']]}</Highlight>);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights(
    ['foo', 0, 3],
    ['bar', 3, 6],
  );
  rerender(<Highlight>{[]}</Highlight>);
  expect(CSS.highlights.get('react-combo-boxes')).toHaveHighlights();
});
