import { renderHook, act, waitFor } from '@testing-library/react';
import { useLayoutListBox } from './use_layout_list_box';

it('runs helpers on layout callback', async () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  const listbox = Symbol('lisbox');

  const { result } = renderHook(() => useLayoutListBox(spy1, spy2));

  expect(spy1).not.toHaveBeenCalled();
  expect(spy2).not.toHaveBeenCalled();

  // Test not called when collapsed
  act(() => {
    result.current({ expanded: false, listbox });
  });

  expect(spy1).not.toHaveBeenCalled();
  expect(spy2).not.toHaveBeenCalled();

  // Test called when expanded
  act(() => {
    result.current({ expanded: true, listbox });
  });

  await waitFor(() => {
    expect(spy1).toHaveBeenCalledWith(listbox);
  });
  expect(spy2).toHaveBeenCalledWith(listbox);
});

it('runs helpers on resize', async () => {
  const spy = jest.fn();
  const listbox = Symbol('lisbox');

  const { result } = renderHook(() => useLayoutListBox(spy));

  expect(spy).not.toHaveBeenCalled();

  act(() => {
    result.current({ expanded: true, listbox });
  });

  await waitFor(() => {
    expect(spy).toHaveBeenCalledWith(listbox);
  });

  spy.mockClear();

  window.dispatchEvent(new Event('resize'));

  await waitFor(() => {
    expect(spy).toHaveBeenCalledWith(listbox);
  });
});

it('runs helpers on scroll', async () => {
  const spy = jest.fn();
  const listbox = Symbol('lisbox');

  const { result } = renderHook(() => useLayoutListBox(spy));

  expect(spy).not.toHaveBeenCalled();

  act(() => {
    result.current({ expanded: true, listbox });
  });

  await waitFor(() => {
    expect(spy).toHaveBeenCalledWith(listbox);
  });

  spy.mockClear();

  window.dispatchEvent(new Event('scroll'));

  await waitFor(() => {
    expect(spy).toHaveBeenCalledWith(listbox);
  });
});
