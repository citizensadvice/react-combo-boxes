import { useEffect, useState, forwardRef } from 'react';
import { render, waitFor, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBox } from './combo_box';
import { collectLiveMessages } from '../__collect_aria_live_messages__';

const ComboBoxWrapper = forwardRef(({ value: _value, ...props }, ref) => {
  const [value, setValue] = useState(_value);

  useEffect(() => setValue(_value), [_value]);

  return (
    <ComboBox
      id="id"
      aria-labelledby="id-label"
      value={value}
      onValue={setValue}
      {...props}
      ref={ref}
    />
  );
});

function expectToBeClosed() {
  // and focused
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(combobox).toHaveFocus();
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(listbox).not.toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'false');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
}

function expectToBeClosedAndNotFocused() {
  // and focused
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(combobox).not.toHaveFocus();
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(listbox).not.toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'false');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
}

function expectToBeOpen() {
  // and focused with no selected or focused option
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveFocus();
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveFocusedOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(option).toHaveFocus();
}

function expectToHaveSelectedOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(combobox).toHaveFocus();
}

function expectToHaveActiveOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-owns', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(combobox).toHaveFocus();
}

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [
        { label: 'Apple' },
        { label: 'Banana' },
        { label: 'Orange' },
      ];

      it('renders a closed combo box', () => {
        const { container } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });

      describe('focusing the list box', () => {
        it('opens the combo box with no option selected', async () => {
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          expectToBeOpen();
        });

        describe('with no options it does not open the list box', () => {
          it('does not open the combo box', async () => {
            render(<ComboBoxWrapper options={[]} />);
            await userEvent.tab();
            expectToBeClosed();
          });
        });

        describe('when disabled', () => {
          it('does not open the combo box', async () => {
            render(
              <ComboBoxWrapper
                options={options}
                disabled
              />,
            );
            await userEvent.tab();
            expectToBeClosedAndNotFocused();
          });
        });

        describe('when readOnly', () => {
          it('does not open the combo box', async () => {
            render(
              <ComboBoxWrapper
                options={options}
                readOnly
              />,
            );
            await userEvent.tab();
            expectToBeClosed();
          });
        });
      });

      describe('navigating options in an open listbox', () => {
        describe('pressing the down arrow', () => {
          it('moves to the first option from the input', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}');
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });

          it('moves to the next option', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowDown}');
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Banana' }),
            );
          });

          it('moves from the last option to the input', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}',
            );
            expectToBeOpen();
          });

          it('does nothing with the alt key pressed', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
            expectToBeOpen();
          });

          it('calls onLayoutFocusedOption', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onLayoutFocusedOption={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}');
            expect(spy).toHaveBeenCalledWith({
              option: screen.getByRole('option', { name: 'Apple' }),
              listbox: screen.getByRole('listbox'),
              input: screen.getByRole('combobox'),
            });
          });
        });

        describe('pressing the up arrow', () => {
          it('moves from the input to the last option', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowUp}');
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Orange' }),
            );
          });

          it('moves to the previous option', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowUp}{ArrowUp}');
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Banana' }),
            );
          });

          it('moves from the first option to the input', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowUp}');
            expectToBeOpen();
          });

          it('calls onLayoutFocusedOption', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onLayoutFocusedOption={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard('{ArrowUp}');
            expect(spy).toHaveBeenCalledWith({
              option: screen.getByRole('option', { name: 'Orange' }),
              listbox: screen.getByRole('listbox'),
              input: screen.getByRole('combobox'),
            });
          });
        });

        describe('pressing the home key', () => {
          it('moves focus back to the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowUp}{Home}');
            expectToBeOpen();
          });
        });

        describe('pressing the end key', () => {
          it('moves focus back to the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{End}');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });

        describe('pressing the page up key', () => {
          it('moves the page of options up', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowDown}{PageUp}');
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });

        describe('pressing the page down key', () => {
          it('moves the page of options down', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{PageDown}');
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Orange' }),
            );
          });
        });

        describe('typing', () => {
          it('moves focus back to the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.type(document.activeElement, 'a');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });

        describe('pressing backspace', () => {
          it('moves focus back to the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Backspace}');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });

        describe('pressing arrow left', () => {
          it('moves focus back to the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowLeft}');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });

        describe('pressing arrow right', () => {
          it('moves focus back to the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowRight}');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });

        describe('pressing delete', () => {
          it('moves focus back to the list box removing the selected option', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Delete}');
            expectToBeOpen();
          });
        });

        describe('pressing Ctrl+d', () => {
          it('moves focus back to the list box removing the selected option', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Control>}d{/Control}');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });

        describe('pressing Ctrl+k', () => {
          it('moves focus back to the list box removing the selected option', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Control>}k{/Control}');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'Apple' }),
            );
          });
        });
      });

      describe('selecting an option', () => {
        describe('when clicking on an option', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.click(
              screen.getByRole('option', { name: 'Banana' }),
            );
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.click(
              screen.getByRole('option', { name: 'Banana' }),
            );
            expectToBeClosed();
          });

          it('updates the displayed value', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.click(
              screen.getByRole('option', { name: 'Banana' }),
            );
            expect(screen.getByRole('combobox')).toHaveValue('Banana');
          });

          it('does nothing if a different mouse button is pressed', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.pointer({
              target: screen.getByRole('option', { name: 'Banana' }),
              keys: '[MouseRight]',
            });
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen();
          });

          it('cancels mousedown', async () => {
            const spy = jest.fn();
            document.addEventListener('mousedown', spy);
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.click(
              screen.getByRole('option', { name: 'Banana' }),
            );
            expect(spy.mock.calls[0][0].defaultPrevented).toEqual(true);
            document.removeEventListener('mousedown', spy);
          });
        });

        describe('when pressing enter on an option', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
          });

          it('closes the list box and selects the combobox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expectToBeClosed();
          });

          it('updates the displayed value', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(screen.getByRole('combobox')).toHaveValue('Apple');
          });
        });

        describe('when blurring the combobox', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            await waitFor(() => {
              expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
            });
          });

          it('closes the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            await waitFor(() => {
              expect(
                screen.getByRole('listbox', { hidden: true }),
              ).not.toBeVisible();
            });
            expect(document.body).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            await waitFor(() => {
              expect(screen.getByRole('combobox')).toHaveValue('Apple');
            });
          });

          describe('when no option has been selected', () => {
            it('closes the list box and clears the search', async () => {
              const onSearch = jest.fn();
              const onValue = jest.fn();
              render(
                <ComboBoxWrapper
                  options={options}
                  onValue={onValue}
                  onSearch={onSearch}
                />,
              );
              await userEvent.type(screen.getByRole('combobox'), 'app');
              await userEvent.tab();
              await waitFor(() => {
                expect(
                  screen.getByRole('listbox', { hidden: true }),
                ).not.toBeVisible();
              });
              expect(onValue).not.toHaveBeenCalled();
              expect(onSearch).toHaveBeenLastCalledWith('');
              expect(screen.getByRole('combobox')).toHaveValue('');
            });
          });
        });
      });

      describe('when pressing escape on an option', () => {
        it('closes the list box', async () => {
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          await userEvent.keyboard('{ArrowDown}{Escape}');
          expectToBeClosed();
        });

        it('clears the focused value', async () => {
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          await userEvent.keyboard('{ArrowDown}{ArrowDown}{Escape}{ArrowDown}');
          expectToBeOpen();
        });

        it('keeps the current value', async () => {
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          await userEvent.keyboard(
            '{ArrowDown}{Enter}{ArrowDown}{ArrowDown}{Escape}',
          );
          expectToBeClosed();
          expect(screen.getByRole('combobox')).toHaveValue('Apple');
        });

        it('clears the search value', async () => {
          const onSearch = jest.fn();
          render(
            <ComboBoxWrapper
              options={options}
              onSearch={onSearch}
            />,
          );
          await userEvent.tab();
          await userEvent.keyboard(
            '{ArrowDown}{Enter}{ArrowDown}{ArrowDown}{Escape}',
          );
          expect(onSearch).toHaveBeenLastCalledWith('');
        });
      });

      describe('when pressing ArrowUp + alt on an option', () => {
        it('closes the list box', async () => {
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          await userEvent.keyboard('{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
          expectToBeClosed();
        });

        it('clears the search value', async () => {
          const onSearch = jest.fn();
          render(
            <ComboBoxWrapper
              options={options}
              onSearch={onSearch}
            />,
          );
          await userEvent.tab();
          await userEvent.keyboard('{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
          expect(onSearch).toHaveBeenLastCalledWith('');
        });

        describe('with no value', () => {
          it('resets focused value', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}{ArrowDown}',
            );
            expectToBeOpen();
          });
        });

        describe('with a value', () => {
          it('resets focused value', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Enter}{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}{ArrowDown}',
            );
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Banana' }),
            );
          });
        });
      });

      describe('on a closed listbox', () => {
        describe('pressing arrow down + alt', () => {
          it('opens the listbox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{ArrowDown}{/Alt}',
            );
            expectToBeOpen();
          });
        });

        describe('pressing arrow down', () => {
          it('opens the listbox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}{ArrowDown}',
            );
            expectToBeOpen();
          });

          describe('when disabled', () => {
            it('does not open the list box when using the keyboard', async () => {
              render(
                <ComboBoxWrapper
                  options={options}
                  disabled
                />,
              );
              await userEvent.tab();
              await userEvent.keyboard('{ArrowDown}');
              expectToBeClosedAndNotFocused();
            });
          });

          describe('when readOnly', () => {
            it('does not open the list box when using the keyboard', async () => {
              render(
                <ComboBoxWrapper
                  options={options}
                  readOnly
                />,
              );
              await userEvent.tab();
              await userEvent.keyboard('{ArrowDown}');
              expectToBeClosed();
            });
          });
        });

        describe('pressing arrow up', () => {
          it('opens the listbox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}{ArrowUp}',
            );
            expectToBeOpen();
          });
        });

        describe('pressing arrow up + alt', () => {
          it('does not open the listbox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{ArrowUp}{/Alt}',
            );
            expectToBeClosed();
          });
        });

        describe('pressing page down', () => {
          it('does not open the listbox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}{PageDown}');
            expectToBeClosed();
          });
        });

        describe('pressing page up', () => {
          it('does not open the listbox', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}{PageUp}');
            expectToBeClosed();
          });
        });

        describe('pressing Enter', () => {
          it('does not select an option', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}{Enter}',
            );
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('mouse button up', () => {
          it('opens the listbox on left click', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}',
            );
            await userEvent.click(document.activeElement);
            expectToBeOpen();
          });

          it('does not open the listbox on right click', async () => {
            render(<ComboBoxWrapper options={options} />);
            await userEvent.tab();
            await userEvent.keyboard(
              '{ArrowDown}{ArrowDown}{Alt>}{ArrowUp}{/Alt}',
            );
            await userEvent.pointer({
              target: document.activeElement,
              keys: '[MouseRight]',
            });
            expectToBeClosed();
          });
        });
      });

      describe('refocusing the listbox', () => {
        it('removes focus from the list box keeping the current selection', async () => {
          render(
            <ComboBoxWrapper
              options={options}
              value="Orange"
            />,
          );
          await userEvent.tab();
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'Orange' }),
          );
          await userEvent.keyboard('{ArrowUp}');
          expectToHaveFocusedOption(
            screen.getByRole('option', { name: 'Banana' }),
          );
          await userEvent.click(screen.getByRole('combobox'));
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'Banana' }),
          );
        });
      });

      describe('typing', () => {
        it('updates the input value', async () => {
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          await userEvent.type(screen.getByRole('combobox'), 'foo');
          expect(screen.getByRole('combobox')).toHaveValue('foo');
        });

        describe('single option with matching value', () => {
          it('does not show the listbox if the search matches the value', async () => {
            render(<ComboBoxWrapper options={['foo']} />);
            await userEvent.type(screen.getByRole('combobox'), 'foo');
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expectToBeClosed();
            await userEvent.type(screen.getByRole('combobox'), '{Backspace}');
            expectToHaveSelectedOption(screen.getByRole('option'));
            await userEvent.type(screen.getByRole('combobox'), 'o');
            expectToBeClosed();
          });
        });

        describe('multiple options with matching value', () => {
          it('does show the listbox if the search matches the value', async () => {
            render(<ComboBoxWrapper options={['foo', 'foo bar']} />);
            await userEvent.type(screen.getByRole('combobox'), 'foo');
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expectToBeClosed();

            await userEvent.type(screen.getByRole('combobox'), '{Backspace}');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'foo' }),
            );
            await userEvent.type(screen.getByRole('combobox'), 'o');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'foo' }),
            );
          });
        });
      });

      describe('setting the search to an empty string', () => {
        describe('without an existing value', () => {
          it('does not call onValue', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.type(screen.getByRole('combobox'), 'foo');
            await userEvent.clear(document.activeElement);
            expect(spy).not.toHaveBeenCalled();
          });

          it('clears the focused option', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.type(screen.getByRole('combobox'), 'foo');
            await userEvent.keyboard('{ArrowDown}{ArrowDown}');
            await userEvent.clear(screen.getByRole('combobox'));
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen();
          });
        });

        describe('with an existing value', () => {
          it('calls onValue with null', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
                value="Apple"
              />,
            );
            await userEvent.clear(screen.getByRole('combobox'));
            expect(spy).toHaveBeenCalledWith(null);
          });

          it('clears the existing option', async () => {
            render(
              <ComboBoxWrapper
                options={options}
                value="Apple"
              />,
            );
            await userEvent.clear(screen.getByRole('combobox'));
            expect(document.activeElement).toHaveValue('');
          });

          it('clears the selected option', async () => {
            render(
              <ComboBoxWrapper
                options={options}
                value="Apple"
              />,
            );
            await userEvent.clear(screen.getByRole('combobox'));
            expectToBeOpen(document.activeElement);
          });
        });
      });
    });

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', async () => {
        const { container } = render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        expect(container).toMatchSnapshot();
        expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
          'aria-disabled',
          'true',
        );
      });

      it('selects a disabled option with the arrow keys', async () => {
        render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        expectToHaveFocusedOption(
          screen.getByRole('option', { name: 'Banana' }),
        );
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.click(
              screen.getByRole('option', { name: 'Banana' }),
            );
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen();
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', async () => {
            const spy = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={spy}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(
              screen.getByRole('option', { name: 'Banana' }),
            );
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
            const onSearch = jest.fn();
            const onValue = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onValue={onValue}
                onSearch={onSearch}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowDown}');
            await userEvent.tab();
            await waitFor(() => {
              expect(
                screen.getByRole('listbox', { hidden: true }),
              ).not.toBeVisible();
            });
            expect(onValue).not.toHaveBeenCalled();
            expect(onSearch).toHaveBeenLastCalledWith('');
            expect(document.body).toHaveFocus();
          });

          it('clears the search value', async () => {
            const onSearch = jest.fn();
            render(
              <ComboBoxWrapper
                options={options}
                onSearch={onSearch}
              />,
            );
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
            expect(onSearch).toHaveBeenLastCalledWith('');
          });
        });
      });
    });

    describe('value', () => {
      it('is used as a options identity', async () => {
        const options = [
          { label: 'foo', value: 1 },
          { label: 'foo', value: 2 },
          { label: 'foo', value: 3 },
        ];
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            value={2}
            onValue={spy}
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', async () => {
        const options = [
          { label: 'foo', id: 1 },
          { label: 'foo', id: 2 },
          { label: 'foo', id: 3 },
        ];
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            value={2}
            onValue={spy}
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('name', () => {
      it('is used as a fallback for label', async () => {
        const options = [{ name: 'Foo' }, { name: 'Bar' }];
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            value="Bar"
            onValue={spy}
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'Bar' }));
        await userEvent.keyboard('{ArrowUp}{Enter}');
        expect(spy).toHaveBeenCalledWith({ name: 'Foo' });
      });

      it('is not used if label is present', async () => {
        const options = [
          { label: 'Fizz', name: 'Foo' },
          { label: 'Buzz', name: 'Bar' },
        ];
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            value="Buzz"
            onValue={spy}
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(
          screen.getByRole('option', { name: 'Buzz' }),
        );
      });
    });

    describe('title', () => {
      it('is used as a fallback for label', async () => {
        const options = [{ title: 'Foo' }, { title: 'Bar' }];
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            value="Bar"
            onValue={spy}
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'Bar' }));
        await userEvent.keyboard('{ArrowUp}{Enter}');
        expect(spy).toHaveBeenCalledWith({ title: 'Foo' });
      });

      it('is not used if name is present', async () => {
        const options = [
          { name: 'Fizz', title: 'Foo' },
          { name: 'Buzz', title: 'Bar' },
        ];
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            value="Buzz"
            onValue={spy}
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(
          screen.getByRole('option', { name: 'Buzz' }),
        );
      });
    });

    describe('html', () => {
      it('sets attributes on the option', async () => {
        const options = [
          { label: 'foo', html: { 'data-foo': 'bar', className: 'class' } },
        ];
        render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        expect(screen.getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(screen.getByRole('option')).toHaveClass('class');
      });

      describe('html id', () => {
        it('is used as the options id', async () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }];
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          expect(screen.getByRole('option')).toHaveAttribute('id', 'xxx');
        });

        it('will not use duplicate ids', async () => {
          const options = [
            { label: 'foo', html: { id: 'xxx' } },
            { label: 'bar', html: { id: 'xxx' } },
          ];
          render(<ComboBoxWrapper options={options} />);
          await userEvent.tab();
          await userEvent.keyboard('{ArrowUp}');
          expect(screen.getByRole('option', { name: 'foo' })).toHaveAttribute(
            'id',
            'xxx',
          );
          expect(screen.getByRole('option', { name: 'bar' })).toHaveAttribute(
            'id',
            'xxx_1',
          );
        });
      });
    });

    describe('group', () => {
      const options = [
        { label: 'Orange', group: 'Citrus' },
        { label: 'Lemon', group: 'Citrus' },
        { label: 'Raspberry', group: 'Berry' },
        { label: 'Strawberry', group: 'Berry' },
        { label: 'Apple' },
      ];

      it('renders grouped options', () => {
        const { container } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('does not select a group with the arrow keys', async () => {
        render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        expectToHaveFocusedOption(
          screen.getByRole('option', { name: /Orange/ }),
        );
      });

      it('triggers onValue when an option is selected', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            onValue={spy}
          />,
        );
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', async () => {
        render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
        expect(screen.getByRole('combobox')).toHaveValue('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', async () => {
          const spy = jest.fn();
          render(
            <ComboBoxWrapper
              options={options}
              onValue={spy}
            />,
          );
          await userEvent.tab();
          await userEvent.click(screen.getAllByText('Citrus')[0]);
          expect(spy).not.toHaveBeenCalled();
          expectToBeOpen();
        });
      });
    });

    describe('other attributes', () => {
      it('does not render them', async () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        expect(screen.getByRole('option')).not.toHaveAttribute(
          'data-foo',
          'bar',
        );
      });
    });

    describe('missing label', () => {
      it('treats as undefined', () => {
        const options = [{}];
        const { container } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('options as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders a closed combo box', () => {
      const { container } = render(<ComboBoxWrapper options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith('Banana');
      expectToBeClosed();
    });

    it('can select an empty string', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['']}
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith('');
      expectToBeClosed();
    });
  });

  describe('options as array of numbers', () => {
    const options = [1, 2, 3];

    it('renders a closed combo box', () => {
      const { container } = render(<ComboBoxWrapper options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith(2);
      expectToBeClosed();
    });

    it('can select 0', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={[0]}
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith(0);
      expectToBeClosed();
    });
  });

  describe('options as null', () => {
    it('renders an option with an empty string', async () => {
      const { container } = render(<ComboBoxWrapper options={[null, 'foo']} />);
      expect(container).toMatchSnapshot();
      await userEvent.tab();
      expectToBeOpen();
      expect(screen.getAllByRole('option')[0]).toHaveTextContent('');
      expect(screen.getAllByRole('option')[0]).not.toHaveTextContent('null');
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={[null, 'foo']}
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith(null);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as undefined', () => {
    it('renders an option with an empty string', async () => {
      const { container } = render(
        <ComboBoxWrapper options={[undefined, 'foo']} />,
      );
      expect(container).toMatchSnapshot();
      await userEvent.tab();
      expectToBeOpen();
      expect(screen.getAllByRole('option')[0]).toHaveTextContent('');
      expect(screen.getAllByRole('option')[0]).not.toHaveTextContent(
        'undefined',
      );
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          value="foo"
          options={['foo', undefined]}
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith(undefined);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('no options', () => {
    it('does not open the listbox on focus', async () => {
      render(<ComboBoxWrapper options={[]} />);
      await userEvent.tab();
      expectToBeClosed();
    });

    it('does not open the listbox on arrow down', async () => {
      render(<ComboBoxWrapper options={[]} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expectToBeClosed();
    });

    it('does not open the listbox on alt + arrow down', async () => {
      render(<ComboBoxWrapper options={[]} />);
      await userEvent.tab();
      await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
      expectToBeClosed();
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onValue={spy}
          mapOption={({ name }) => ({ label: name })}
        />,
      );
      await userEvent.tab();
      await userEvent.click(screen.getByText('Orange'));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          mapOption={({ name }) => ({ label: name })}
        />,
      );
      await userEvent.tab();
      await userEvent.click(screen.getByText('Orange'));
      expect(screen.getByRole('combobox')).toHaveValue('Orange');
    });
  });
});

describe('value', () => {
  it('sets the initial selected option', async () => {
    const options = ['Apple', 'Banana', 'Orange'];
    render(
      <ComboBoxWrapper
        options={options}
        value="Banana"
      />,
    );
    await userEvent.tab();
    expectToHaveSelectedOption(screen.getByRole('option', { name: 'Banana' }));
  });

  it('calls onLayoutFocusedOption', async () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        value="Banana"
        onLayoutFocusedOption={spy}
      />,
    );
    await userEvent.tab();
    expect(spy).toHaveBeenCalledWith({
      option: screen.getByRole('option', { name: 'Banana' }),
      listbox: screen.getByRole('listbox'),
      input: screen.getByRole('combobox'),
    });
  });

  it('sets the combo box value', async () => {
    const options = ['Apple', 'Banana', 'Orange'];
    render(
      <ComboBoxWrapper
        options={options}
        value="Banana"
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('combobox')).toHaveValue('Banana');
  });

  describe('with a single option matching the value', () => {
    it('does not open the combo box', async () => {
      const options = ['foo'];
      render(
        <ComboBoxWrapper
          options={options}
          value="foo"
        />,
      );
      await userEvent.tab();
      expectToBeClosed();
    });
  });

  describe('value is disabled', () => {
    it('selects the disabled option', async () => {
      const options = [{ label: 'Apple', disabled: true }, 'Banana'];
      render(
        <ComboBoxWrapper
          options={options}
          value="Apple"
        />,
      );
      await userEvent.tab();
      expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
    });
  });

  describe('value is not in options', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('does not select a value', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          value="Strawberry"
        />,
      );
      await userEvent.tab();
      expectToBeOpen();
    });

    it('displays value as the combo box label', () => {
      render(
        <ComboBoxWrapper
          options={options}
          value="Strawberry"
        />,
      );
      expect(screen.getByRole('combobox')).toHaveValue('Strawberry');
    });
  });

  describe('value is an empty string', () => {
    const options = ['', 'foo'];

    it('selects the value', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          value=""
        />,
      );
      await userEvent.tab();
      expectToHaveSelectedOption(screen.getAllByRole('option')[0]);
    });
  });

  describe('value is null', () => {
    const options = [null, 'foo'];

    it('selects the value', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          value={null}
        />,
      );
      await userEvent.tab();
      expectToHaveSelectedOption(screen.getAllByRole('option')[0]);
    });
  });

  describe('value is undefined', () => {
    const options = [undefined, 'foo'];

    it('selects the value', async () => {
      render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      expectToHaveSelectedOption(screen.getAllByRole('option')[0]);
    });
  });

  describe('updating the value', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('updates the aria-selected value of an open listbox', async () => {
      const { rerender } = render(
        <ComboBoxWrapper
          options={options}
          value="Orange"
        />,
      );
      await userEvent.tab();
      rerender(
        <ComboBoxWrapper
          options={options}
          value="Apple"
        />,
      );
      expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
    });

    it('changes the focused value of an open listbox', async () => {
      const { rerender } = render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      rerender(
        <ComboBoxWrapper
          options={options}
          value="Banana"
        />,
      );
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('calls onSearch for an open list box with no search', async () => {
      const onSearch = jest.fn();
      const { rerender } = render(
        <ComboBoxWrapper
          options={options}
          onSearch={onSearch}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      rerender(
        <ComboBoxWrapper
          options={options}
          onSearch={onSearch}
          value="Banana"
        />,
      );
      expect(onSearch).toHaveBeenCalledWith('Banana');
    });

    it('does not call onSearch for an open list box with a search', async () => {
      const onSearch = jest.fn();
      const { rerender } = render(
        <ComboBoxWrapper
          options={options}
          onSearch={onSearch}
        />,
      );
      await userEvent.tab();
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      onSearch.mockClear();
      rerender(
        <ComboBoxWrapper
          options={options}
          onSearch={onSearch}
          value="Banana"
        />,
      );
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('changes the value of a closed listbox', async () => {
      const { rerender } = render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      rerender(
        <ComboBoxWrapper
          options={options}
          value="Banana"
        />,
      );
      expect(document.activeElement).toHaveValue('Banana');
      await userEvent.keyboard('{ArrowDown}');
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('does not call onSearch for an closed list box with no search', async () => {
      const onSearch = jest.fn();
      const { rerender } = render(
        <ComboBoxWrapper
          options={options}
          onSearch={onSearch}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      onSearch.mockClear();
      rerender(
        <ComboBoxWrapper
          options={options}
          onSearch={onSearch}
          value="Banana"
        />,
      );
      expect(onSearch).not.toHaveBeenCalled();
    });
  });
});

describe('clear button', () => {
  const options = ['Apple', 'Orange', 'Banana'];

  it('is not present without a value', () => {
    render(<ComboBoxWrapper options={options} />);
    const remove = document.getElementById('id_clear_button');
    expect(remove).not.toBeVisible();
  });

  it('is not present with a blank value', () => {
    render(
      <ComboBoxWrapper
        options={options}
        value=""
      />,
    );
    const remove = document.getElementById('id_clear_button');
    expect(remove).not.toBeVisible();
  });

  it('is not present with a blank label', () => {
    const value = { label: '', value: 'x' };
    render(
      <ComboBoxWrapper
        options={[value]}
        value={value}
      />,
    );
    const remove = document.getElementById('id_clear_button');
    expect(remove).not.toBeVisible();
  });

  it('is not present when disabled', () => {
    render(
      <ComboBoxWrapper
        options={options}
        value="Apple"
        disabled
      />,
    );
    const remove = document.getElementById('id_clear_button');
    expect(remove).not.toBeVisible();
  });

  it('is not present when readOnly', () => {
    render(
      <ComboBoxWrapper
        options={options}
        value="Apple"
        readOnly
      />,
    );
    const remove = document.getElementById('id_clear_button');
    expect(remove).not.toBeVisible();
  });

  it('pressing the button removes the value', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        value="Apple"
        onValue={spy}
      />,
    );
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    await userEvent.click(remove);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing the middle button does not remove the value', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        value="Apple"
        onValue={spy}
      />,
    );
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    await userEvent.pointer({ target: remove, keys: '[MouseRight]' });
    expect(spy).not.toHaveBeenCalled();
  });

  it('pressing ENTER on the button clears the value', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        value="Apple"
        onValue={spy}
      />,
    );
    await userEvent.tab();
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    act(() => remove.focus());
    await userEvent.type(remove, '{Enter}', { skipClick: true });
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing SPACE on the button clears the value', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        value="Apple"
        onValue={spy}
      />,
    );
    await userEvent.tab();
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    act(() => remove.focus());
    await userEvent.type(remove, ' ', { skipClick: true });
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing a different key does not clear the value', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        value="Apple"
        onValue={spy}
      />,
    );
    await userEvent.tab();
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    act(() => remove.focus());
    await userEvent.type(remove, 'x', { skipClick: true });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('down arrow', () => {
  const options = ['Apple', 'Orange', 'Banana'];

  it('is not present without options', () => {
    render(<ComboBoxWrapper options={null} />);
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow).not.toBeVisible();
  });

  it('is not present with options and a value', () => {
    render(
      <ComboBoxWrapper
        options={options}
        value="apple"
      />,
    );
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow).not.toBeVisible();
  });

  it('is present with options and no value', () => {
    render(<ComboBoxWrapper options={options} />);
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow).toBeVisible();
  });

  it('is not present with options when disabled', () => {
    render(
      <ComboBoxWrapper
        options={options}
        disabled
      />,
    );
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow).not.toBeVisible();
  });

  it('is present with options and a blank value', () => {
    render(
      <ComboBoxWrapper
        options={options}
        value=""
      />,
    );
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow).toBeVisible();
  });

  it('is present with options and a blank value label', () => {
    const value = { label: '', value: 'x' };
    render(
      <ComboBoxWrapper
        options={[options]}
        value={value}
      />,
    );
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow).toBeVisible();
  });
});

