import { render } from '@testing-library/react';
import { SubstringHighlight } from './substring_highlight';

it('highlights empty string', () => {
  const { container } = render(
    <SubstringHighlight
      value=""
      search=""
    />,
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
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
  foo
</div>
`);
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
  foo barfoo
</div>
`);
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
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo barfoo
  </span>
  <span
    aria-hidden="true"
  >
    <mark>
      foo
    </mark>
     bar
    <mark>
      foo
    </mark>
  </span>
</div>
`);
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
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo barfoo
  </span>
  <span
    aria-hidden="true"
  >
    foo 
    <mark>
      bar
    </mark>
    foo
  </span>
</div>
`);
});
