import { useState } from 'react';
import { render, screen } from '@testing-library/react';
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
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(combobox).toHaveFocus();
  expect(listbox).toBeVisible();
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveFocusedOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveFocus();
}

const options = ['Apple', 'Banana', 'Orange'];

describe('with an open list box', () => {
  it('moves to the first option with the home key', async () => {
    render(<ComboBoxWrapper options={options} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowUp}{Home}');
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
  });

  it('moves to the last option with the end key', async () => {
    render(<ComboBoxWrapper options={options} />);
    await userEvent.tab();
    await userEvent.keyboard('{End}');
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
  });

  describe('with a selected option', () => {
    describe('pressing Ctrl+d', () => {
      it('moves focus back to the list box removing the selected option', async () => {
        render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{Control>}d{/Control}');
        expectToBeOpen();
      });
    });

    describe('pressing Ctrl+k', () => {
      it('moves focus back to the list box removing the selected option', async () => {
        render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{Control>}k{/Control}');
        expectToBeOpen();
      });
    });
  });

  describe('with a custom skipOption', () => {
    it('allows options to be skipped pressing home', async () => {
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
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('allows options to be skipped pressing end', async () => {
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
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
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
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });
  });

  describe('pressing the End key', () => {
    it('does not change the option', async () => {
      render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}{End}{ArrowDown}');
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
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
