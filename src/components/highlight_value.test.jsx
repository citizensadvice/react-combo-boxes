import React from 'react';
import { render } from '@testing-library/react';
import { HighlightValue } from './highlight_value';
import { Context } from '../context';

it('calls highlight with a search', () => {
  const spy = jest.fn(() => []);

  render((
    <Context.Provider value={{ search: 'foo', props: {}, test: 'bar' }}>
      <HighlightValue highlight={spy} foe="fee">
        foo
      </HighlightValue>
    </Context.Provider>
  ));

  expect(spy).toHaveBeenCalledWith('foo', 'foo', { foe: 'fee' });
});

it('calls highlight with a value', () => {
  const spy = jest.fn(() => []);

  render((
    <Context.Provider value={{ search: '', props: { value: { label: 'foo' } }, test: 'bar' }}>
      <HighlightValue highlight={spy} foe="fee">
        foo
      </HighlightValue>
    </Context.Provider>
  ));

  expect(spy).toHaveBeenCalledWith(
    'foo',
    'foo',
    { foe: 'fee' },
  );
});

it('calls highlight with a custom search', () => {
  const spy = jest.fn(() => []);

  render((
    <Context.Provider value={{ search: 'foo', props: {}, test: 'bar' }}>
      <HighlightValue highlight={spy} foe="fee" search="fee">
        foo
      </HighlightValue>
    </Context.Provider>
  ));

  expect(spy).toHaveBeenCalledWith('foo', 'fee', { foe: 'fee' });
});
