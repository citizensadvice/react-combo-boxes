import { render } from '@testing-library/react';
import { DelimitedHighlight } from './delimited_highlight';

it('highlights empty string', () => {
  const { container } = render(
    <DelimitedHighlight
      value=""
      start="<em>"
      end="</em>"
    />,
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
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
  foo
</div>
`);
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
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo bar
  </span>
  <span
    aria-hidden="true"
  >
    foo 
    <mark>
      bar
    </mark>
  </span>
</div>
`);
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
  <span
    class="visually-hidden visuallyhidden sr-only react-combo-boxes-sr-only"
  >
    foo bar
  </span>
  <span
    aria-hidden="true"
  >
    <mark>
      foo
    </mark>
     bar
  </span>
</div>
`);
});
