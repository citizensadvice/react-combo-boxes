import { renderHook, act } from '@testing-library/react';
import { useLayoutListBox } from './use_layout_list_box';

let listboxRef;
let listbox;
let input;
let inputRef;
let container;
let requestAnimationFrameSpy;

beforeAll(() => {
  listbox = document.createElement('div');
  container = document.createElement('div');
  container.appendChild(listbox);
  document.body.appendChild(container);
  listboxRef = { current: listbox };
  input = document.createElement('div');
  inputRef = { current: input };
});

beforeEach(() => {
  requestAnimationFrameSpy = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((cb) => cb());
});

it('does nothing is onLayoutListBox is unset', async () => {
  renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options: ['foo'],
      listboxRef,
      inputRef,
    }),
  );

  expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
});

it('runs callback on layout callback', async () => {
  const spy = jest.fn();

  renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options: ['foo'],
      onLayoutListBox: spy,
      listboxRef,
      inputRef,
    }),
  );

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs multiple callbacks on layout callback', async () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();

  renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options: ['foo'],
      onLayoutListBox: [spy1, spy2],
      listboxRef,
      inputRef,
    }),
  );

  expect(spy1).toHaveBeenCalledWith({ listbox, input });
  expect(spy2).toHaveBeenCalledWith({ listbox, input });
});

it('does not run callback if options are unchanged', async () => {
  const spy = jest.fn();
  const options = ['foo'];

  const { rerender } = renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options,
      onLayoutListBox: spy,
      listboxRef,
      inputRef,
    }),
  );

  spy.mockClear();

  rerender();

  expect(spy).not.toHaveBeenCalled();
});

it('runs callback if options change', async () => {
  const spy = jest.fn();

  const { rerender } = renderHook(
    ({ options }) =>
      useLayoutListBox({
        showListBox: true,
        options,
        onLayoutListBox: spy,
        listboxRef,
        inputRef,
      }),
    { initialProps: { options: ['foo'] } },
  );

  spy.mockClear();

  rerender({ options: 'bar' });

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs callback on resize', async () => {
  const spy = jest.fn();

  renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options: ['foo'],
      onLayoutListBox: spy,
      listboxRef,
      inputRef,
    }),
  );

  spy.mockClear();

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs helpers on scroll', async () => {
  const spy = jest.fn();

  renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options: ['foo'],
      onLayoutListBox: spy,
      listboxRef,
      inputRef,
    }),
  );

  spy.mockClear();

  act(() => {
    document.dispatchEvent(new Event('scroll'));
  });

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs helpers if scrolling a parent', async () => {
  const spy = jest.fn();

  renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options: ['foo'],
      onLayoutListBox: spy,
      listboxRef,
      inputRef,
    }),
  );

  spy.mockClear();

  act(() => {
    container.dispatchEvent(new Event('scroll'));
  });

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('does not run helpers if scrolling not a parent', async () => {
  const spy = jest.fn();
  const other = document.createElement('div');
  document.body.appendChild(other);

  renderHook(() =>
    useLayoutListBox({
      showListBox: true,
      options: ['foo'],
      onLayoutListBox: spy,
      listboxRef,
      inputRef,
    }),
  );

  spy.mockClear();

  act(() => {
    other.dispatchEvent(new Event('scroll'));
  });

  expect(spy).not.toHaveBeenCalled();
});

it('runs the callback when showListBox changes', async () => {
  const spy = jest.fn();

  renderHook(() =>
    useLayoutListBox({
      showListBox: false,
      options: ['foo'],
      onLayoutListBox: spy,
      listboxRef,
      inputRef,
    }),
  );

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});
