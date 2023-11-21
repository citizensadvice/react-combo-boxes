/* eslint-disable quotes */

import { render } from '@testing-library/react';
import { TokenHighlight } from './token_highlight';

it('highlights empty string', () => {
  const { container } = render(
    <TokenHighlight
      value=""
      search=""
    />,
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
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
  foo
</div>
`);
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
  foo foobar
</div>
`);
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
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo foobar
  </span>
  <span
    aria-hidden="true"
  >
    <mark>
      foo
    </mark>
     
    <mark>
      foo
    </mark>
    bar
  </span>
</div>
`);
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
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo foobar
  </span>
  <span
    aria-hidden="true"
  >
    foo foo
    <mark>
      bar
    </mark>
  </span>
</div>
`);
});