describe('busy', () => {
  describe('busyDebounce is null', () => {
    describe('when false', () => {
      it('sets aria-busy=false on the wrapper', () => {
        const { container } = render(
          <ComboBoxWrapper
            options={['foo']}
            busyDebounce={null}
          />,
        );
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
      });
    });

    describe('when true', () => {
      describe('with no search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container } = render(
            <ComboBoxWrapper
              options={['foo']}
              busy
              busyDebounce={null}
            />,
          );
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });

      describe('with a search', () => {
        it('sets aria-busy=true on the wrapper', async () => {
          const { container } = render(
            <ComboBoxWrapper
              options={['foo']}
              busy
              busyDebounce={null}
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
        });
      });

      describe('with a search and closed', () => {
        it('sets aria-busy=false on the wrapper', async () => {
          const { container } = render(
            <ComboBoxWrapper
              options={['foo']}
              busy
              busyDebounce={null}
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'foo');
          await userEvent.type(
            screen.getByRole('combobox'),
            '{Alt>}{ArrowUp}{/Alt}',
          );
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });

      describe('with a search matching the selected option and expanded', () => {
        it('sets aria-busy=true on the wrapper', async () => {
          const { container } = render(
            <ComboBoxWrapper
              options={['foo']}
              value="foo"
              busy
              busyDebounce={null}
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'o{backspace}');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
        });
      });

      describe('with a search matching the selected option and not expanded', () => {
        it('sets aria-busy=false on the wrapper', async () => {
          const { container } = render(
            <ComboBoxWrapper
              options={['foo']}
              value="foo"
              busy
              busyDebounce={null}
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'o{backspace}');
          await userEvent.type(
            screen.getByRole('combobox'),
            '{Alt>}{ArrowUp}{/Alt}',
          );
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });
    });

    describe('when null', () => {
      describe('with no search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container } = render(
            <ComboBoxWrapper
              options={['foo']}
              busy={null}
              busyDebounce={null}
            />,
          );
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });

      describe('with a search', () => {
        it('sets aria-busy=false on the wrapper', async () => {
          const { container } = render(
            <ComboBoxWrapper
              options={['foo']}
              busy={null}
              busyDebounce={null}
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });
    });
  });

  describe('busyDebounce is the default', () => {
    describe('when true', () => {
      it('sets aria-busy=true on the wrapper after 400ms', async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const { container } = render(
          <ComboBoxWrapper
            options={['foo']}
            busy
          />,
        );
        await user.type(screen.getByRole('combobox'), 'foo');
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        act(() => {
          jest.advanceTimersByTime(400);
        });
        expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
      });
    });
  });

  describe('busyDebounce is custom', () => {
    describe('when true', () => {
      it('sets aria-busy=true on the wrapper after delay', async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const { container } = render(
          <ComboBoxWrapper
            options={['foo']}
            busy
            busyDebounce={500}
          />,
        );
        await user.type(screen.getByRole('combobox'), 'foo');
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        act(() => {
          jest.advanceTimersByTime(499);
        });
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        act(() => {
          jest.advanceTimersByTime(1);
        });
        expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
      });
    });
  });
});

describe('onSearch', () => {
  describe('without onSearch', () => {
    it('sets aria-autocomplete to none', () => {
      render(<ComboBoxWrapper options={['foo']} />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-autocomplete',
        'none',
      );
    });
  });

  describe('when provided', () => {
    it('sets aria-autocomplete to list', () => {
      render(
        <ComboBoxWrapper
          options={['foo']}
          onSearch={() => {}}
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-autocomplete',
        'list',
      );
    });

    describe('on rendering', () => {
      it('does not call onSearch', () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo']}
            onSearch={spy}
            value="foo"
          />,
        );
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('on focus', () => {
      it('calls onSearch without a value', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo']}
            onSearch={spy}
          />,
        );
        await userEvent.tab();
        expect(spy).toHaveBeenCalledWith('');
      });

      it('calls onSearch with a value', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo']}
            onSearch={spy}
            value="foo"
          />,
        );
        await userEvent.tab();
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });

    describe('typing', () => {
      it('calls onSearch', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo']}
            onSearch={spy}
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'foo');
        expect(spy.mock.calls).toEqual([[''], ['f'], ['fo'], ['foo']]);
      });
    });

    describe('on selecting a value', () => {
      it('calls onSearch', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo']}
            onValue={spy}
          />,
        );
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(spy).toHaveBeenLastCalledWith('foo');
      });
    });
  });

  describe('updating options', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const newOptions = ['Strawberry', 'Raspberry', 'Banana'];
    const otherNewOptions = ['Peach', 'Kiwi', 'Grape'];

    it('updates the displayed options', async () => {
      const { container, rerender } = render(
        <ComboBoxWrapper options={options} />,
      );
      await userEvent.tab();
      rerender(<ComboBoxWrapper options={newOptions} />);
      expect(container).toMatchSnapshot();
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
        'Strawberry\u00A0',
        'Raspberry\u00A0',
        'Banana\u00A0',
      ]);
    });

    describe('update contains the focused option', () => {
      it('keeps the currently focused option', async () => {
        const { rerender } = render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        expectToHaveFocusedOption(screen.getAllByRole('option')[1]);
        rerender(<ComboBoxWrapper options={newOptions} />);
        expectToHaveFocusedOption(screen.getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the focused option', () => {
      it('removes the focused option', async () => {
        const { rerender } = render(<ComboBoxWrapper options={options} />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        expectToHaveFocusedOption(screen.getAllByRole('option')[1]);
        rerender(<ComboBoxWrapper options={otherNewOptions} />);
        expectToBeOpen();
      });
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', async () => {
        const { rerender } = render(
          <ComboBoxWrapper
            options={options}
            value="Banana"
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        rerender(
          <ComboBoxWrapper
            value="Banana"
            options={newOptions}
          />,
        );
        expectToHaveSelectedOption(screen.getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the selected option', () => {
      it('removes the selected option', async () => {
        const { rerender } = render(
          <ComboBoxWrapper
            options={options}
            value="Banana"
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        rerender(
          <ComboBoxWrapper
            value="Banana"
            options={otherNewOptions}
          />,
        );
        expectToBeOpen();
      });
    });

    describe('updated options are empty', () => {
      it('closes the list box', async () => {
        const { rerender } = render(
          <ComboBoxWrapper
            options={options}
            value="Banana"
          />,
        );
        await userEvent.tab();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        rerender(
          <ComboBoxWrapper
            value="Banana"
            options={[]}
          />,
        );
        expectToBeClosed();
      });
    });
  });
});

describe('onLayoutFocusedOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when an option is selected', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        onLayoutFocusedOption={spy}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(spy).toHaveBeenCalledWith({
      option: screen.getByRole('option', { name: 'Apple' }),
      listbox: screen.getByRole('listbox'),
      input: screen.getByRole('combobox'),
    });
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
        />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      expect(comboBox).toHaveFocus();
      expect(comboBox).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Banana' }).id,
      );
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('allows an option to be selected', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
        />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(comboBox).toHaveFocus();
      expectToBeClosed();
      expect(comboBox).toHaveValue('Apple');
    });
  });
});

