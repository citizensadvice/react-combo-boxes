import { render, act } from '@testing-library/react';
import { LayoutListBox } from './layout_list_box';

let listboxRef;
let listbox;
let input;
let inputRef;
let container;

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
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
});

function Test(props) {
  return (
    <LayoutListBox {...props} listboxRef={listboxRef} inputRef={inputRef} />
  );
}

it('runs callback on layout callback', async () => {
  const spy = jest.fn();

  render(<Test options={['foo']} onLayoutListBox={spy} />);

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs multiple callbacks on layout callback', async () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();

  render(<Test options={['foo']} onLayoutListBox={[spy1, spy2]} />);

  expect(spy1).toHaveBeenCalledWith({ listbox, input });
  expect(spy2).toHaveBeenCalledWith({ listbox, input });
});

it('does not run callback if options are unchanged', async () => {
  const spy = jest.fn();
  const options = ['foo'];

  const { rerender } = render(
    <Test options={options} onLayoutListBox={spy} />,
  );

  spy.mockClear();

  rerender(<Test options={options} onLayoutListBox={spy} />);

  expect(spy).not.toHaveBeenCalled();
});

it('runs callback if options change', async () => {
  const spy = jest.fn();

  const { rerender } = render(<Test options={['foo']} onLayoutListBox={spy} />);

  spy.mockClear();

  rerender(<Test options={['bar']} onLayoutListBox={spy} />);

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs callback on resize', async () => {
  const spy = jest.fn();

  render(<Test options={['foo']} onLayoutListBox={spy} />);

  spy.mockClear();

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs helpers on scroll', async () => {
  const spy = jest.fn();

  render(<Test options={['foo']} onLayoutListBox={spy} />);

  spy.mockClear();

  act(() => {
    document.dispatchEvent(new Event('scroll'));
  });

  expect(spy).toHaveBeenCalledWith({ listbox, input });
});

it('runs helpers if scrolling a parent', async () => {
  const spy = jest.fn();

  render(<Test options={['foo']} onLayoutListBox={spy} />);

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

  render(<Test options={['foo']} onLayoutListBox={spy} />);

  spy.mockClear();

  act(() => {
    other.dispatchEvent(new Event('scroll'));
  });

  expect(spy).not.toHaveBeenCalled();
});
