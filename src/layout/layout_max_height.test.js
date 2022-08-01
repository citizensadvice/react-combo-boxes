import { layoutMaxHeight } from './layout_max_height';

it('sets the max height at so the element is not larger than the body', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 120);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight(el);

  expect(el).toHaveStyle({ 'max-height': '50px' });
});

it('sets the max height at so the element is not larger than a custom element', () => {
  const container = document.createElement('section');
  document.body.appendChild(container);

  const el = document.createElement('div');
  container.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 150 }));
  jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 125);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight(el, { contain: 'section' });

  expect(el).toHaveStyle({ 'max-height': '50px' });
});

it('sets the max height taking account of scrollbars', () => {
  const container = document.createElement('section');
  document.body.appendChild(container);

  const el = document.createElement('div');
  container.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 150 }));
  jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 100 }));
  jest.spyOn(container, 'clientHeight', 'get').mockImplementation(() => 70);
  jest.spyOn(container, 'clientTop', 'get').mockImplementation(() => 10);
  jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 125);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight(el, { contain: 'section' });

  expect(el).toHaveStyle({ 'max-height': '30px' });
});

it('sets the max height at so the element is not larger than the viewport', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 90);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight(el);

  expect(el).toHaveStyle({ 'max-height': '40px' });
});

it('does not set a negative max-height', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 125);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 130 }));

  layoutMaxHeight(el);

  expect(el).toHaveStyle({ 'max-height': '' });
});

it('does not set less than a minMaxHeight', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 90);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight(el, { minMaxHeight: 50 });

  expect(el).toHaveStyle({ 'max-height': '50px' });
});

it('subtracts the bottom margin from the maxheight', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  el.style.setProperty('margin-bottom', '15px');

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 120);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight(el);

  expect(el).toHaveStyle({ 'max-height': '35px' });
});

describe('when box-sizing border-box', () => {
  it('does not subtract the border and padding', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.setProperty('box-sizing', 'border-box');
    el.style.setProperty('padding', '10px');
    el.style.setProperty('border-height', '1px');

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
    jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 120);
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight(el);

    expect(el).toHaveStyle({ 'max-height': '50px' });
  });
});

describe('when box-sizing content-box', () => {
  it('subtracts the border and padding', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.setProperty('padding', '10px');
    el.style.setProperty('border', '1px solid black');

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 100, height: 0 }));
    jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 120);
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight(el);

    expect(el).toHaveStyle({ 'max-height': '28px' });
  });
});

describe('when contain is null', () => {
  it('uses the window height only', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.setProperty('padding', '10px');
    el.style.setProperty('border', '1px solid black');

    jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 120);
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight(el, { contain: null });

    expect(el).toHaveStyle({ 'max-height': '48px' });
  });
});

describe('when contain does not find an element', () => {
  it('uses the window height only', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.setProperty('padding', '10px');
    el.style.setProperty('border', '1px solid black');

    jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 120);
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight(el, { contain: '.foo' });

    expect(el).toHaveStyle({ 'max-height': '48px' });
  });
});
