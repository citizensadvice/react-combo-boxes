import { render } from '@testing-library/react';
import { Highlight } from './highlight';

Object.defineProperties(global.navigator, {
  userAgent: {
    get() {
      return 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
    },
  },
});

it('renders the highlight without hidden text', () => {
  const { container } = render(<Highlight>{['f', ['o'], 'o']}</Highlight>);

  expect(container).toMatchInlineSnapshot(`
<div>
  f
  <mark>
    o
  </mark>
  o
</div>
`);
});
