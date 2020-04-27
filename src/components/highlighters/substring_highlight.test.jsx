import React from 'react';
import { render } from '@testing-library/react';
import { SubstringHighlight } from './substring_highlight';
import { Context } from '../../context';

function TestHighlight({ children, value, inverse, ...props }) {
  return (
    <Context.Provider value={{ ...props, props: { value } }}>
      <SubstringHighlight inverse={inverse}>
        {children}
      </SubstringHighlight>
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
      foo
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('highlights a substring', () => {
  const { container } = render((
    <TestHighlight search="bar">
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo <mark>bar</mark> foo bar</div>');
});

it('highlights an existing value substring', () => {
  const { container } = render((
    <TestHighlight value={{ label: 'bar' }}>
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo <mark>bar</mark> foo bar</div>');
});

it('inverses the highlight', () => {
  const { container } = render((
    <TestHighlight search="bar" inverse>
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div><mark>foo </mark>bar<mark> foo bar</mark></div>');
});
