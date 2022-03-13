import { layoutMaxWidth } from './layout_max_width';

it('sets the max width at so the element is not larger than the body', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth(el);

  expect(el).toHaveStyle({ 'max-width': '50px' });
});

it('sets the max width at so the element is not larger than a custom element', () => {
  const container = document.createElement('section');
  document.body.appendChild(container);

  const el = document.createElement('div');
  container.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 150 }));
  jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth(el, { contain: 'section' });

  expect(el).toHaveStyle({ 'max-width': '50px' });
});

it('sets the max width taking account of scrollbars', () => {
  const container = document.createElement('section');
  document.body.appendChild(container);

  const el = document.createElement('div');
  container.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 150 }));
  jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 100 }));
  jest.spyOn(container, 'clientWidth', 'get').mockImplementation(() => 70);
  jest.spyOn(container, 'clientLeft', 'get').mockImplementation(() => 10);
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth(el, { contain: 'section' });

  expect(el).toHaveStyle({ 'max-width': '30px' });
});

it('sets the max width at so the element is not larger than the viewport', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 90);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth(el);

  expect(el).toHaveStyle({ 'max-width': '40px' });
});

it('does not set a negative max-width', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 125);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 130 }));

  layoutMaxWidth(el);

  expect(el).toHaveStyle({ 'max-width': '' });
});

it('does not set less than a minMaxWidth', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 90);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth(el, { minMaxWidth: 50 });

  expect(el).toHaveStyle({ 'max-width': '50px' });
});

it('subtracts the right margin from the maxwidth', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  el.style.setProperty('margin-right', '15px');

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth(el);

  expect(el).toHaveStyle({ 'max-width': '35px' });
});

describe('when box-sizing border-box', () => {
  it('does not subtract the border and padding', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.setProperty('box-sizing', 'border-box');
    el.style.setProperty('padding', '10px');
    el.style.setProperty('border-width', '1px');

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
    jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

    layoutMaxWidth(el);

    expect(el).toHaveStyle({ 'max-width': '50px' });
  });
});

describe('when box-sizing content-box', () => {
  it('subtracts the border and padding', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.setProperty('padding', '10px');
    el.style.setProperty('border-width', '1px');

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
    jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

    layoutMaxWidth(el);

    expect(el).toHaveStyle({ 'max-width': '28px' });
  });
});
