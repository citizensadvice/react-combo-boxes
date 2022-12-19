import { act, render, waitFor } from '@testing-library/react';

import { collectLiveMessages } from '../__collect_aria_live_messages';
import { AriaLiveMessage } from './aria_live_message';

function Test(props) {
  return (
    <AriaLiveMessage {...props} />
  );
}

Test.defaultProps = {
  showListBox: false,
  showNotFound: false,
  visuallyHiddenClassName: 'sr-only',
  notFoundMessage: () => 'No results found',
  foundOptionsMessage: (options) => (
    `${options.length} result${options.length > 1 ? 's are' : ' is'} available`
  ),
  selectedOptionMessage: (option, options) => (
    `${option.label} ${option.index + 1} of ${options.length} is highlighted`
  ),
};

it('generates a live not found message', async () => {
  jest.useFakeTimers();

  const { getMessages } = collectLiveMessages();
  const { rerender } = render(<Test />);

  rerender(<Test showNotFound />);

  act(() => {
    jest.advanceTimersByTime(1400);
  });

  expect(await getMessages()).toEqual(['No results found']);
});

it('generates a live found message for a single option', async () => {
  jest.useFakeTimers();

  const { getMessages } = collectLiveMessages();
  const { rerender } = render(<Test />);

  rerender(<Test options={['Apple']} showListBox />);

  act(() => {
    jest.advanceTimersByTime(1400);
  });

  expect(await getMessages()).toEqual(['1 result is available']);
});

it('generates a live found message for multiple options', async () => {
  jest.useFakeTimers();

  const { getMessages } = collectLiveMessages();
  const { rerender } = render(<Test />);

  rerender(<Test options={['Apple', 'Banana']} showListBox />);

  act(() => {
    jest.advanceTimersByTime(1400);
  });

  expect(await getMessages()).toEqual(['2 results are available']);
});

it('generates a live found message for focused options', async () => {
  jest.useFakeTimers();

  const { getMessages } = collectLiveMessages();
  const { rerender } = render(<Test />);

  rerender(<Test options={['Apple', 'Banana']} showListBox focusedOption={{ index: 0, label: 'Apple' }} />);

  act(() => {
    jest.advanceTimersByTime(1400);
  });

  expect(await getMessages()).toEqual(['2 results are available, Apple 1 of 2 is highlighted']);
});

it('debounces updating the message', async () => {
  jest.useFakeTimers();

  const { getMessages } = collectLiveMessages();
  const { rerender } = render(<Test />);

  rerender(<Test options={['Apple']} showListBox />);

  act(() => {
    jest.advanceTimersByTime(500);
  });

  rerender(<Test options={['Apple', 'Banana']} showListBox />);

  act(() => {
    jest.advanceTimersByTime(1400);
  });

  expect(await getMessages()).toEqual(['2 results are available']);

  rerender(<Test showNotFound />);

  act(() => {
    jest.advanceTimersByTime(1400);
  });

  expect(await getMessages()).toEqual(['2 results are available', 'No results found']);
});
