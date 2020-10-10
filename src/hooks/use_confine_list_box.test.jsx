import React from 'react';
import { render, act } from '@testing-library/react';
import { useConfineListBox } from './use_confine_list_box';

/* eslint-disable jest-dom/prefer-to-have-style */

function Test({ selector, out }) {
  const [style, onLayoutListBox] = useConfineListBox(selector);

  out.onLayoutListBox = onLayoutListBox; // eslint-disable-line no-param-reassign
  out.style = style; // eslint-disable-line no-param-reassign

  return null;
}

let container;
let listbox;

beforeEach(() => {
  container = document.createElement('div');
  listbox = document.createElement('div');
  document.body.appendChild(container);
  container.appendChild(listbox);
});

afterEach(() => {
  container.remove();
  listbox.remove();
});

describe('maxWidth', () => {
  it('does not add maxWidth if not expanded', () => {
    const out = {};

    render(<Test out={out} />);

    act(() => {
      out.onLayoutListBox({ expanded: false, listbox });
    });

    expect(out.style.maxWidth).toEqual(undefined);
    expect(listbox.style.maxWidth).toEqual('');
  });

  it('adds maxWidth to the list box', () => {
    const out = {};
    jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));

    render(<Test out={out} />);

    act(() => {
      out.onLayoutListBox({ expanded: true, listbox });
    });

    expect(out.style.maxWidth).toEqual('280px');
    expect(listbox.style.maxWidth).toEqual('280px');
  });

  describe('with a selector', () => {
    it('adds maxWidth if the listbox', () => {
      const out = {};
      jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
      jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));
      jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 400 }));

      render(<Test out={out} selector="body > div" />);

      act(() => {
        out.onLayoutListBox({ expanded: true, listbox });
      });

      expect(out.style.maxWidth).toEqual('180px');
      expect(listbox.style.maxWidth).toEqual('180px');
    });
  });

  describe('with an invalid selector', () => {
    it('uses the body', () => {
      const out = {};
      jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
      jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));

      render(<Test out={out} selector="table" />);

      act(() => {
        out.onLayoutListBox({ expanded: true, listbox });
      });

      expect(out.style.maxWidth).toEqual('280px');
      expect(listbox.style.maxWidth).toEqual('280px');
    });
  });

  describe('with a margin', () => {
    it('adds maxWidth if the listbox', () => {
      const out = {};
      listbox.style.marginRight = '10px';
      jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
      jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));
      jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 400 }));

      render(<Test out={out} selector="body > div" />);

      act(() => {
        out.onLayoutListBox({ expanded: true, listbox });
      });

      expect(out.style.maxWidth).toEqual('170px');
      expect(listbox.style.maxWidth).toEqual('170px');
    });
  });
});

describe('maxHeight', () => {
  it('does not add maxHeight if not expanded', () => {
    const out = {};

    render(<Test out={out} />);

    act(() => {
      out.onLayoutListBox({ expanded: false, listbox });
    });

    expect(out.style.maxHeight).toEqual(undefined);
    expect(listbox.style.maxHeight).toEqual('');
  });

  it('does not add maxHeight if the listbox is not too high', () => {
    const out = {};
    jest.spyOn(listbox, 'clientHeight', 'get').mockImplementation(() => 320);
    window.innerHight = 500;
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 200, height: 300 }));

    render(<Test out={out} />);

    act(() => {
      out.onLayoutListBox({ expanded: true, listbox });
    });

    expect(out.style.maxHeight).toEqual('');
    expect(listbox.style.maxHeight).toEqual('');
  });

  it('adds maxHeight if the listbox is too high', () => {
    const out = {};
    jest.spyOn(listbox, 'clientHeight', 'get').mockImplementation(() => 300);
    window.innerHeight = 500;
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 550, height: 320 }));

    render(<Test out={out} />);

    act(() => {
      out.onLayoutListBox({ expanded: true, listbox });
    });

    expect(out.style.maxHeight).toEqual('250px');
    expect(listbox.style.maxHeight).toEqual('250px');
  });

  describe('with a margin', () => {
    it('adds maxHeight if the listbox is too high', () => {
      const out = {};
      listbox.style.marginBottom = '10px';
      jest.spyOn(listbox, 'clientHeight', 'get').mockImplementation(() => 300);
      window.innerHeight = 500;
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 550, height: 320 }));

      render(<Test out={out} />);

      act(() => {
        out.onLayoutListBox({ expanded: true, listbox });
      });

      expect(out.style.maxHeight).toEqual('240px');
      expect(listbox.style.maxHeight).toEqual('240px');
    });
  });
});
