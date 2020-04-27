import React from 'react';
import { render } from '@testing-library/react';
import { PreHighlight } from './pre_highlight';
import { Context } from '../../context';

function TestHighlight({ children, inverse, ...props }) {
  return (
    <Context.Provider value={{ ...props, props: { value: null } }}>
      <PreHighlight start="<em>" end="</em>" inverse={inverse}>
        {children}
      </PreHighlight>
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

it('converts <em> in html strings to a highlight', () => {
  const { container } = render((
    <TestHighlight search="bar">
      {'foo <em>bar</em> <em>foe</em>'}
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo <mark>bar</mark> <mark>foe</mark></div>');
});

it('inverses the highlight', () => {
  const { container } = render((
    <TestHighlight inverse search="bar">
      {'foo <em>bar</em> <em>foe</em>'}
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div><mark>foo </mark>bar<mark> </mark>foe</div>');
});