describe('showSelectedLabel', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('by default', () => {
    it('does not show the selected option label in the input', async () => {
      render(<ComboBoxWrapper options={options} />);
      const comboBox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when false', () => {
    it('does not show the selected option label in the input', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          showSelectedLabel={false}
        />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when true', () => {
    it('shows the selected option label in the input', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          showSelectedLabel
        />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(comboBox).toHaveValue('Apple');
    });

    it('shows the selected option label in the input after typing', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          showSelectedLabel
        />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.type(document.activeElement, 'a');
      await userEvent.keyboard('{ArrowDown}{ArrowUp}');
      expect(comboBox).toHaveValue('a');
    });

    it('does not show the label of a disabled option', async () => {
      render(
        <ComboBoxWrapper
          options={[{ disabled: true, label: 'foo' }]}
          showSelectedLabel
        />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(comboBox).toHaveValue('');
    });

    it('does not trigger a search when moving through options', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          showSelectedLabel
          onSearch={spy}
        />,
      );
      await userEvent.tab();
      spy.mockClear();
      await userEvent.keyboard('{ArrowDown}');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe('autoselect', () => {
  describe('when true', () => {
    it('does not change the value of aria-autocomplete for no onSearch', () => {
      render(
        <ComboBoxWrapper
          options={['foo']}
          autoselect
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-autocomplete',
        'none',
      );
    });

    it('does not change the value of aria-autocomplete for an onSearch', () => {
      render(
        <ComboBoxWrapper
          options={['foo']}
          autoselect
          onSearch={() => {}}
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-autocomplete',
        'list',
      );
    });

    describe('when typing', () => {
      it('auto selects the first matching option', async () => {
        render(
          <ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'f');
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
      });

      it('auto selects the first non-disabled option', async () => {
        render(
          <ComboBoxWrapper
            options={[{ disabled: true, label: 'frog' }, 'foo']}
            autoselect
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'f');
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
      });

      it('does not auto select no matching option', async () => {
        render(
          <ComboBoxWrapper
            options={['foc', 'bar']}
            autoselect
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'c');
        expectToBeOpen();
      });

      it('does not auto select later matching options', async () => {
        render(
          <ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'b');
        expectToBeOpen();
      });
    });

    describe('backspace', () => {
      it('does not auto-select an option', async () => {
        render(
          <ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'fo{Backspace}');
        expectToBeOpen();
      });

      describe('ctrl+d', () => {
        it('continues to auto-select an option', async () => {
          render(
            <ComboBoxWrapper
              options={['food', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(
            screen.getByRole('combobox'),
            'foo{Control>}d{/Control}',
          );
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'food' }),
          );
        });
      });
    });

    describe('delete', () => {
      it('does not auto-select an option', async () => {
        render(
          <ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'foo{Delete}');
        expectToBeOpen();
      });

      describe('ctrl+h', () => {
        it('continues to auto-select an option', async () => {
          render(
            <ComboBoxWrapper
              options={['fooh', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(
            screen.getByRole('combobox'),
            'foo{Control>}h{/Control}',
          );
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'fooh' }),
          );
        });
      });

      describe('ctrl+k', () => {
        it('continues to auto-select an option', async () => {
          render(
            <ComboBoxWrapper
              options={['fook', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(
            screen.getByRole('combobox'),
            'foo{Control>}k{/Control}',
          );
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'fook' }),
          );
        });
      });

      describe('selecting options', () => {
        it('allows other options to be selected', async () => {
          render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'foo');
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'foo' }),
          );
          await userEvent.keyboard('{ArrowDown}');
          expectToHaveFocusedOption(
            screen.getByRole('option', { name: 'bar' }),
          );
        });
      });

      describe('updates to options', () => {
        it('autoselects a new value if no value is autoselected', async () => {
          const { rerender } = render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'ba');
          expectToBeOpen();
          rerender(
            <ComboBoxWrapper
              options={['bar', 'foo']}
              autoselect
            />,
          );
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'bar' }),
          );
        });

        it('autoselects a new value if a value is autoselected', async () => {
          const { rerender } = render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'fo');
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'foo' }),
          );
          rerender(
            <ComboBoxWrapper
              options={['food', 'bard']}
              autoselect
            />,
          );
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'food' }),
          );
        });

        it('removes the autoselect if there is no matching value', async () => {
          const { rerender } = render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'fo');
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'foo' }),
          );
          rerender(
            <ComboBoxWrapper
              options={['bar', 'foo']}
              autoselect
            />,
          );
          expectToBeOpen();
        });

        it('does not autoselect if a different value is focused', async () => {
          const { rerender } = render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              autoselect
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'fo');
          await userEvent.keyboard('{ArrowDown}');
          expectToHaveFocusedOption(
            screen.getByRole('option', { name: 'bar' }),
          );
          rerender(
            <ComboBoxWrapper
              options={['food', 'bar']}
              autoselect
            />,
          );
          expectToHaveFocusedOption(
            screen.getByRole('option', { name: 'bar' }),
          );
        });
      });

      describe('on blur', () => {
        it('selects the autoselected value', async () => {
          const spy = jest.fn();
          render(
            <ComboBoxWrapper
              options={['foo']}
              autoselect
              onValue={spy}
            />,
          );
          await userEvent.type(screen.getByRole('combobox'), 'fo');
          await userEvent.tab();
          await waitFor(() => {
            expect(spy).toHaveBeenCalledWith('foo');
          });
        });
      });
    });
  });

  describe('when inline', () => {
    // NOTE: userEvent.type is doing something jazzy with setSelection so can't be used

    it('changes the value of aria-autocomplete for no onSearch', () => {
      render(
        <ComboBoxWrapper
          options={['foo']}
          autoselect="inline"
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-autocomplete',
        'inline',
      );
    });

    it('changes the value of aria-autocomplete for an onSearch', () => {
      render(
        <ComboBoxWrapper
          options={['foo']}
          autoselect="inline"
          onSearch={() => {}}
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-autocomplete',
        'both',
      );
    });

    describe('when typing', () => {
      it('selects the text of the autoselected option', async () => {
        render(
          <ComboBoxWrapper
            options={['foo']}
            autoselect="inline"
          />,
        );
        const input = screen.getByRole('combobox');
        await userEvent.tab();
        await userEvent.type(input, 'f');
        expectToHaveSelectedOption(screen.getByRole('option'));
        expect(input).toHaveValue('foo');
        expect(input).toMatchObject({
          value: 'foo',
          selectionStart: 1,
          selectionEnd: 3,
          selectionDirection: 'backward',
        });
      });

      it('does not select the text of a disabled option', async () => {
        render(
          <ComboBoxWrapper
            options={[{ label: 'foo', disabled: true }]}
            autoselect="inline"
          />,
        );
        const input = screen.getByRole('combobox');
        await userEvent.tab();
        await userEvent.type(input, 'f');
        expectToBeOpen();
        expect(document.activeElement).toMatchObject({
          value: 'f',
          selectionStart: 1,
          selectionEnd: 1,
        });
      });

      it('does not select the text if the cursor position is inappropriate', async () => {
        render(
          <ComboBoxWrapper
            options={['abcd']}
            autoselect="inline"
          />,
        );
        await userEvent.tab();
        await userEvent.type(document.activeElement, 'ac');
        await userEvent.type(document.activeElement, '{ArrowLeft}b');
        expectToBeOpen();
        expect(document.activeElement).toMatchObject({
          value: 'abc',
          selectionStart: 2,
          selectionEnd: 2,
        });
      });

      it('removes the autoselected text and last character on backspace', async () => {
        render(
          <ComboBoxWrapper
            options={['foo']}
            autoselect="inline"
          />,
        );
        await userEvent.tab();
        await userEvent.type(document.activeElement, 'fo');
        expect(document.activeElement).toHaveValue('foo');
        await userEvent.type(document.activeElement, '{Backspace}');
        expect(document.activeElement).toHaveValue('f');
      });

      it('removes the autoselected text on delete', async () => {
        render(
          <ComboBoxWrapper
            options={['foo']}
            autoselect="inline"
          />,
        );
        await userEvent.tab();
        await userEvent.type(document.activeElement, 'fo');
        expect(document.activeElement).toHaveValue('foo');
        await userEvent.type(document.activeElement, '{Delete}');
        expect(document.activeElement).toHaveValue('fo');
      });

      it('removes the autoselected text on escape', async () => {
        render(
          <ComboBoxWrapper
            options={['foo']}
            autoselect="inline"
          />,
        );
        await userEvent.tab();
        await userEvent.type(document.activeElement, 'fo');
        expect(document.activeElement).toHaveValue('foo');
        await userEvent.type(document.activeElement, '{Escape}');
        expect(document.activeElement).toHaveValue('');
      });
    });

    describe('moving between options', () => {
      describe('when showSelectedLabel is true', () => {
        it('updates the value to the selected label', async () => {
          render(
            <ComboBoxWrapper
              options={['foo', 'foe']}
              autoselect="inline"
              showSelectedLabel
            />,
          );
          await userEvent.tab();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'foo' }),
          );
          await userEvent.type(document.activeElement, '{ArrowDown}');
          expectToHaveFocusedOption(
            screen.getByRole('option', { name: 'foe' }),
          );
          expect(screen.getByRole('combobox')).toHaveValue('foe');
        });

        describe('when returning to the original option', () => {
          it('sets the search string without selecting the text', async () => {
            render(
              <ComboBoxWrapper
                options={['foo', 'foe']}
                autoselect="inline"
                showSelectedLabel
              />,
            );
            await userEvent.tab();
            await userEvent.type(document.activeElement, 'fo');
            expectToHaveSelectedOption(
              screen.getByRole('option', { name: 'foo' }),
            );
            await userEvent.type(
              document.activeElement,
              '{ArrowDown}{ArrowDown}',
            );
            expectToBeOpen();
            expect(screen.getByRole('combobox')).toHaveValue('fo');
          });
        });
      });

      describe('when showSelectedLabel is false', () => {
        it('does not update the value to the selected label', async () => {
          render(
            <ComboBoxWrapper
              options={['foo', 'foe']}
              autoselect="inline"
              showSelectedLabel={false}
            />,
          );
          await userEvent.tab();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(
            screen.getByRole('option', { name: 'foo' }),
          );
          await userEvent.type(document.activeElement, '{ArrowDown}');
          expectToHaveFocusedOption(
            screen.getByRole('option', { name: 'foe' }),
          );
          expect(screen.getByRole('combobox')).toHaveValue('fo');
        });
      });
    });

    describe('selecting an option', () => {
      it('removes the text selection', async () => {
        render(
          <ComboBoxWrapper
            options={['foo', 'foe']}
            autoselect="inline"
          />,
        );
        await userEvent.tab();
        await userEvent.type(document.activeElement, 'fo');
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
        await userEvent.type(document.activeElement, '{Enter}');
        expectToBeClosed();
        expect(document.activeElement).toMatchObject({
          value: 'foo',
          selectionStart: 3,
          selectionEnd: 3,
          selectionDirection: 'forward',
        });
      });

      it('does not change the selection without focus', async () => {
        render(
          <ComboBoxWrapper
            options={['foo', 'foe']}
            autoselect="inline"
          />,
        );
        await userEvent.tab();
        await userEvent.type(document.activeElement, 'fo');
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
        await userEvent.tab();
        await waitFor(() => {
          expect(
            screen.getByRole('listbox', { hidden: true }),
          ).not.toBeVisible();
        });
        expect(screen.getByRole('combobox')).toHaveValue('foo');
      });
    });
  });
});

