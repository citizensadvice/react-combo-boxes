import { render } from '@testing-library/react';
import { Highlight } from './highlight';

it('renders a highlight', () => {
  const { container } = render(<Highlight>{['f', ['o'], 'o']}</Highlight>);
  expect(container).toMatchInlineSnapshot(`
<div>
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo
  </span>
  <span
    aria-hidden="true"
  >
    f
    <mark>
      o
    </mark>
    o
  </span>
</div>
`);
});

it('renders an inverse highlight', () => {
  const { container } = render(
    <Highlight inverse>{['f', ['o'], 'o']}</Highlight>,
  );
  expect(container).toMatchInlineSnapshot(`
<div>
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo
  </span>
  <span
    aria-hidden="true"
  >
    <mark>
      f
    </mark>
    o
    <mark>
      o
    </mark>
  </span>
</div>
`);
});

it('renders a single item highlight', () => {
  const { container } = render(<Highlight>{['foo']}</Highlight>);
  expect(container).toMatchInlineSnapshot(`
<div>
  foo
</div>
`);
});

it('renders an inverse single item highlight', () => {
  const { container } = render(<Highlight inverse>{['foo']}</Highlight>);
  expect(container).toMatchInlineSnapshot(`
<div>
  <mark>
    foo
  </mark>
</div>
`);
});

it('renders an empty highlight', () => {
  const { container } = render(<Highlight>{[]}</Highlight>);
  expect(container).toMatchInlineSnapshot(`<div />`);
});
