import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
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

function expectToBeOpen(combobox) {
  expect(combobox).toHaveFocus();
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toBeVisible();
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveFocusedOption(combobox, option) {
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveFocus();
}

const options = ['Apple', 'Banana', 'Orange'];

describe('with an open list box', () => {
  it('moves to the first option with the home key', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={options} />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    fireEvent.keyDown(document.activeElement, { key: 'Home' });
    expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Apple' }));
  });

  it('moves to the last option with the end key', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={options} />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'End' });
    expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Orange' }));
  });

  describe('with a selected option', () => {
    describe('pressing Ctrl+d', () => {
      it('moves focus back to the list box removing the selected option', () => {
        const { getByRole } = render((
          <ComboBoxWrapper options={options} />
        ));
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'd', ctrlKey: true });
        expectToBeOpen(getByRole('combobox'));
      });
    });

    describe('pressing Ctrl+k', () => {
      it('moves focus back to the list box removing the selected option', () => {
        const { getByRole } = render((
          <ComboBoxWrapper options={options} />
        ));
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'k', ctrlKey: true });
        expectToBeOpen(getByRole('combobox'));
      });
    });
  });

  describe('with a custom skipOption', () => {
    it('allows options to be skipped pressing home', () => {
      function skipOption(option) {
        return option.label === 'Apple';
      }
      const { getByRole } = render(
        <ComboBoxWrapper options={options} skipOption={skipOption} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'Home' });
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });

    it('allows options to be skipped pressing end', () => {
      function skipOption(option) {
        return option.label === 'Orange';
      }
      const { getByRole } = render(
        <ComboBoxWrapper options={options} skipOption={skipOption} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'End' });
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });
  });
});

describe('with a closed list box', () => {
  describe('pressing the Home key', () => {
    it('does not change the option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      fireEvent.keyDown(document.activeElement, { key: 'Home' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });
  });

  describe('pressing the End key', () => {
    it('does not change the option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      fireEvent.keyDown(document.activeElement, { key: 'End' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });
  });
});

describe('autoselect is true', () => {
  describe('backspace', () => {
    describe('ctrl+d', () => {
      it('does not auto-select an option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'fo');
        fireEvent.keyDown(getByRole('combobox'), { key: 'd', ctrlKey: true });
        expectToBeOpen(getByRole('combobox'));
      });
    });

    describe('delete', () => {
      describe('ctrl+h', () => {
        it('does not auto-select an option', async () => {
          const { getByRole } = render(
            <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
          );
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          fireEvent.keyDown(getByRole('combobox'), { key: 'h', ctrlKey: true });
          fireEvent.change(getByRole('combobox'), { target: { value: 'fo' } });
          expectToBeOpen(getByRole('combobox'));
        });
      });

      describe('ctrl+k', () => {
        it('does not auto-select an option', async () => {
          const { getByRole } = render(
            <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
          );
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          fireEvent.keyDown(getByRole('combobox'), { key: 'k', ctrlKey: true });
          fireEvent.change(getByRole('combobox'), { target: { value: 'fo' } });
          expectToBeOpen(getByRole('combobox'));
        });
      });
    });
  });
});