describe('tabAutocomplete', () => {
  describe('when tabAutocomplete is false', () => {
    it('pressing tab does not select the item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          onValue={spy}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'fo');
      await userEvent.tab();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('when tabAutocomplete is true', () => {
    it('pressing tab selects the suggested item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          tabAutocomplete
          onValue={spy}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'fo');
      await userEvent.tab();
      expect(spy).toHaveBeenCalledWith('foo');
    });

    it('pressing shift+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          tabAutocomplete
          onValue={spy}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'fo');
      await userEvent.tab({ shift: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing alt+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          tabAutocomplete
          onValue={spy}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'fo');
      await userEvent.keyboard('{Alt>}{Tab}{/Alt}');
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing ctrl+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          tabAutocomplete
          onValue={spy}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'fo');
      await userEvent.keyboard('{Control>}{Tab}{/Control}');
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing meta+tab does not select the suggested item item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          tabAutocomplete
          onValue={spy}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'fo');
      await userEvent.keyboard('{Meta>}{Tab}{/Meta}');
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing tab selects a focused item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          tabAutocomplete
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'foo' }));
      await userEvent.tab();
      expect(spy).toHaveBeenCalledWith('foo');
    });

    it('pressing tab does not reselect the suggested item current item', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={['foo', 'foe']}
          tabAutocomplete
          onValue={spy}
          value="foo"
        />,
      );
      await userEvent.tab();
      expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
      await userEvent.tab();
      expect(spy).not.toHaveBeenCalled();
    });

    describe('when autoselect is true', () => {
      it('pressing tab selects the item', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo', 'foe']}
            autoselect
            tabAutocomplete
            onValue={spy}
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'fo');
        await userEvent.tab();
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });

    describe('when autoselect is inline', () => {
      it('pressing tab selects the item', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo', 'foe']}
            autoselect="inline"
            tabAutocomplete
            onValue={spy}
          />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'fo');
        await userEvent.tab();
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });
  });
});

