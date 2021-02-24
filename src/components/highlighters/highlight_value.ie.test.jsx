import { render } from '@testing-library/react';
import { highlightValue } from './highlight_value';

Object.defineProperties(global.navigator, {
  userAgent: {
    get() {
      return 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
    },
  },
});

it('renders the highlight without hidden text', () => {
  const spy = jest.fn(() => ['f', ['o'], 'o']);

  const { container } = render((
    highlightValue(spy)({ children: 'foo' }, { search: 'bar' }, {})
  ));

  expect(container).toContainHTML('<div>f<mark>o</mark>o</div>');
});
