import { render } from '@testing-library/react';
import { passThroughHighlight } from './pass_through_highlight';

it('returns the children as is', () => {
  const { container } = render((
    passThroughHighlight()({ children: 'bar' }, { search: 'foo' }, {}, { search: 'foe' })
  ));

  expect(container).toContainHTML('<div>bar</div>');
});