describe('tabBetweenOptions', () => {
  const options = ['Apple', 'Banana'];

  describe('without managedFocus', () => {
    it('pressing tab moves to the next option', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Apple' }));

      await userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing tab on the last option moves out of the listbox without selecting an option', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
          tabBetweenOptions
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(screen.getByRole('combobox')).not.toHaveValue();
      expect(spy).not.toHaveBeenCalled();
      expect(document.body).toHaveFocus();
    });

    it('pressing down arrow and tab moves between options', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab moves to the previous option', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      await userEvent.tab({ shift: true });
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Apple' }));
    });

    it('pressing shift tab on the first option focuses the input', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.tab({ shift: true });
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('pressing tab with focus on the input and a selected option moves to the next option', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
          value="Apple"
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab on the input moves focus up the page', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus={false}
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.tab({ shift: true });

      await waitFor(() => {
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(document.body).toHaveFocus();
    });
  });

  describe('with managedFocus', () => {
    it('pressing tab moves to the next option', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));

      await userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing tab on the last option moves out of the listbox without selecting an option', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus
          tabBetweenOptions
          onValue={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(screen.getByRole('combobox')).not.toHaveValue();
      expect(spy).not.toHaveBeenCalled();
      expect(document.body).toHaveFocus();
    });

    it('pressing down arrow and tab moves between options', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus
          tabBetweenOptions
        />,
      );

      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab moves to the previous option', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      await userEvent.tab({ shift: true });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
    });

    it('pressing shift tab on the first option focuses the input', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.tab({ shift: true });
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('pressing tab with focus on the input and a selected option moves to the next option', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus
          value="Apple"
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab on the input moves focus up the page', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          managedFocus
          tabBetweenOptions
        />,
      );
      await userEvent.tab();
      await userEvent.tab({ shift: true });

      await waitFor(() => {
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(document.body).toHaveFocus();
    });
  });
});

