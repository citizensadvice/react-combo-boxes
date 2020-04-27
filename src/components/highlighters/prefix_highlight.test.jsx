import React from 'react';
import { render } from '@testing-library/react';
import { PrefixHighlight } from './prefix_highlight';
import { Context } from '../../context';

function TestHighlight({ children, inverse, value, ...props }) {
  return (
    <Context.Provider value={{ ...props, props: { value } }}>
      <PrefixHighlight inverse={inverse}>
        {children}
      </PrefixHighlight>
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
      foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo bar</div>');
});

it('highlights the first prefix', () => {
  const { container } = render((
    <TestHighlight search="bar">
      bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div><mark>bar</mark> foo bar</div>');
});

it('highlights existing value', () => {
  const { container } = render((
    <TestHighlight value={{ label: 'bar' }}>
      bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div><mark>bar</mark> foo bar</div>');
});

it('inverses the highlight', () => {
  const { container } = render((
    <TestHighlight search="bar" inverse>
      bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>bar<mark> foo bar</mark></div>');
});
