import { render } from '@testing-library/react';
import { prefixHighlight } from './prefix_highlight';

it('does not highlight with no children', () => {
  const { container } = render((
    prefixHighlight({ children: null }, { search: null }, {})
  ));

  expect(container).toContainHTML('<div></div>');
});

it('does not highlight with no search children', () => {
  const { container } = render((
    prefixHighlight({ children: 'foo' }, { search: null }, {})
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('does not highlight no match', () => {
  const { container } = render((
    prefixHighlight({ children: 'foo bar' }, { search: 'bar' }, {})
  ));

  expect(container).toContainHTML('<div>foo bar</div>');
});

it('highlights the first prefix', () => {
  const { container } = render((
    prefixHighlight({ children: 'bar foo bar' }, { search: 'bar' }, { visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});

it('highlights existing value', () => {
  const { container } = render((
    prefixHighlight({ children: 'bar foo bar' }, { search: null }, { value: { label: 'bar' }, visuallyHiddenClassName: 'sr-only' })
  ));

  expect(container).toMatchSnapshot();
});

it('inverses the highlight', () => {
  const { container } = render((
    prefixHighlight({ children: 'bar foo bar' }, { search: 'bar' }, { visuallyHiddenClassName: 'sr-only' }, { inverse: true })
  ));

  expect(container).toMatchSnapshot();
});