describe('expandOnFocus', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  describe('when unset', () => {
    it('expands on focus', async () => {
      render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      expectToBeOpen();
    });

    it('expands when the clear button is pressed', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          value="Apple"
        />,
      );
      await userEvent.tab();
      await userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      expectToBeOpen();
    });
  });

  describe('when true', () => {
    it('expands on focus', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          expandOnFocus
        />,
      );
      await userEvent.tab();
      expectToBeOpen();
    });

    it('expands when the clear button is pressed', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          value="Apple"
          expandOnFocus
        />,
      );
      await userEvent.tab();
      await userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      expectToBeOpen();
    });
  });

  describe('when false', () => {
    it('does not expand on focus', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          expandOnFocus={false}
        />,
      );
      await userEvent.tab();
      expectToBeClosed();
    });

    it('does not expand when the clear button is pressed', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          value="Apple"
          expandOnFocus={false}
        />,
      );
      const combobox = screen.getByRole('combobox');
      await userEvent.tab();
      await userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      const listbox = document.getElementById(
        combobox.getAttribute('aria-owns'),
      );
      expect(listbox).toHaveAttribute('role', 'listbox');
      expect(listbox).not.toBeVisible();
    });
  });
});

describe('selectOnBlur', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  describe('when true', () => {
    describe('with a value', () => {
      it('calls onValue when bluring the list box', async () => {
        const onValue = jest.fn();
        const onSearch = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            onValue={onValue}
            onSearch={onSearch}
            selectOnBlur
          />,
        );
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.tab();
        await waitFor(() => {
          expect(onValue).toHaveBeenCalledWith('Apple');
        });
        expect(onSearch).toHaveBeenCalledWith('Apple');
      });
    });

    describe('with an unselectable value', () => {
      it('does not call onValue', async () => {
        const onValue = jest.fn();
        const onSearch = jest.fn();
        render(
          <ComboBoxWrapper
            options={[{ name: 'Apple', disabled: true }]}
            onValue={onValue}
            onSearch={onSearch}
            selectOnBlur
          />,
        );
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.tab();
        await waitFor(() => {
          expect(onSearch).toHaveBeenLastCalledWith('');
        });
        expect(onValue).not.toHaveBeenCalled();
      });
    });

    describe('without a value', () => {
      it('does not call onValue', async () => {
        const onValue = jest.fn();
        const onSearch = jest.fn();
        render(
          <ComboBoxWrapper
            options={options}
            onValue={onValue}
            onSearch={onSearch}
            selectOnBlur
          />,
        );
        await userEvent.tab();
        await userEvent.tab();
        await waitFor(() => {
          expect(onSearch).toHaveBeenLastCalledWith('');
        });
        expect(onValue).not.toHaveBeenCalled();
      });
    });
  });

  describe('when false', () => {
    it('does not call onValue when bluring the list box', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onValue={spy}
          selectOnBlur={false}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.tab();
      expect(document.body).toHaveFocus();
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
      expect(spy).not.toHaveBeenCalled();
    });

    describe('with tab autocomplete', () => {
      it('pressing tab does not select a focused item', async () => {
        const spy = jest.fn();
        render(
          <ComboBoxWrapper
            options={['foo', 'foe']}
            tabAutocomplete
            selectOnBlur={false}
            onValue={spy}
          />,
        );
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}');
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'foo' }));
        await userEvent.tab();
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});

describe('clearOnSelect', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  describe('with default value', () => {
    it('selecting a value calls onSearch with the selected value', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onSearch={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expectToBeClosed();
      expect(spy).toHaveBeenCalledWith('Apple');
    });

    it('removing a value calls onSearch with an empty string', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onSearch={spy}
          value="Apple"
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('when false', () => {
    it('selecting a value calls onSearch with the selected value', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onSearch={spy}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expectToBeClosed();
      expect(spy).toHaveBeenCalledWith('Apple');
    });

    it('removing a value calls onSearch with an empty string', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onSearch={spy}
          value="Apple"
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('when true', () => {
    it('selecting a value calls onSearch with an empty string', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onSearch={spy}
          clearOnSelect
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expectToBeClosed();
      expect(spy).toHaveBeenCalledWith('');
    });

    it('removing a value calls onSearch with an empty string', async () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          onSearch={spy}
          value="Apple"
          clearOnSelect
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      expect(spy).toHaveBeenCalledWith('');
    });
  });
});

describe('closeOnSelect', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  describe('with default value', () => {
    it('closes the list box after selecting an item', async () => {
      render(<ComboBoxWrapper options={options} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expectToBeClosed();
    });
  });

  describe('when true', () => {
    it('closes the list box after selecting an item', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          closeOnSelect
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expectToBeClosed();
    });
  });

  describe('when false', () => {
    it('leaves the list box after selecting an item', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          closeOnSelect={false}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expectToBeOpen();
    });

    it('closes the list box if the only value', async () => {
      render(
        <ComboBoxWrapper
          options={['Orange']}
          closeOnSelect={false}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expectToBeClosed();
    });
  });
});

describe('findSuggestion', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('skips options by returning null', async () => {
    const findSuggestion = jest.fn((option) => {
      if (option.label !== 'Orange') {
        return null;
      }
      return true;
    });
    render(
      <ComboBoxWrapper
        options={options}
        autoselect
        findSuggestion={findSuggestion}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'o');
    expectToHaveSelectedOption(screen.getByRole('option', { name: 'Orange' }));
  });

  it('ends the search by returning false', async () => {
    const findSuggestion = jest.fn((option) => {
      if (option.label === 'Pear') {
        return false;
      }
      if (option.label === 'Orange') {
        return true;
      }
      return null;
    });
    render(
      <ComboBoxWrapper
        options={options}
        autoselect
        findSuggestion={findSuggestion}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'o');
    expectToBeOpen();
  });
});

