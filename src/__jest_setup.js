import '@testing-library/jest-dom';

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
