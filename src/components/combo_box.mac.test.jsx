/* eslint-disable testing-library/no-node-access */

import React, { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

Object.defineProperties(global.navigator, {
  platform: {
    get() {
      return 'MacIntel';
    },
  },
});

const { ComboBox } = require('./combo_box');

function ComboBoxWrapper(props) {
  const [value, onValue] = useState(null);
  return (
    <ComboBox
      id="id"
      aria-labelledby="id-label"
      value={value}
      onValue={onValue}
      {...props}
    />
  );
}

function expectToBeOpen() {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(combobox).toHaveFocus();
  expect(listbox).toBeVisible();
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveFocusedOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveFocus();
}

const options = ['Apple', 'Banana', 'Orange'];

describe('with an open list box', () => {
  it('moves to the first option with the home key', () => {
    render(<ComboBoxWrapper options={options} />);
    const combobox = screen.getByRole('combobox');
    combobox.focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    fireEvent.keyDown(document.activeElement, { key: 'Home' });
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
  });

  it('moves to the last option with the end key', () => {
    render(<ComboBoxWrapper options={options} />);
    screen.getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'End' });
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
  });

  describe('with a selected option', () => {
    describe('pressing Ctrl+d', () => {
      it('moves focus back to the list box removing the selected option', () => {
        render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'd', ctrlKey: true });
        expectToBeOpen();
      });
    });

    describe('pressing Ctrl+k', () => {
      it('moves focus back to the list box removing the selected option', () => {
        render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'k', ctrlKey: true });
        expectToBeOpen();
      });
    });
  });

  describe('with a custom skipOption', () => {
    it('allows options to be skipped pressing home', () => {
      function skipOption(option) {
        return option.label === 'Apple';
      }
      render(<ComboBoxWrapper options={options} skipOption={skipOption} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'Home' });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('allows options to be skipped pressing end', () => {
      function skipOption(option) {
        return option.label === 'Orange';
      }
      render(<ComboBoxWrapper options={options} skipOption={skipOption} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'End' });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });
  });
});

describe('with a closed list box', () => {
  describe('pressing the Home key', () => {
    it('does not change the option', () => {
      render(<ComboBoxWrapper options={options} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      fireEvent.keyDown(document.activeElement, { key: 'Home' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });
  });

  describe('pressing the End key', () => {
    it('does not change the option', () => {
      render(<ComboBoxWrapper options={options} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      fireEvent.keyDown(document.activeElement, { key: 'End' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });
  });
});

describe('autoselect is true', () => {
  describe('backspace', () => {
    describe('ctrl+d', () => {
      it('does not auto-select an option', async () => {
        render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'fo');
        fireEvent.keyDown(screen.getByRole('combobox'), { key: 'd', ctrlKey: true });
        expectToBeOpen();
      });
    });

    describe('delete', () => {
      describe('ctrl+h', () => {
        it('does not auto-select an option', async () => {
          render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          fireEvent.keyDown(screen.getByRole('combobox'), { key: 'h', ctrlKey: true });
          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fo' } });
          expectToBeOpen();
        });
      });

      describe('ctrl+k', () => {
        it('does not auto-select an option', async () => {
          render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          fireEvent.keyDown(screen.getByRole('combobox'), { key: 'k', ctrlKey: true });
          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fo' } });
          expectToBeOpen();
        });
      });
    });
  });
});
