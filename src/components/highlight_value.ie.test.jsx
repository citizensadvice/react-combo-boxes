import React from 'react';
import { render } from '@testing-library/react';
import { Context } from '../context';

Object.defineProperties(global.navigator, {
  userAgent: {
    get() {
      return 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
    },
  },
});

const { HighlightValue } = require('./highlight_value');

it('does not include the hidden text with IE', () => {
  const spy = jest.fn(() => ['f', ['o'], 'o']);

  const { container } = render((
    <Context.Provider value={{ search: 'foo', props: {}, test: 'bar' }}>
      <HighlightValue highlight={spy} foe="fee" search="fee">
        foo
      </HighlightValue>
    </Context.Provider>
  ));

  expect(container).toContainHTML('<div>f<mark>o</mark>o</div>');
});
