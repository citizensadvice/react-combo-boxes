import { layoutMaxHeight } from './layout_max_height';

let container;
let listbox;
let input;

beforeEach(() => {
  container = document.createElement('section');
  document.body.appendChild(container);

  listbox = document.createElement('div');
  container.appendChild(listbox);

  input = document.createElement('input');
  document.body.appendChild(input);
});

afterEach(() => {
  container.remove();
  listbox.remove();
  input.remove();
});

it('sets the max height at so the element is not larger than the body', () => {
  jest
    .spyOn(document.body, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest
    .spyOn(document.documentElement, 'clientHeight', 'get')
    .mockImplementation(() => 120);
  jest
    .spyOn(listbox, 'getBoundingClientRect')
    .mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight({ listbox, input });

  expect(listbox).toHaveStyle({ 'max-height': '50px' });
  expect(listbox).not.toHaveAttribute('data-orientation');
});

it('sets the max height at so the element is not larger than a custom element', () => {
  jest
    .spyOn(document.body, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 150 }));
  jest
    .spyOn(container, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest
    .spyOn(document.documentElement, 'clientHeight', 'get')
    .mockImplementation(() => 125);
  jest
    .spyOn(listbox, 'getBoundingClientRect')
    .mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight({ listbox, input }, { contain: 'section' });

  expect(listbox).toHaveStyle({ 'max-height': '50px' });
});

it('sets the max height taking account of scrollbars', () => {
  jest
    .spyOn(document.body, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 150 }));
  jest
    .spyOn(container, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 100, height: 100 }));
  jest.spyOn(container, 'clientHeight', 'get').mockImplementation(() => 70);
  jest.spyOn(container, 'clientTop', 'get').mockImplementation(() => 10);
  jest
    .spyOn(document.documentElement, 'clientHeight', 'get')
    .mockImplementation(() => 125);
  jest
    .spyOn(listbox, 'getBoundingClientRect')
    .mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight({ listbox, input }, { contain: 'section' });

  expect(listbox).toHaveStyle({ 'max-height': '30px' });
});

it('sets the max height at so the element is not larger than the viewport', () => {
  jest
    .spyOn(document.body, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest
    .spyOn(document.documentElement, 'clientHeight', 'get')
    .mockImplementation(() => 90);
  jest
    .spyOn(listbox, 'getBoundingClientRect')
    .mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight({ listbox, input });

  expect(listbox).toHaveStyle({ 'max-height': '40px' });
});

it('does not set a negative max-height', () => {
  jest
    .spyOn(document.body, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest
    .spyOn(document.documentElement, 'clientHeight', 'get')
    .mockImplementation(() => 125);
  jest
    .spyOn(listbox, 'getBoundingClientRect')
    .mockImplementation(() => ({ top: 130 }));

  layoutMaxHeight({ listbox, input });

  expect(listbox).toHaveStyle({ 'max-height': '' });
});

it('does not set less than a minMaxHeight', () => {
  jest
    .spyOn(document.body, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest
    .spyOn(document.documentElement, 'clientHeight', 'get')
    .mockImplementation(() => 90);
  jest
    .spyOn(listbox, 'getBoundingClientRect')
    .mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight({ listbox, input }, { minMaxHeight: 50 });

  expect(listbox).toHaveStyle({ 'max-height': '50px' });
});

it('subtracts the bottom margin from the maxheight', () => {
  listbox.style.setProperty('margin-bottom', '15px');

  jest
    .spyOn(document.body, 'getBoundingClientRect')
    .mockImplementation(() => ({ bottom: 100, height: 0 }));
  jest
    .spyOn(document.documentElement, 'clientHeight', 'get')
    .mockImplementation(() => 120);
  jest
    .spyOn(listbox, 'getBoundingClientRect')
    .mockImplementation(() => ({ top: 50 }));

  layoutMaxHeight({ listbox, input });

  expect(listbox).toHaveStyle({ 'max-height': '35px' });
});

describe('when box-sizing border-box', () => {
  it('does not subtract the border and padding', () => {
    listbox.style.setProperty('box-sizing', 'border-box');
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border-height', '1px');

    jest
      .spyOn(document.body, 'getBoundingClientRect')
      .mockImplementation(() => ({ bottom: 100, height: 0 }));
    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => 120);
    jest
      .spyOn(listbox, 'getBoundingClientRect')
      .mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight({ listbox, input });

    expect(listbox).toHaveStyle({ 'max-height': '50px' });
  });
});

describe('when box-sizing content-box', () => {
  it('subtracts the border and padding', () => {
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border', '1px solid black');

    jest
      .spyOn(document.body, 'getBoundingClientRect')
      .mockImplementation(() => ({ bottom: 100, height: 0 }));
    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => 120);
    jest
      .spyOn(listbox, 'getBoundingClientRect')
      .mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight({ listbox, input });

    expect(listbox).toHaveStyle({ 'max-height': '28px' });
  });
});

describe('when contain is null', () => {
  it('uses the window height only', () => {
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border', '1px solid black');

    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => 120);
    jest
      .spyOn(listbox, 'getBoundingClientRect')
      .mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight({ listbox, input }, { contain: null });

    expect(listbox).toHaveStyle({ 'max-height': '48px' });
  });
});