describe('notFoundMessage', () => {
  describe('by default', () => {
    it('displays not found if search returns no results', async () => {
      render(<ComboBoxWrapper options={[]} />);
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('does not display a not found if busy', async () => {
      render(
        <ComboBoxWrapper
          options={[]}
          busy
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('does not display a not found if options are null', async () => {
      render(<ComboBoxWrapper options={null} />);
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('does not display a not found if options are undefined', async () => {
      render(<ComboBoxWrapper options={undefined} />);
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('does not display a not found if there is no search', async () => {
      render(<ComboBoxWrapper options={[]} />);
      await userEvent.tab();
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('does not display a not found if the list box is closed', async () => {
      render(<ComboBoxWrapper options={[]} />);
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('does not display a not found if the search term matches the current option', async () => {
      render(
        <ComboBoxWrapper
          options={[]}
          value="foo"
        />,
      );
      await userEvent.tab();
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });
  });

  describe('with custom message', () => {
    it('displays custom not found if search returns no results', async () => {
      render(
        <ComboBoxWrapper
          options={[]}
          notFoundMessage={() => 'custom message'}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      expect(screen.getByText('custom message')).toBeInTheDocument();
    });
  });

  describe('when null', () => {
    it('does not display a not found message when no results are found', async () => {
      render(
        <ComboBoxWrapper
          options={[]}
          notFoundMessage={null}
        />,
      );
      await userEvent.type(screen.getByRole('combobox'), 'foo');
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });
  });
});

describe('assistiveHint', () => {
  describe('by default', () => {
    it('describes the combo box', () => {
      render(<ComboBoxWrapper options={['foo', 'bar']} />);
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
        'When results are available use up and down arrows to review and enter to select',
      );
    });
  });

  describe('when falsey', () => {
    it('the combo box has no descripton', () => {
      render(
        <ComboBoxWrapper
          options={['foo', 'bar']}
          assistiveHint={null}
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription('');
    });
  });

  describe('when a custom value', () => {
    it('describes the combo box', () => {
      render(
        <ComboBoxWrapper
          options={['foo', 'bar']}
          assistiveHint="foo bar"
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
        'foo bar',
      );
    });
  });
});

describe('aria live message', () => {
  const options = ['foo'];

  it('adds a debounced message', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { rerender } = render(<ComboBoxWrapper options={options} />);

    expect(
      await collectLiveMessages(async () => {
        await user.tab();
        act(() => jest.advanceTimersByTime(1400));
      }),
    ).toEqual(['1 result is available']);

    expect(
      await collectLiveMessages(async () => {
        rerender(<ComboBoxWrapper options={['foo', 'bar']} />);
        act(() => jest.advanceTimersByTime(1400));
      }),
    ).toEqual(['2 results are available']);

    expect(
      await collectLiveMessages(async () => {
        await user.keyboard('{ArrowDown}');
        act(() => jest.advanceTimersByTime(1400));
      }),
    ).toEqual(['2 results are available, foo 1 of 2 is highlighted']);

    expect(
      await collectLiveMessages(async () => {
        await user.keyboard('{ArrowDown}');
        act(() => jest.advanceTimersByTime(1400));
      }),
    ).toEqual(['2 results are available, bar 2 of 2 is highlighted']);

    expect(
      await collectLiveMessages(async () => {
        rerender(<ComboBoxWrapper options={[]} />);
        await user.type(document.activeElement, 'a');
        act(() => jest.advanceTimersByTime(1400));
      }),
    ).toEqual(['No results found']);
  });

  it('does not update the message if not focused', async () => {
    jest.useFakeTimers();

    expect(
      await collectLiveMessages(async () => {
        render(<ComboBoxWrapper options={options} />);
        act(() => jest.advanceTimersByTime(1400));
      }),
    ).toEqual([]);
  });

  describe('foundOptionsMessage', () => {
    it('customises the found options message', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const spy = jest.fn((ops) => `found ${ops.length} options`);
      expect(
        await collectLiveMessages(async () => {
          render(
            <ComboBoxWrapper
              options={['foo', 'bar']}
              foundOptionsMessage={spy}
            />,
          );
          await user.tab();
          act(() => jest.advanceTimersByTime(1400));
        }),
      ).toEqual(['found 2 options']);
    });
  });

  describe('notFoundMessage', () => {
    it('customises the not found message', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      expect(
        await collectLiveMessages(async () => {
          render(
            <ComboBoxWrapper
              options={[]}
              notFoundMessage={() => 'not found'}
            />,
          );
          await user.type(screen.getByRole('combobox'), 'a');
          act(() => jest.advanceTimersByTime(1400));
        }),
      ).toEqual(['not found']);
    });
  });

  describe('selectedOptionMessage', () => {
    it('customises the not found message', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      expect(
        await collectLiveMessages(async () => {
          render(
            <ComboBoxWrapper
              options={['foo']}
              selectedOptionMessage={(opt, opts) =>
                `${opt.label} is one of ${opts.length}`
              }
            />,
          );
          await user.tab();
          await user.keyboard('{ArrowDown}');
          act(() => jest.advanceTimersByTime(1400));
        }),
      ).toEqual(['1 result is available, foo is one of 1']);
    });
  });
});

describe('id', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Pear' },
    { label: 'Orange', group: 'Citrus' },
  ];

  it('prefixes all ids', async () => {
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        id="foo"
      />,
    );
    await userEvent.tab();
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('div')).not.toHaveAttribute('id');
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'foo');
    expect(screen.getByRole('listbox')).toHaveAttribute('id', 'foo_listbox');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'id',
      'foo_option_apple',
    );
    expect(screen.getAllByRole('option')[1]).toHaveAttribute(
      'id',
      'foo_option_pear',
    );
    expect(screen.getAllByRole('option')[2]).toHaveAttribute(
      'id',
      'foo_option_orange',
    );

    expect(document.getElementById('foo_down_arrow')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_clear_button')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_aria_description')).toBeInstanceOf(
      Element,
    );
    expect(document.getElementById('foo_not_found')).toBeInstanceOf(Element);
  });
});

describe('classPrefix', () => {
  const options = [{ label: 'Orange', group: 'Citrus' }];

  it('removes classes when nil', async () => {
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        classPrefix={null}
      />,
    );
    await userEvent.tab();
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('div')).not.toHaveClass();
    expect(screen.getByRole('combobox')).not.toHaveClass();
    expect(screen.getByRole('listbox')).not.toHaveClass();
    expect(screen.getByRole('option')).not.toHaveClass();
    expect(screen.getByRole('option').previousSibling).not.toHaveClass();

    expect(document.getElementById('id_down_arrow')).not.toHaveClass();
    expect(document.getElementById('id_clear_button')).not.toHaveClass();
    expect(document.getElementById('id_not_found')).not.toHaveClass();
  });

  it('prefixes all classes', async () => {
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        classPrefix="foo"
      />,
    );
    await userEvent.tab();
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('div')).toHaveClass('foo');
    expect(screen.getByRole('combobox')).toHaveClass('foo__input');
    expect(screen.getByRole('listbox')).toHaveClass('foo__listbox');
    expect(screen.getByRole('option')).toHaveClass('foo__option');
    expect(screen.getByRole('option').previousSibling).toHaveClass(
      'foo__group-label',
    );

    expect(document.getElementById('id_down_arrow')).toHaveClass(
      'foo__down-arrow',
    );
    expect(document.getElementById('id_clear_button')).toHaveClass(
      'foo__clear-button',
    );
    expect(document.getElementById('id_not_found')).toHaveClass(
      'foo__not-found',
    );
  });
});

describe('skipOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows options to be skipped moving forward', async () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    render(
      <ComboBoxWrapper
        options={options}
        skipOption={skipOption}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
  });

  it('allows options to be skipped moving backwards', async () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    render(
      <ComboBoxWrapper
        options={options}
        skipOption={skipOption}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
  });
});

describe('onChange', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('triggers on typing', async () => {
    const spy = jest.fn((e) => e.persist());
    render(
      <ComboBoxWrapper
        options={options}
        onChange={spy}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'foo');
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'change',
        target: expect.objectContaining({
          value: 'foo',
          nodeName: 'INPUT',
        }),
      }),
    );
  });
});

