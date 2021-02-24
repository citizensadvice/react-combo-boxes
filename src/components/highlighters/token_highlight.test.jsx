import { render } from '@testing-library/react';
import { tokenHighlight } from './token_highlight';

it('does not highlight with no children', () => {
  const { container } = render((
    tokenHighlight()({ children: null }, { search: null }, {})
  ));

  expect(container).toContainHTML('<div></div>');
});

it('does not highlight with no search children', () => {
  const { container } = render((
    tokenHighlight()({ children: 'foo' }, { search: null }, {})
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('does not highlight no match', () => {
  const { container } = render((
    tokenHighlight()({ children: 'foo foobar' }, { search: 'bar' }, {})
  ));

  expect(container).toContainHTML('<div>foo foobar</div>');
});

it('highlights all tokens', () => {
  const { container } = render((
    tokenHighlight()({ children: 'foo bar foo bar' }, { search: 'bar' }, { visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});

it('highlights the start of tokens', () => {
  const { container } = render((
    tokenHighlight()({ children: '"barfoo"' }, { search: 'bar' }, { visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});

it('highlights existing value', () => {
  const { container } = render((
    tokenHighlight()({ children: 'foo bar foo bar' }, { search: null }, { value: { label: 'bar' }, visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});

it('inverses the highlight', () => {
  const { container } = render((
    tokenHighlight({ inverse: true })({ children: 'foo bar foo bar' }, { search: 'bar' }, { visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});
