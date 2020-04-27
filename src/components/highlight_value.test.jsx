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

  expect(spy).toHaveBeenCalledWith('foo', 'foo', { search: 'foo', test: 'bar', props: {} }, { foe: 'fee' });
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
    {
      search: '',
      test: 'bar',
      props: { value: { label: 'foo' } },
    },
    { foe: 'fee' },
  );
});