describe('onBlur', () => {
  it('is called when the input is blurred', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={['foo']}
        onBlur={spy}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(spy).not.toHaveBeenCalled();
    await userEvent.tab();
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('onFocus', () => {
  it('is called when the input is focused', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={['foo']}
        onFocus={spy}
      />,
    );
    await userEvent.tab();
    expect(spy).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.tab();
    await waitFor(() => {
      expect(document.body).toHaveFocus();
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('aria-describedby', () => {
  it('is appended to the input', async () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        aria-describedby="foo"
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-describedby',
      'foo id_aria_description',
    );
  });
});

describe('boolean attributes', () => {
  it.each(['disabled', 'readOnly', 'required'])(
    '%s is added to input',
    (name) => {
      const props = { [name]: true };
      render(
        <ComboBoxWrapper
          options={['foo']}
          {...props}
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(name);
    },
  );
});

describe('string attributes', () => {
  it.each([
    'autoComplete',
    'autoCapitalize',
    'autoCorrect',
    'inputMode',
    'pattern',
    'placeholder',
    'spellCheck',
  ])('%s is added to input', (name) => {
    const props = { [name]: 'foo' };
    render(
      <ComboBoxWrapper
        options={['foo']}
        {...props}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute(name, 'foo');
  });
});

describe('number attributes', () => {
  it.each(['size', 'maxLength', 'minLength'])(
    '%s is added to input',
    (name) => {
      const props = { [name]: 2 };
      render(
        <ComboBoxWrapper
          options={['foo']}
          {...props}
        />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(name, '2');
    },
  );
});

describe('autoFocus', () => {
  it('focuses the input', () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        autoFocus
      />,
    );
    // React polyfills autofocus behaviour rather than adding the attribute
    expectToBeOpen();
  });
});

describe('ref', () => {
  it('references the input for an object ref', () => {
    const ref = { current: null };
    render(
      <ComboBoxWrapper
        options={['foo']}
        ref={ref}
      />,
    );
    expect(ref.current).toEqual(screen.getByRole('combobox'));
  });

  it('references the input for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    render(
      <ComboBoxWrapper
        options={['foo']}
        ref={ref}
      />,
    );
    expect(value).toEqual(screen.getByRole('combobox'));
  });
});

describe('renderWrapper', () => {
  it('allows the wrapper to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper
        options={['foo']}
        renderWrapper={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toEqual('DL');
    expect(wrapper).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderWrapper={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderInput', () => {
  it('allows the input to be replaced', () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderInput={(props) => (
          <textarea
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    expect(screen.getByRole('combobox').tagName).toEqual('TEXTAREA');
    expect(screen.getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderInput={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderListBox', () => {
  it('allows the list box to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderListBox={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('listbox').tagName).toEqual('DL');
    expect(screen.getByRole('listbox')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', async () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderListBox={spy}
        test="foo"
      />,
    );
    await userEvent.tab();
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroup', () => {
  it('allows the group to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroup={({ key, ...props }) => (
          <dl
            key={key}
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    await userEvent.tab();
    const group = screen.getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', async () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroup={spy}
        test="foo"
      />,
    );
    await userEvent.tab();

    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: true,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
        group: expect.objectContaining({ label: 'bar' }),
        groupChildren: expect.any(Array),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroupLabel', () => {
  it('allows the group label to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroupLabel={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    await userEvent.tab();

    const group = screen.getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', async () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroupLabel={spy}
        test="foo"
      />,
    );
    await userEvent.tab();

    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: true,
        search: null,
        notFound: false,
        currentOption: null,
        suggestedOption: null,
        group: expect.objectContaining({ label: 'bar' }),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroupName', () => {
  it('allows the group label to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroupName={(props) => <span>{props.children} foo</span>}
      />,
    );
    await userEvent.tab();

    const group = screen.getByRole('listbox').firstChild;
    expect(group).toHaveTextContent('foo');
  });

  it('is called with context and props', async () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroupName={spy}
        test="foo"
      />,
    );
    await userEvent.tab();

    expect(spy).toHaveBeenLastCalledWith(
      { children: 'bar' },
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: true,
        search: null,
        notFound: false,
        currentOption: null,
        suggestedOption: null,
        group: expect.objectContaining({ label: 'bar' }),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderOption', () => {
  it('allows the option to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderOption={({ key, ...props }) => (
          <dl
            key={key}
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('option').tagName).toEqual('DL');
    expect(screen.getByRole('option')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', async () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderOption={spy}
        test="foo"
      />,
    );
    await userEvent.tab();
    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: true,
        search: null,
        notFound: false,
        currentOption: null,
        suggestedOption: null,
        option: expect.objectContaining({ label: 'foo' }),
        selected: false,
        group: undefined,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroupAccessibleLabel', () => {
  it('allows the group accessible label to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroupAccessibleLabel={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('option').firstChild.tagName).toEqual('DL');
    expect(screen.getByRole('option').firstChild).toHaveAttribute(
      'data-foo',
      'bar',
    );
  });

  it('is called with context and props', async () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        renderGroupAccessibleLabel={spy}
        test="foo"
      />,
    );
    await userEvent.tab();
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        children: 'bar\u00A0',
      }),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: true,
        search: null,
        notFound: false,
        currentOption: null,
        suggestedOption: null,
        group: expect.objectContaining({ label: 'bar' }),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderValue', () => {
  it('allows the value to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderValue={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('option').firstChild.tagName).toEqual('DL');
    expect(screen.getByRole('option').firstChild).toHaveAttribute(
      'data-foo',
      'bar',
    );
  });

  it('is called with context and props', async () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderValue={spy}
        test="foo"
      />,
    );
    await userEvent.tab();
    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: true,
        search: null,
        notFound: false,
        currentOption: null,
        suggestedOption: null,
        option: expect.objectContaining({ label: 'foo' }),
        selected: false,
        group: undefined,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderDownArrow', () => {
  it('allows the down arrow to be replaced', () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderDownArrow={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow.tagName).toEqual('DL');
    expect(arrow).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderDownArrow={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderClearButton', () => {
  it('allows the clear button to be replaced', () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        value="foo"
        renderClearButton={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    const button = screen.getByRole('button', { name: 'Clear foo' });
    expect(button.tagName).toEqual('DL');
    expect(button).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderClearButton={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderAriaDescription', () => {
  it('allows the clear button to be replaced', () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        value="foo"
        renderAriaDescription={(props) => (
          <dl
            data-foo="bar"
            {...props}
          />
        )}
      />,
    );
    const description = document.getElementById('id_aria_description');
    expect(description.tagName).toEqual('DL');
    expect(description).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderAriaDescription={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderNotFound', () => {
  it('allows the not found message to be replaced', async () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderNotFound={(props) => (
          <div
            data-testid="notfound"
            {...props}
          />
        )}
      />,
    );
    expect(screen.getByTestId('notfound')).toBeInTheDocument();
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render(
      <ComboBoxWrapper
        options={['foo']}
        renderNotFound={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: null,
        notFound: false,
        suggestedOption: null,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('visuallyHiddenClassName', () => {
  it('allows custom props', async () => {
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        visuallyHiddenClassName="bar"
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('option').firstChild).toHaveClass('bar');
  });
});

describe('onLayoutListBox', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  beforeEach(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => cb());
  });

  it('is called when the component is rendered', async () => {
    const onLayoutListBox = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />,
    );
    expect(onLayoutListBox).toHaveBeenCalledWith({
      listbox: screen.getByRole('listbox', { hidden: true }),
      input: screen.getByRole('combobox'),
    });
  });

  it('is called when the listbox is displayed', async () => {
    const onLayoutListBox = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />,
    );
    await userEvent.tab();
    expect(onLayoutListBox).toHaveBeenCalledWith({
      listbox: screen.getByRole('listbox'),
      input: screen.getByRole('combobox'),
    });
  });

  it('is called when the listbox options change', async () => {
    const onLayoutListBox = jest.fn();
    const { rerender } = render(
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />,
    );
    await userEvent.tab();
    onLayoutListBox.mockClear();
    rerender(
      <ComboBoxWrapper
        options={['strawberry']}
        onLayoutListBox={onLayoutListBox}
      />,
    );
    expect(onLayoutListBox).toHaveBeenCalledWith({
      listbox: screen.getByRole('listbox'),
      input: screen.getByRole('combobox'),
    });
  });

  it('is called when the listbox is closed', async () => {
    const onLayoutListBox = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />,
    );
    await userEvent.tab();
    onLayoutListBox.mockClear();
    await userEvent.keyboard('{Escape}');
    expect(onLayoutListBox).toHaveBeenCalledWith({
      listbox: screen.getByRole('listbox', { hidden: true }),
      input: screen.getByRole('combobox'),
    });
  });

  it('accepts an array of handlers', async () => {
    const onLayoutListBox1 = jest.fn();
    const onLayoutListBox2 = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={[onLayoutListBox1, onLayoutListBox2]}
      />,
    );
    await userEvent.tab();
    expect(onLayoutListBox1).toHaveBeenCalledWith({
      listbox: screen.getByRole('listbox'),
      input: screen.getByRole('combobox'),
    });
    expect(onLayoutListBox2).toHaveBeenCalledWith({
      listbox: screen.getByRole('listbox'),
      input: screen.getByRole('combobox'),
    });
  });
});

describe('other props', () => {
  it('are discarded', () => {
    render(
      <ComboBoxWrapper
        options={['foo']}
        foo="bar"
      />,
    );
    expect(screen.getByRole('combobox')).not.toHaveAttribute('foo');
  });
});
