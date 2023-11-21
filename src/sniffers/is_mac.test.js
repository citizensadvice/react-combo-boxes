beforeEach(() => {
  jest.resetModules();
});

it('is true for a mac platform', () => {
  jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
  const { isMac } = require('./is_mac');
  expect(isMac()).toEqual(true);
});

it('is true for the iphone platform', () => {
  jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'iPhone');
  const { isMac } = require('./is_mac');
  expect(isMac()).toEqual(true);
});

it('is true for the ipad platform', () => {
  jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'iPad');
  const { isMac } = require('./is_mac');
  expect(isMac()).toEqual(true);
});

it('is true for the ipod platform', () => {
  jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'iPod');
  const { isMac } = require('./is_mac');
  expect(isMac()).toEqual(true);
});

it('is false for windows', () => {
  jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'Win32');
  const { isMac } = require('./is_mac');
  expect(isMac()).toEqual(false);
});

it('caches the value', () => {
  jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
  const { isMac } = require('./is_mac');
  expect(isMac()).toEqual(true);
  jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'Win32');
  expect(isMac()).toEqual(true);
});
