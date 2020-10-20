import React from 'react';
import { render } from '@testing-library/react';
import { TokenHighlight } from './token_highlight';
import { Context } from '../../context';

function TestHighlight({ children, value, inverse, ...props }) {
  return (
    <Context.Provider value={{ ...props, props: { value, visuallyHiddenClassName: 'sr-only' } }}>
      <TokenHighlight inverse={inverse}>
        {children}
      </TokenHighlight>
    </Context.Provider>
  );
}

it('does not highlight with no children', () => {
  const { container } = render((
    <TestHighlight search="bar" />
  ));

  expect(container).toContainHTML('<div></div>');
});

it('does not highlight with no search children', () => {
  const { container } = render((
    <TestHighlight search={null}>
      foo
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('does not highlight no match', () => {
  const { container } = render((
    <TestHighlight search="bar">
      foo foobar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo foobar</div>');
});

it('highlights all tokens', () => {
  const { container } = render((
    <TestHighlight search="bar">
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toMatchSnapshot();
});

it('highlights the start of tokens', () => {
  const { container } = render((
    <TestHighlight search="bar">
      &quot;barfoo&quot;
    </TestHighlight>
  ));

  expect(container).toMatchSnapshot();
});

it('highlights existing value', () => {
  const { container } = render((
    <TestHighlight value={{ label: 'bar' }}>
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toMatchSnapshot();
});

it('inverses the highlight', () => {
  const { container } = render((
    <TestHighlight search="bar" inverse>
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toMatchSnapshot();
});
