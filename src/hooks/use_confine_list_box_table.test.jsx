import React from 'react';
import { render, act } from '@testing-library/react';
import { useConfineListBoxTable } from './use_confine_list_box_table';

/* eslint-disable jest-dom/prefer-to-have-style */

function Test({ selector, out }) {
  const [style, onLayoutListBox] = useConfineListBoxTable(selector);

  out.onLayoutListBox = onLayoutListBox; // eslint-disable-line no-param-reassign
  out.style = style; // eslint-disable-line no-param-reassign

  return null;
}

let child;
let listbox;

beforeEach(() => {
  listbox = document.createElement('div');
  child = document.createElement('div');
  document.body.appendChild(listbox);
  listbox.appendChild(child);
});

afterEach(() => {
  child.remove();
  listbox.remove();
});

describe('maxWidth', () => {
  it('adds maxWidth to the listbox', () => {
    const out = {};
    jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));

    render(<Test out={out} />);

    act(() => {
      out.onLayoutListBox({ expanded: true, listbox: child });
    });

    expect(out.style.maxWidth).toEqual('280px');
    expect(listbox.style.maxWidth).toEqual('280px');
  });
});

describe('maxHeight', () => {
  it('adds maxHeight if the listbox is too high', () => {
    const out = {};
    jest.spyOn(listbox, 'clientHeight', 'get').mockImplementation(() => 300);
    window.innerHeight = 500;
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 550, height: 320 }));

    render(<Test out={out} />);

    act(() => {
      out.onLayoutListBox({ expanded: true, listbox: child });
    });

    expect(out.style.maxHeight).toEqual('250px');
    expect(listbox.style.maxHeight).toEqual('250px');
  });
});
