import { render, act } from '@testing-library/react';
import { LayoutListBox } from './layout_list_box';

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
});

it('runs callback on layout callback', async () => {
  const spy = jest.fn();
  const listbox = document.createElement('div');
  const ref = { current: listbox };

  render(<LayoutListBox options={['foo']} onLayoutListBox={spy} listBoxRef={ref} />);

  expect(spy).toHaveBeenCalledWith(listbox);
});

it('runs multiple callbacks on layout callback', async () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  const listbox = document.createElement('div');
  const ref = { current: listbox };

  render(<LayoutListBox options={['foo']} onLayoutListBox={[spy1, spy2]} listBoxRef={ref} />);

  expect(spy1).toHaveBeenCalledWith(listbox);
  expect(spy2).toHaveBeenCalledWith(listbox);
});

it('does not run callback if options are unchanged', async () => {
  const spy = jest.fn();
  const listbox = document.createElement('div');
  const ref = { current: listbox };
  const options = ['foo'];

  const { rerender } = render(
    <LayoutListBox options={options} onLayoutListBox={spy} listBoxRef={ref} />,
  );

  spy.mockClear();

  rerender(<LayoutListBox options={options} onLayoutListBox={spy} listBoxRef={ref} />);

  expect(spy).not.toHaveBeenCalled();
});

it('runs callback if options change', async () => {
  const spy = jest.fn();
  const listbox = document.createElement('div');
  const ref = { current: listbox };

  const { rerender } = render(<LayoutListBox options={['foo']} onLayoutListBox={spy} listBoxRef={ref} />);

  spy.mockClear();

  rerender(<LayoutListBox options={['bar']} onLayoutListBox={spy} listBoxRef={ref} />);

  expect(spy).toHaveBeenCalledWith(listbox);
});

it('runs callback on resize', async () => {
  const spy = jest.fn();
  const listbox = document.createElement('div');
  const ref = { current: listbox };

  render(<LayoutListBox options={['foo']} onLayoutListBox={spy} listBoxRef={ref} />);

  spy.mockClear();

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

  expect(spy).toHaveBeenCalledWith(listbox);
});

it('runs helpers on scroll', async () => {
  const spy = jest.fn();
  const listbox = document.createElement('div');
  const ref = { current: listbox };

  render(<LayoutListBox options={['foo']} onLayoutListBox={spy} listBoxRef={ref} />);

  spy.mockClear();

  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(spy).toHaveBeenCalledWith(listbox);
});
