/* eslint-disable global-require */

beforeEach(() => {
  jest.resetModules();
});

const agentIE11 = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
const agentEdge = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 Edg/86.0.622.56';

it('is true for ie11', () => {
  jest.spyOn(navigator, 'userAgent', 'get').mockImplementation(() => agentIE11);
  const { isIE } = require('./is_ie');
  expect(isIE()).toEqual(true);
});

it('is false for edge', () => {
  jest.spyOn(navigator, 'userAgent', 'get').mockImplementation(() => agentEdge);
  const { isIE } = require('./is_ie');
  expect(isIE()).toEqual(false);
});

it('caches the value', () => {
  jest.spyOn(navigator, 'userAgent', 'get').mockImplementation(() => agentIE11);
  const { isIE } = require('./is_ie');
  expect(isIE()).toEqual(true);
  jest.spyOn(navigator, 'userAgent', 'get').mockImplementation(() => agentEdge);
  expect(isIE()).toEqual(true);
});
