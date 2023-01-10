/* eslint-disable quotes */

import { render } from '@testing-library/react';
import { PrefixHighlight } from './prefix_highlight';

it('highlights empty string', () => {
  const { container } = render(<PrefixHighlight label="" search="" />);
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('highlights with an empty search', () => {
  const { container } = render(<PrefixHighlight label="foo" search="" />);
  expect(container).toMatchInlineSnapshot(`
<div>
  foo
</div>
`);
});

it('highlights with no match', () => {
  const { container } = render(<PrefixHighlight label="foobar foo" search="bar" />);
  expect(container).toMatchInlineSnapshot(`
<div>
  foobar foo
</div>
`);
});

it('highlights with a match', () => {
  const { container } = render(<PrefixHighlight label="foobar foo" search="foo" />);
  expect(container).toMatchInlineSnapshot(`
<div>
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foobar foo
  </span>
  <span
    aria-hidden="true"
  >
    <mark>
      foo
    </mark>
    bar foo
  </span>
</div>
`);
});

it('inverses the a highlight', () => {
  const { container } = render(<PrefixHighlight label="foobar foo" search="foo" inverse />);
  expect(container).toMatchInlineSnapshot(`
<div>
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foobar foo
  </span>
  <span
    aria-hidden="true"
  >
    foo
    <mark>
      bar foo
    </mark>
  </span>
</div>
`);
});
