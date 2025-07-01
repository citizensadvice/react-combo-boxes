import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

Object.defineProperties(globalThis.navigator, {
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
  // and focused with no selected or focused option
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveFocus();
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveActiveOption(option) {
  // Option is selected and the activedescendant
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(combobox).toHaveFocus();
}

const options = ['Apple', 'Banana', 'Orange'];

describe('with an open list box', () => {
  it('moves to the first option with the Home key', async () => {
    render(<ComboBoxWrapper options={options} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowUp}{Home}');
    expectToHaveActiveOption(screen.getByRole('option', { name: 'Apple' }));
  });

  it('moves to the last option with the End key', async () => {
    render(<ComboBoxWrapper options={options} />);
    await userEvent.tab();
    await userEvent.keyboard('{End}');
    expectToHaveActiveOption(screen.getByRole('option', { name: 'Orange' }));
  });

  describe('with a custom skipOption', () => {
    it('allows options to be skipped pressing HOME', async () => {
      function skipOption(option) {
        return option.label === 'Apple';
      }
      render(
        <ComboBoxWrapper
          options={options}
          skipOption={skipOption}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{Home}');
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('allows options to be skipped pressing END', async () => {
      function skipOption(option) {
        return option.label === 'Orange';
      }
      render(
        <ComboBoxWrapper
          options={options}
          skipOption={skipOption}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{End}');
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });
  });
});

describe('with a closed list box', () => {
  describe('pressing the Home key', () => {
    it('does not change the option', async () => {
      render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      await userEvent.keyboard(
        '{ArrowDown}{ArrowDown}{Enter}{Home}{ArrowDown}',
      );
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });
  });

  describe('pressing the End key', () => {
    it('does not change the option', async () => {
      render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}{End}{ArrowDown}');
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });
  });
});

describe('autoselect is true', () => {
  describe('backspace', () => {
    describe('ctrl+d', () => {
      it('does not auto-select an option', async () => {
        render(
          <ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
          />,
        );
        await userEvent.type(
          screen.getByRole('combobox'),
          'fo{Control>}d{/Control}',
        );
        expectToBeOpen();
      });
    });

    describe('delete', () => {
      describe('ctrl+h', () => {
        it('does not auto-select an option', async () => {
          render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(
            screen.getByRole('combobox'),
            'foo{Control>}h{/Control}',
          );
          expectToBeOpen();
        });
      });

      describe('ctrl+k', () => {
        it('does not auto-select an option', async () => {
          render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(
            screen.getByRole('combobox'),
            'fo{Control>}k{/Control}',
          );
          expectToBeOpen();
        });
      });
    });
  });
});
