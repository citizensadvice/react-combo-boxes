import { render } from '@testing-library/react';
import { highlightValue } from './highlight_value';

it('calls the highlighter with the term, state and props', () => {
  const spy = jest.fn(() => []);

  highlightValue(spy)({ children: 'foo' }, { search: 'bar' }, { value: { label: 'foe' } });

  expect(spy).toHaveBeenCalledWith('foo', 'bar', {}, { search: 'bar' }, { value: { label: 'foe' } });
});

it('calls the highlighter without a term', () => {
  const spy = jest.fn(() => []);

  highlightValue(spy)({}, { search: 'bar' }, {});

  expect(spy).toHaveBeenCalledWith('', 'bar', {}, { search: 'bar' }, {});
});

it('calls the highlighter without a search', () => {
  const spy = jest.fn(() => []);

  highlightValue(spy)({}, {}, {});

  expect(spy).toHaveBeenCalledWith('', undefined, {}, {}, {});
});

it('calls the highlighter with the value label', () => {
  const spy = jest.fn(() => []);

  highlightValue(spy)({}, { search: '' }, { value: { label: 'foo' } }, {});

  expect(spy).toHaveBeenCalledWith('', 'foo', {}, { search: '' }, { value: { label: 'foo' } });
});

it('calls the highlighter with a custom search', () => {
  const spy = jest.fn(() => []);

  highlightValue(spy, { search: 'foe' })({}, { search: 'bar' }, { value: { label: 'foo' } });

  expect(spy).toHaveBeenCalledWith('', 'foe', {}, { search: 'bar' }, { value: { label: 'foo' } });
});

it('calls the highlighter with a blank custom search', () => {
  const spy = jest.fn(() => []);

  highlightValue(spy, { search: '' })({}, { search: 'bar' }, { value: { label: 'foo' } });

  expect(spy).toHaveBeenCalledWith('', '', {}, { search: 'bar' }, { value: { label: 'foo' } });
});

it('calls the highlighter with a custom options', () => {
  const spy = jest.fn(() => []);

  highlightValue(spy, { option: 1 })({ children: 'foo' }, { search: 'bar' }, {});

  expect(spy).toHaveBeenCalledWith('foo', 'bar', { option: 1 }, { search: 'bar' }, {});
});

it('renders the highlight with hidden text', () => {
  const spy = jest.fn(() => ['f', ['o'], 'o']);

  const { container } = render((
    highlightValue(spy)({ children: 'foo' }, { search: 'bar' }, {})
  ));

  expect(container).toContainHTML('<div><span>foo</span><span aria-hidden="true">f<mark>o</mark>o</span></div>');
});
