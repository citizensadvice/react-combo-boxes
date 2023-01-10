import { layoutMaxWidth } from './layout_max_width';

it('sets the max width at so the element is not larger than the body', () => {
  const listbox = document.createElement('div');
  document.body.appendChild(listbox);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth({ listbox });

  expect(listbox).toHaveStyle({ 'max-width': '50px' });
});

it('sets the max width at so the element is not larger than a custom element', () => {
  const container = document.createElement('section');
  document.body.appendChild(container);

  const listbox = document.createElement('div');
  container.appendChild(listbox);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 150 }));
  jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth({ listbox }, { contain: 'section' });

  expect(listbox).toHaveStyle({ 'max-width': '50px' });
});

it('sets the max width taking account of scrollbars', () => {
  const container = document.createElement('section');
  document.body.appendChild(container);

  const listbox = document.createElement('div');
  container.appendChild(listbox);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 150 }));
  jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 100 }));
  jest.spyOn(container, 'clientWidth', 'get').mockImplementation(() => 70);
  jest.spyOn(container, 'clientLeft', 'get').mockImplementation(() => 10);
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth({ listbox }, { contain: 'section' });

  expect(listbox).toHaveStyle({ 'max-width': '30px' });
});

it('sets the max width at so the element is not larger than the viewport', () => {
  const listbox = document.createElement('div');
  document.body.appendChild(listbox);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 90);
  jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth({ listbox });

  expect(listbox).toHaveStyle({ 'max-width': '40px' });
});

it('does not set a negative max-width', () => {
  const listbox = document.createElement('div');
  document.body.appendChild(listbox);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 125);
  jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 130 }));

  layoutMaxWidth({ listbox });

  expect(listbox).toHaveStyle({ 'max-width': '' });
});

it('does not set less than a minMaxWidth', () => {
  const listbox = document.createElement('div');
  document.body.appendChild(listbox);

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 90);
  jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth({ listbox }, { minMaxWidth: 50 });

  expect(listbox).toHaveStyle({ 'max-width': '50px' });
});

it('subtracts the right margin from the maxwidth', () => {
  const listbox = document.createElement('div');
  document.body.appendChild(listbox);
  listbox.style.setProperty('margin-right', '15px');

  jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
  jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
  jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

  layoutMaxWidth({ listbox });

  expect(listbox).toHaveStyle({ 'max-width': '35px' });
});

describe('when box-sizing border-box', () => {
  it('does not subtract the border and padding', () => {
    const listbox = document.createElement('div');
    document.body.appendChild(listbox);
    listbox.style.setProperty('box-sizing', 'border-box');
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border-width', '1px');

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
    jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

    layoutMaxWidth({ listbox });

    expect(listbox).toHaveStyle({ 'max-width': '50px' });
  });
});

describe('when box-sizing content-box', () => {
  it('subtracts the border and padding', () => {
    const listbox = document.createElement('div');
    document.body.appendChild(listbox);
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border-width', '1px');

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 100, width: 0 }));
    jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

    layoutMaxWidth({ listbox });

    expect(listbox).toHaveStyle({ 'max-width': '28px' });
  });
});

describe('when contain is null', () => {
  it('uses the window width only', () => {
    const listbox = document.createElement('div');
    document.body.appendChild(listbox);
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border', '1px solid black');

    jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

    layoutMaxWidth({ listbox }, { contain: null });

    expect(listbox).toHaveStyle({ 'max-width': '48px' });
  });
});

describe('when contain does not find an element', () => {
  it('uses the window width only', () => {
    const listbox = document.createElement('div');
    document.body.appendChild(listbox);
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border', '1px solid black');

    jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 120);
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 50 }));

    layoutMaxWidth({ listbox }, { contain: '.foo' });

    expect(listbox).toHaveStyle({ 'max-width': '48px' });
  });
});
