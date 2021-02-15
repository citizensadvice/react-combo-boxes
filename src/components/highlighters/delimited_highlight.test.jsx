import { render } from '@testing-library/react';
import { delimitedHighlight } from './delimited_highlight';

it('does not highlight with no children', () => {
  const { container } = render((
    delimitedHighlight({ children: null }, { search: null }, {}, { start: '<em>', end: '</em>' })
  ));

  expect(container).toContainHTML('<div></div>');
});

it('does not highlight with no search children', () => {
  const { container } = render((
    delimitedHighlight({ children: 'foo' }, { search: null }, {}, { start: '<em>', end: '</em>' })
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('converts <em> in html strings to a highlight', () => {
  const { container } = render((
    delimitedHighlight({ children: 'foo <em>bar</em> <em>foe</em>' }, { search: null }, { visuallyHiddenClassName: 'sr-only' }, { start: '<em>', end: '</em>' })
  ));

  expect(container).toMatchSnapshot();
});

it('inverses the highlight', () => {
  const { container } = render((
    delimitedHighlight(
      { children: 'foo <em>bar</em> <em>foe</em>' },
      { search: null },
      { visuallyHiddenClassName: 'sr-only' },
      { start: '<em>', end: '</em>', inverse: true },
    )
  ));

  expect(container).toMatchSnapshot();
});
