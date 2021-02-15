import { render } from '@testing-library/react';
import { substringHighlight } from './substring_highlight';

it('does not highlight with no children', () => {
  const { container } = render((
    substringHighlight({ children: null }, { search: null }, {})
  ));

  expect(container).toContainHTML('<div></div>');
});

it('does not highlight with no search children', () => {
  const { container } = render((
    substringHighlight({ children: 'foo' }, { search: null }, {})
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('does not highlight no match', () => {
  const { container } = render((
    substringHighlight({ children: 'foo' }, { search: 'bar' }, {})
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('highlights a substring', () => {
  const { container } = render((
    substringHighlight({ children: 'foo bar foo bar' }, { search: 'bar' }, { visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});

it('highlights an existing value substring', () => {
  const { container } = render((
    substringHighlight({ children: 'foo bar foo bar' }, { search: null }, { value: { label: 'bar' }, visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});

it('inverses the highlight', () => {
  const { container } = render((
    substringHighlight({ children: 'foo bar foo bar' }, { search: 'bar' }, { visuallyHiddenClassName: 'sr-only' }, { inverse: true })
  ));

  expect(container).toMatchSnapshot();
});
