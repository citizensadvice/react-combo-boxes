import '@testing-library/jest-dom';

// Fix broken jsdom has focus https://github.com/jsdom/jsdom/issues/3794
Object.defineProperty(document, 'hasFocus', {
  writeable: true,
  configurable: true,
  enumerable: true,
  value() {
    return !!this.activeElement;
  },
});

beforeEach(() => {
  expect.hasAssertions();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

let errorSpy;
let warnSpy;

beforeEach(() => {
  errorSpy = jest.spyOn(console, 'error');
  warnSpy = jest.spyOn(console, 'warn');
});

afterEach(() => {
  // Guard allows hasAssertions to work
  if (errorSpy.mock.calls.length) {
    expect(errorSpy).not.toHaveBeenCalled();
  }
  errorSpy = null;

  if (warnSpy.mock.calls.length) {
    expect(warnSpy).not.toHaveBeenCalled();
  }
  warnSpy = null;
});