describe('when contain does not find an element', () => {
  it('uses the window height only', () => {
    listbox.style.setProperty('padding', '10px');
    listbox.style.setProperty('border', '1px solid black');

    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => 120);
    jest
      .spyOn(listbox, 'getBoundingClientRect')
      .mockImplementation(() => ({ top: 50 }));

    layoutMaxHeight({ listbox, input }, { contain: '.foo' });

    expect(listbox).toHaveStyle({ 'max-height': '48px' });
  });
});

describe('when there is insufficent space for the list box', () => {
  it('moves the listbox above', () => {
    jest
      .spyOn(document.body, 'getBoundingClientRect')
      .mockImplementation(() => ({ height: 150, bottom: 150, top: 0 }));
    jest
      .spyOn(document.body, 'clientHeight', 'get')
      .mockImplementation(() => 140);
    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => 125);
    jest
      .spyOn(listbox, 'getBoundingClientRect')
      .mockImplementation(() => ({ top: 50, height: 50 }));
    jest
      .spyOn(input, 'getBoundingClientRect')
      .mockImplementation(() => ({ bottom: 120, top: 100 }));

    layoutMaxHeight({ listbox, input });

    expect(listbox).toHaveAttribute('data-orientation', 'top');
    expect(listbox).toHaveStyle({ 'max-height': '100px' });
  });

  describe('when contained', () => {
    it('sets the max height correctly', () => {
      jest
        .spyOn(document.body, 'getBoundingClientRect')
        .mockImplementation(() => ({ bottom: 150 }));
      jest
        .spyOn(document.documentElement, 'clientHeight', 'get')
        .mockImplementation(() => 125);
      jest
        .spyOn(container, 'getBoundingClientRect')
        .mockImplementation(() => ({ top: 10, bottom: 100, height: 0 }));
      jest
        .spyOn(listbox, 'getBoundingClientRect')
        .mockImplementation(() => ({ top: 50, height: 50 }));
      jest
        .spyOn(input, 'getBoundingClientRect')
        .mockImplementation(() => ({ bottom: 120, top: 100 }));

      layoutMaxHeight({ listbox, input }, { contain: 'section' });

      expect(listbox).toHaveAttribute('data-orientation', 'top');
      expect(listbox).toHaveStyle({ 'max-height': '90px' });
    });
  });

  describe('when allowReposition is false', () => {
    it('does not move the listbox above', () => {
      jest
        .spyOn(document.body, 'getBoundingClientRect')
        .mockImplementation(() => ({ height: 150, bottom: 150, top: 0 }));
      jest
        .spyOn(document.body, 'clientHeight', 'get')
        .mockImplementation(() => 140);
      jest
        .spyOn(document.documentElement, 'clientHeight', 'get')
        .mockImplementation(() => 125);
      jest
        .spyOn(listbox, 'getBoundingClientRect')
        .mockImplementation(() => ({ top: 50, height: 50 }));
      jest
        .spyOn(input, 'getBoundingClientRect')
        .mockImplementation(() => ({ bottom: 120, top: 100 }));

      layoutMaxHeight({ listbox, input }, { allowReposition: false });

      expect(listbox).not.toHaveAttribute('data-orientation');
      expect(listbox).toHaveStyle({ 'max-height': '75px' });
    });
  });
});
