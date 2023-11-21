/* eslint-disable global-require */

beforeEach(() => {
  jest.resetModules();
});

it('is true for an Apple product platform', () => {
  jest
    .spyOn(navigator, 'vendor', 'get')
    .mockImplementation(() => 'Apple Computer, Inc.');
  const { isSafari } = require('./is_safari');
  expect(isSafari()).toEqual(true);
});

it('is false for a Google platform', () => {
  jest
    .spyOn(navigator, 'vendor', 'get')
    .mockImplementation(() => 'Google Inc.');
  const { isSafari } = require('./is_safari');
  expect(isSafari()).toEqual(false);
});

it('is false for a Mozilla platform', () => {
  jest.spyOn(navigator, 'vendor', 'get').mockImplementation(() => '');
  const { isSafari } = require('./is_safari');
  expect(isSafari()).toEqual(false);
});

it('caches the value', () => {
  jest
    .spyOn(navigator, 'vendor', 'get')
    .mockImplementation(() => 'Apple Computer, Inc.');
  const { isSafari } = require('./is_safari');
  expect(isSafari()).toEqual(true);
  jest.spyOn(navigator, 'vendor', 'get').mockImplementation(() => '');
  expect(isSafari()).toEqual(true);
});
