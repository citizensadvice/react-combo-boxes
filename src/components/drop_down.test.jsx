/* eslint-disable testing-library/no-node-access */

import React, { useEffect, useState, forwardRef } from 'react';
import { render, waitFor, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropDown } from './drop_down';
import { DISPATCH } from '../constants/dispatch';

const DropDownWrapper = forwardRef(({ value: _value, ...props }, ref) => {
  const [value, setValue] = useState(_value);

  useEffect(() => setValue(_value), [_value]);

  return (
    <DropDown
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
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(listbox).not.toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'false');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveFocusedOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(option).toHaveFocus();
}

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders a closed drop down', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expectToBeClosed();
      });

      it('renders a drop down with a selected value', () => {
        render(<DropDownWrapper options={options} value="Orange" />);
        expect(screen.getByRole('combobox')).toHaveTextContent('Orange');
      });

      describe('expanding the list box', () => {
        describe('with no value', () => {
          describe('by clicking', () => {
            it('opens the drop down with the first option selected', async () => {
              render(<DropDownWrapper options={options} />);
              await userEvent.click(screen.getByRole('combobox'));
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            });

            it('does not open the drop down with a right mouse click', async () => {
              render(<DropDownWrapper options={options} />);
              const input = screen.getByRole('combobox');
              input.focus();
              await userEvent.pointer({ target: input, keys: '[MouseRight]' });
              expectToBeClosed();
            });
          });

          describe('pressing enter', () => {
            it('opens drop down', async () => {
              render(<DropDownWrapper options={options} />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{Enter}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            });
          });

          describe('pressing space', () => {
            it('opens the drop down', async () => {
              render(<DropDownWrapper options={options} />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard(' ');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            });
          });

          describe('pressing down arrow', () => {
            it('opens the drop down with the down arrow', async () => {
              render(<DropDownWrapper options={options} />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{ArrowDown}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            });

            it('opens the drop down with the down arrow + alt', async () => {
              render(<DropDownWrapper options={options} />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            });

            it('calls onLayoutFocusedOption', async () => {
              const spy = jest.fn();
              render((
                <DropDownWrapper options={options} onLayoutFocusedOption={spy} />
              ));
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{ArrowDown}');
              expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Apple' }), listbox: screen.getByRole('listbox') });
            });
          });

          describe('pressing up arrow', () => {
            it('opens the drop down with the up arrow', async () => {
              render(<DropDownWrapper options={options} />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{ArrowUp}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            });

            it('does not open the drop down with the up arrow + alt', async () => {
              render(<DropDownWrapper options={options} />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
              expectToBeClosed();
            });

            it('calls onLayoutFocusedOption', async () => {
              const spy = jest.fn();
              render((
                <DropDownWrapper options={options} onLayoutFocusedOption={spy} />
              ));
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{ArrowUp}');
              expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Apple' }), listbox: screen.getByRole('listbox') });
            });
          });
        });

        describe('with a value', () => {
          describe('by clicking', () => {
            it('opens the drop down with the value selected', async () => {
              render(<DropDownWrapper options={options} value="Orange" />);
              screen.getByRole('combobox').focus();
              await userEvent.click(screen.getByRole('combobox'));
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            });
          });

          describe('pressing enter', () => {
            it('opens drop down with the value selected', async () => {
              render(<DropDownWrapper options={options} value="Orange" />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{Enter}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            });
          });

          describe('pressing space', () => {
            it('opens the drop down', async () => {
              render(<DropDownWrapper options={options} value="Orange" />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard(' ');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            });
          });

          describe('pressing down arrow', () => {
            it('opens the drop down with the down arrow', async () => {
              render(<DropDownWrapper options={options} value="Orange" />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{ArrowDown}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            });

            it('opens the drop down with the down arrow + alt', async () => {
              render(<DropDownWrapper options={options} value="Orange" />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            });
          });

          describe('pressing up arrow', () => {
            it('opens the drop down with the up arrow', async () => {
              render(<DropDownWrapper options={options} value="Orange" />);
              screen.getByRole('combobox').focus();
              await userEvent.keyboard('{ArrowUp}');
              expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            });
          });
        });
      });

      describe('navigating options in an open listbox', () => {
        describe('pressing the down arrow', () => {
          it('moves to the next option', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves to the first option from the last option', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing with the alt key pressed', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            expect(spy).not.toHaveBeenCalled();
          });

          it('calls onLayoutFocusedOption', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onLayoutFocusedOption={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Banana' }), listbox: screen.getByRole('listbox') });
          });
        });

        describe('pressing the up arrow', () => {
          it('moves to the previous option', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowUp}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves to the last option from the first option', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowUp}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            expect(spy).not.toHaveBeenCalled();
          });

          it('calls onLayoutFocusedOption', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onLayoutFocusedOption={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowUp}');
            expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Orange' }), listbox: screen.getByRole('listbox') });
          });
        });

        describe('pressing the home key', () => {
          it('moves to the first option with the home key', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{Home}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the end key', () => {
          it('moves to the last option with the end key', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{End}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the page up key', () => {
          it('moves the page of options down', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{PageUp}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the page down key', () => {
          it('moves the page of options down', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{PageDown}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('typing', () => {
          it('moves the option when typing without calling onValue', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('b');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves the option when typing case-insensitively', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('B');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });

          it('does not move the option if there is no match', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('bz');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });

          it('does not move the option if pressing space', async () => {
            render((
              <DropDownWrapper
                options={options}
                value="Banana"
                placeholderOption="Please choose"
              />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard(' ');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });

          it('moves the option when typing multiple letters', async () => {
            const similarOptions = [{ label: 'Banana' }, { label: 'Blackberry' }];
            render((
              <DropDownWrapper options={similarOptions} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('bl');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Blackberry' }));
          });

          it('moves the option if including a space', async () => {
            const similarOptions = [{ label: 'a b' }, { label: 'a c' }];
            render((
              <DropDownWrapper options={similarOptions} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('a c');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'a c' }));
          });

          it('resets typing after a short delay', async () => {
            jest.useFakeTimers();
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            render(<DropDownWrapper options={options} />);
            await user.click(screen.getByRole('combobox'));
            await user.keyboard('b');
            act(() => jest.advanceTimersByTime(1000));
            await user.keyboard('o');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
          });

          it('does nothing if the meta key is pressed', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{Meta>}b{/Meta}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
          });

          it('does nothing if the control key is pressed', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{Control>}b{/Control}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
          });

          it('does nothing if the alt key is pressed', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{Alt>}b{/Alt}');
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });
      });

      describe('selecting an option', () => {
        describe('when clicking on an option', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expectToBeClosed();
            expect(screen.getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
          });

          it('does nothing if a different mouse button is pressed', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.pointer({ target: screen.getByRole('option', { name: 'Banana' }), keys: '[MouseRight]' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('when pressing enter on an option', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expectToBeClosed();
            expect(screen.getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when pressing escape on an option', () => {
          it('calls does not select the value', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Escape}');
            expect(spy).not.toHaveBeenCalled();
            expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
          });

          it('closes the list box and selects the combobox', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Escape}');
            expectToBeClosed();
            expect(screen.getByRole('combobox')).toHaveFocus();
          });
        });

        describe('when pressing tab on an option', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();

            await waitFor(() => {
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });
          });

          it('closes the list box and selects the combobox', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();

            await waitFor(() => {
              expectToBeClosed();
            });
            expect(screen.getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when pressing shift + tab on an option', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Shift>}{Tab}</Shift}');
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Shift>}{Tab}</Shift}');
            expectToBeClosed();
            expect(screen.getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Shift>}{Tab}</Shift}');
            expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when pressing ArrowUp + alt on an option', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Alt>}{ArrowUp}</Alt}');
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Alt>}{ArrowUp}</Alt}');
            expectToBeClosed();
            expect(screen.getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            render(<DropDownWrapper options={options} />);
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Alt>}{ArrowUp}</Alt}');
            expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when blurring the listbox', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render((
              <>
                <DropDownWrapper options={options} onValue={spy} />
                <input />
              </>
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            await waitFor(() => {
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });
          });

          it('updates the displayed value', async () => {
            render((
              <>
                <DropDownWrapper options={options} />
                <input />
              </>
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            await waitFor(() => {
              expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
            });
          });
        });
      });

      describe('within a closed listbox', () => {
        describe('typing', () => {
          it('selects the option when typing', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('B');
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('selects the option when typing case-insensitively', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('B');
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('does not select the option if there is no match', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('z');
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves the option when typing multiple letters', async () => {
            const spy = jest.fn();
            const similarOptions = [{ label: 'Banana' }, { label: 'Blackberry' }];
            render((
              <DropDownWrapper options={similarOptions} onValue={spy} />
            ));
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('bl');
            expect(spy).toHaveBeenCalledWith({ label: 'Blackberry' });
          });

          it('resets typing after a short delay', async () => {
            const spy = jest.fn();
            jest.useFakeTimers();
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await user.keyboard('b');
            act(() => jest.advanceTimersByTime(1000));
            await user.keyboard('l');
            expect(spy).not.toHaveBeenCalledWith({ label: 'Blackberry' });
          });

          it('does nothing if the metaKey is pressed', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('{Meta>}b{/Meta}');
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing if the ctrlKey is pressed', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('{Control>}b{/Control}');
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing if the altKey is pressed', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('{Alt>}b{/Alt}');
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing enter', () => {
          it('does not select an item', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} value="xxx" onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('{Enter}');
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing escape', () => {
          it('does not select an item', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} value="xxx" onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('{Escape}');
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing tab', () => {
          it('does not select an item', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} value="xxx" onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.tab();
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing home', () => {
          it('does not select an item', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} value="Orange" onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('{Home}');
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing end', () => {
          it('does not select an item', async () => {
            const spy = jest.fn();
            render(<DropDownWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.keyboard('{End}');
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', async () => {
        const { container } = render((
          <DropDownWrapper options={options} />
        ));
        await userEvent.click(screen.getByRole('combobox'));
        expect(container).toMatchSnapshot();
        expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-disabled', 'true');
      });

      it('selects a disabled option with the arrow keys', async () => {
        render(<DropDownWrapper options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('{ArrowDown}');
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
      });

      it('does not select a disabled option by typing', async () => {
        render(<DropDownWrapper options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('b');
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
      });

      describe('first option is disabled', () => {
        const disabledFirstOptions = [{ label: 'Apple', disabled: true }, 'Banana'];

        it('defaults selection to the first non-disabled option', async () => {
          render((
            <DropDownWrapper options={disabledFirstOptions} />
          ));
          await userEvent.click(screen.getByRole('combobox'));
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
        });
      });

      describe('only disabled options', () => {
        const onlyDisabledOptions = [
          { label: 'Apple', disabled: true },
          { label: 'Banana', disabled: true },
        ];

        it('does not select any option option', async () => {
          render((
            <DropDownWrapper options={onlyDisabledOptions} />
          ));
          await userEvent.click(screen.getByRole('combobox'));
          expect(screen.getByRole('combobox')).toHaveFocus();
          expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
        });

        it('allows options to be focused', async () => {
          render((
            <DropDownWrapper options={onlyDisabledOptions} />
          ));
          await userEvent.click(screen.getByRole('combobox'));
          await userEvent.keyboard('{ArrowDown}');
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
        });
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });
        });

        describe('when pressing escape on an option', () => {
          it('closes the listbox but does not select the item', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Escape}');
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed();
          });
        });

        describe('when pressing tab on an option', () => {
          it('closes the listbox but does not select the item', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed();
          });
        });

        describe('when pressing shift + tab on an option', () => {
          it('does not close the listbox or select the item', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab({ shift: true });
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed();
          });
        });

        describe('when pressing arrow up + alt on an option', () => {
          it('closes the listbox without selecting the item', async () => {
            const spy = jest.fn();
            render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}{Alt>}{ArrowUp}{/Alt}');
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed();
            expect(screen.getByRole('combobox')).toHaveFocus();
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
            const spy = jest.fn();
            render((
              <>
                <DropDownWrapper options={options} onValue={spy} />
                <input type="text" />
              </>
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.tab();
            await waitFor(() => {
              expectToBeClosed();
            });
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('value', () => {
      it('is used as a options identity', async () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        render(<DropDownWrapper options={options} value={2} onValue={spy} />);
        await userEvent.click(screen.getByRole('combobox'));
        expectToHaveFocusedOption(screen.getAllByRole('option')[1]);
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', async () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        render(<DropDownWrapper options={options} value={2} onValue={spy} />);
        await userEvent.click(screen.getByRole('combobox'));
        expectToHaveFocusedOption(screen.getAllByRole('option')[1]);
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('html', () => {
      it('sets attributes on the option', async () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        render(
          <DropDownWrapper options={options} />,
        );
        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(screen.getByRole('option')).toHaveClass('class');
      });

      describe('html id', () => {
        it('is used as the options id', async () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }];
          render(
            <DropDownWrapper options={options} />,
          );
          await userEvent.click(screen.getByRole('combobox'));
          expect(screen.getByRole('option')).toHaveAttribute('id', 'xxx');
          expectToHaveFocusedOption(screen.getByRole('option'));
        });

        it('will not use duplicate ids', async () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }, { label: 'bar', html: { id: 'xxx' } }];
          render(
            <DropDownWrapper options={options} />,
          );
          await userEvent.click(screen.getByRole('combobox'));
          await userEvent.keyboard('{ArrowUp}');
          expect(screen.getByRole('option', { name: 'foo' })).toHaveAttribute('id', 'xxx');
          expect(screen.getByRole('option', { name: 'bar' })).toHaveAttribute('id', 'xxx_1');
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'bar' }));
        });
      });
    });

    describe('group', () => {
      const options = [
        { label: 'Apple' },
        { label: 'Orange', group: 'Citrus' },
        { label: 'Lemon', group: 'Citrus' },
        { label: 'Raspberry', group: 'Berry' },
        { label: 'Strawberry', group: 'Berry' },
      ];

      it('renders grouped options', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('does not select a group with the arrow keys', async () => {
        render(<DropDownWrapper options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('{ArrowDown}');
        expect(document.activeElement).toHaveTextContent('Orange');
      });

      it('does not select a group by typing', async () => {
        render(<DropDownWrapper options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('c');
        expect(document.activeElement).toHaveTextContent('Apple');
      });

      it('triggers onValue when an option is selected', async () => {
        const spy = jest.fn();
        render(<DropDownWrapper options={options} onValue={spy} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', async () => {
        render(<DropDownWrapper options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(screen.getByRole('combobox')).toHaveTextContent('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', async () => {
          const spy = jest.fn();
          render(<DropDownWrapper options={options} onValue={spy} />);
          await userEvent.click(screen.getByRole('combobox'));
          await userEvent.click(screen.getAllByText('Citrus')[0]);
          expect(spy).not.toHaveBeenCalled();
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
        });
      });
    });

    describe('other attributes', () => {
      it('does not render them', async () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        render(<DropDownWrapper options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.getByRole('option')).not.toHaveAttribute('data-foo', 'bar');
      });
    });

    describe('missing label', () => {
      it('treats as a blank string', () => {
        const options = [{}];
        const { container } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expectToBeClosed();
      });
    });
  });

  describe('options as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders a closed drop down', () => {
      const { container } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed();
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(<DropDownWrapper options={options} onValue={spy} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith('Banana');
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('triggers the onValue callback with an empty string', async () => {
      const spy = jest.fn();
      render(<DropDownWrapper options={['', 'foo']} onValue={spy} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{Enter}');
      expect(spy).toHaveBeenCalledWith('');
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as array of numbers', () => {
    const options = [0, 1, 2, 3];

    it('renders a closed drop down', () => {
      const { container } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed();
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(<DropDownWrapper options={options} onValue={spy} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith(1);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('triggers the onValue callback with 0', async () => {
      const spy = jest.fn();
      render(<DropDownWrapper options={[1, 0]} onValue={spy} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(spy).toHaveBeenCalledWith(0);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as null', () => {
    it('renders a closed drop down with the option as an empty string', async () => {
      const { container } = render(<DropDownWrapper options={[null]} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed();
      await userEvent.click(screen.getByRole('combobox'));
      expectToHaveFocusedOption(screen.getByRole('option'));
      expect(screen.getByRole('option')).toHaveTextContent('');
      expect(screen.getByRole('option')).not.toHaveTextContent('null');
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(<DropDownWrapper options={[null]} onValue={spy} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{Enter}');
      expect(spy).toHaveBeenCalledWith(null);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as undefined', () => {
    it('renders a closed drop down with the option as an empty string', async () => {
      const { container } = render(<DropDownWrapper options={[undefined]} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed();
      await userEvent.click(screen.getByRole('combobox'));
      expectToHaveFocusedOption(screen.getByRole('option'));
      expect(screen.getByRole('option')).toHaveTextContent('');
      expect(screen.getByRole('option')).not.toHaveTextContent('undefined');
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(<DropDownWrapper options={[undefined]} onValue={spy} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{Enter}');
      expect(spy).toHaveBeenCalledWith(undefined);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('no options', () => {
    it('does not open the listbox of click', async () => {
      render(
        <DropDownWrapper options={[]} />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      expectToBeClosed();
    });

    it('does not open the listbox on arrow down', async () => {
      render(
        <DropDownWrapper options={[]} />,
      );
      await userEvent.keyboard('{ArrowDown}');
      expectToBeClosed();
    });

    it('displays a none breaking space as the current selection', () => {
      render(
        <DropDownWrapper options={[]} />,
      );
      expect(screen.getByRole('combobox').textContent).toEqual('\u00A0'); // eslint-disable-line jest-dom/prefer-to-have-text-content
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', async () => {
      const spy = jest.fn();
      render(<DropDownWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByRole('option', { name: 'Orange' }));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', async () => {
      render(<DropDownWrapper
        options={options}
        mapOption={({ name }) => ({ label: name })}
      />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByRole('option', { name: 'Orange' }));
      expect(screen.getByRole('combobox')).toHaveTextContent('Orange');
    });
  });

  describe('updating options', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const newOptions = ['Strawberry', 'Raspberry', 'Banana'];

    it('updates the options', async () => {
      const { container, rerender } = render(<DropDownWrapper options={options} />);
      await userEvent.click(screen.getByRole('combobox'));
      rerender(<DropDownWrapper options={newOptions} />);
      expect(container).toMatchSnapshot();
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', async () => {
        const { rerender } = render(<DropDownWrapper options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('{ArrowDown}');
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
        rerender(<DropDownWrapper options={newOptions} />);
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
      });
    });

    describe('update does not contain the selected option', () => {
      it('resets the currently selected option', async () => {
        const { rerender } = render(<DropDownWrapper options={options} value="Orange" />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.keyboard('{ArrowDown}');
        rerender(<DropDownWrapper options={newOptions} />);
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'Strawberry' }));
      });
    });
  });
});

describe('value', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('sets the initial focused option', async () => {
    render(<DropDownWrapper options={options} value="Banana" />);
    await userEvent.click(screen.getByRole('combobox'));
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
  });

  it('onLayoutFocusedOption', async () => {
    const spy = jest.fn();
    render((
      <DropDownWrapper options={options} value="Banana" onLayoutFocusedOption={spy} />
    ));
    await userEvent.click(screen.getByRole('combobox'));
    expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Banana' }), listbox: screen.getByRole('listbox') });
  });

  describe('value is not in options', () => {
    it('sets the initial focused option to the first option', async () => {
      render((
        <DropDownWrapper options={options} value="Strawberry" />
      ));
      await userEvent.click(screen.getByRole('combobox'));
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
    });

    it('displays value as the combo box label', () => {
      render((
        <DropDownWrapper options={options} value="Strawberry" />
      ));
      expect(screen.getByRole('combobox')).toHaveTextContent('Strawberry');
    });
  });

  describe('updating the value', () => {
    it('updates the aria-selected value of an open listbox', async () => {
      const { rerender } = render(<DropDownWrapper options={options} value="Orange" />);
      await userEvent.click(screen.getByRole('combobox'));
      rerender(<DropDownWrapper options={options} value="Apple" />);
      expect(document.querySelector('[aria-selected="true"]')).toEqual(screen.getByRole('option', { name: 'Apple' }));
    });

    it('changes the focused value', async () => {
      const { rerender } = render(<DropDownWrapper options={options} value="Orange" />);
      await userEvent.click(screen.getByRole('combobox'));
      rerender(<DropDownWrapper options={options} value="Apple" />);
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
    });

    describe('value is not in options', () => {
      it('retains existing selection', async () => {
        const { rerender } = render(<DropDownWrapper options={options} value="Orange" />);
        await userEvent.click(screen.getByRole('combobox'));
        rerender(<DropDownWrapper options={options} value="Potato" />);
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
      });
    });
  });
});

describe('placeholderOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a placeholder option', async () => {
    const { container } = render(<DropDownWrapper options={options} placeholderOption="Please select…" />);
    expect(container).toMatchSnapshot();
    await userEvent.click(screen.getByRole('combobox'));
    expectToHaveFocusedOption(screen.getAllByRole('option')[0]);
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Please select…');
  });

  it('renders with a selected value', async () => {
    render(<DropDownWrapper options={options} placeholderOption="Please select…" value="Orange" />);
    await userEvent.click(screen.getByRole('combobox'));
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
  });

  it('renders with value as null', async () => {
    render(<DropDownWrapper options={options} placeholderOption="Please select…" value={null} />);
    await userEvent.click(screen.getByRole('combobox'));
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Please select…' }));
  });

  it('allows a placeholder option to be selected', async () => {
    const spy = jest.fn();
    render(<DropDownWrapper
      options={options}
      placeholderOption="Please select…"
      value="Orange"
      onValue={spy}
    />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Please select…' }));
    expect(spy).toHaveBeenCalledWith(null);
  });
});

describe('children', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders children in the combobox', () => {
    render(
      <DropDownWrapper options={options} placeholderOption="Please select…">
        Custom text
      </DropDownWrapper>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Custom text');
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', async () => {
      render(
        <DropDownWrapper options={options} managedFocus={false} />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.click(screen.getByRole('combobox'));
      expect(comboBox).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(comboBox).toHaveFocus();
      expect(comboBox).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Banana' }).id);
    });

    it('calls onLayoutFocusedOption', async () => {
      const spy = jest.fn();
      render(
        <DropDownWrapper options={options} managedFocus={false} onLayoutFocusedOption={spy} />,
      );
      const comboBox = screen.getByRole('combobox');
      await userEvent.click(screen.getByRole('combobox'));
      expect(comboBox).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Banana' }), listbox: screen.getByRole('listbox') });
    });

    it('allows an option to be selected', async () => {
      render(
        <DropDownWrapper options={options} managedFocus={false} />,
      );
      const combobox = screen.getByRole('combobox');
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}{Enter}');
      expect(combobox).toHaveTextContent('Banana');
    });
  });
});

describe('classPrefix', () => {
  const options = [
    { label: 'Orange', group: 'Citrus' },
  ];

  it('removes class when null', () => {
    render(
      <DropDownWrapper options={options} classPrefix={null} />,
    );
    expect(screen.getByRole('combobox')).not.toHaveClass();
  });

  it('prefixes classes', () => {
    render(
      <DropDownWrapper options={options} classPrefix="foo" />,
    );
    expect(screen.getByRole('combobox')).toHaveClass('foo__combobox');
  });
});

describe('required', () => {
  it('when false it does not set aria-required on the combobox', () => {
    render(
      <DropDownWrapper options={['one', 'two']} required={false} />,
    );
    expect(screen.getByRole('combobox')).not.toBeRequired();
  });

  it('when true it sets aria-required on the combobox', () => {
    render(
      <DropDownWrapper options={['one', 'two']} required />,
    );
    expect(screen.getByRole('combobox')).toBeRequired();
  });
});

describe('disabled', () => {
  describe('when false', () => {
    it('does not set aria-disabld on the combobox', () => {
      render(
        <DropDownWrapper options={['one', 'two']} disabled={false} />,
      );
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('when true', () => {
    it('sets aria-disabled on the combobox', () => {
      render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not open the listbox of click', async () => {
      render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      expectToBeClosed();
    });

    it('does not set tabIndex', () => {
      render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      expect(screen.getByRole('combobox')).not.toHaveAttribute('tabindex');
    });
  });
});

describe('aria-labelledby', () => {
  it('is labelled by the value', () => {
    render(<DropDownWrapper options={['one', 'two']} value="two" />);
    expect(screen.getByLabelText('two')).toEqual(screen.getByRole('combobox'));
  });

  it('is labelled by the children', () => {
    render((
      <DropDownWrapper options={['one', 'two']} value="two">
        bar
      </DropDownWrapper>
    ));
    expect(screen.getByLabelText('bar')).toEqual(screen.getByRole('combobox'));
  });

  it('sets aria-labelledby as a string', () => {
    render(
      <DropDownWrapper options={['one', 'two']} aria-labelledby="foo" />,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-labelledby', 'foo id');
  });
});

describe('aria-invalid', () => {
  it('is not set with no value', () => {
    render(
      <DropDownWrapper options={['one', 'two']} />,
    );
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
  });

  it('sets aria-invalid to true', () => {
    render(
      <DropDownWrapper options={['one', 'two']} aria-invalid="true" />,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid to false', () => {
    render(
      <DropDownWrapper options={['one', 'two']} aria-invalid="false" />,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
  });
});

describe('skipOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows options to be skipped by moving forward', async () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toHaveTextContent('Orange');
  });

  it('allows options to be skipped by moving backwards', async () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(document.activeElement).toHaveTextContent('Apple');
  });

  it('allows options to be skipped by pressing home', async () => {
    function skipOption(option) {
      return option.label === 'Apple';
    }
    render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}{Home}');
    expect(document.activeElement).toHaveTextContent('Pear');
  });

  it('allows options to be skipped by pressing end', async () => {
    function skipOption(option) {
      return option.label === 'Orange';
    }
    render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toHaveTextContent('Pear');
  });

  describe('all options are skipped', () => {
    // Prevent infinite loops
    it('returns the original option going forward', async () => {
      function skipOption() {
        return true;
      }
      render(
        <DropDownWrapper options={options} skipOption={skipOption} />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      expect(document.activeElement).toHaveTextContent('Apple');
    });

    it('returns the original option going backwards', async () => {
      function skipOption() {
        return true;
      }
      render(
        <DropDownWrapper options={options} skipOption={skipOption} />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowUp}');
      expect(document.activeElement).toHaveTextContent('Apple');
    });
  });
});

describe('findOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows search options to be skipped', async () => {
    const findOption = jest.fn((option) => {
      if (option.label !== 'Orange') {
        return false;
      }
      return true;
    });

    render(
      <DropDownWrapper options={options} findOption={findOption} />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('b');
    expect(document.activeElement).toHaveTextContent('Orange');
    expect(findOption.mock.calls).toEqual([
      [expect.objectContaining({ value: 'Apple' }), 'b'],
      [expect.objectContaining({ value: 'Pear' }), 'b'],
      [expect.objectContaining({ value: 'Orange' }), 'b'],
    ]);
  });
});

describe('ref', () => {
  it('references the combobox for an object ref', () => {
    const ref = { current: null };
    render((
      <DropDownWrapper options={['foo']} ref={ref} />
    ));
    expect(ref.current).toEqual(screen.getByRole('combobox'));
  });

  it('references the combobox for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    render((
      <DropDownWrapper options={['foo']} ref={ref} />
    ));
    expect(value).toEqual(screen.getByRole('combobox'));
  });
});

describe('renderWrapper', () => {
  it('allows the wrapper to be replaced', () => {
    const { container } = render(
      <DropDownWrapper options={['foo']} renderWrapper={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toEqual('DL');
    expect(wrapper).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <DropDownWrapper options={['foo']} renderWrapper={spy} test="foo" />
    ));

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: expect.objectContaining({
          label: 'foo',
        }),
        notFound: false,
        suggestedOption: null,
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderComboBox', () => {
  it('allows the combo box to be replaced', () => {
    render(
      <DropDownWrapper options={['foo']} renderComboBox={(props) => <dl data-foo="bar" {...props} />} />,
    );
    expect(screen.getByRole('combobox').tagName).toEqual('DL');
    expect(screen.getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <DropDownWrapper options={['foo']} renderComboBox={spy} test="foo" />
    ));

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: expect.objectContaining({
          label: 'foo',
        }),
        notFound: false,
        suggestedOption: null,
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderListBoxWrapper', () => {
  it('allows the list box wrapper to be replaced', () => {
    render(
      <DropDownWrapper options={['foo']} renderListBoxWrapper={(props) => <dl data-foo="bar" {...props} />} />,
    );
    expect(screen.getByRole('listbox', { hidden: true }).parentNode.tagName).toEqual('DL');
    expect(screen.getByRole('listbox', { hidden: true }).parentNode).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <DropDownWrapper options={['foo']} renderListBoxWrapper={spy} test="foo" />
    ));

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        'aria-autocomplete': 'none',
        'aria-busy': false,
        expanded: false,
        search: null,
        currentOption: expect.objectContaining({
          label: 'foo',
        }),
        notFound: false,
        suggestedOption: null,
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('additional props', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('does not include arbitrary props', () => {
    render(<DropDownWrapper options={options} foo="bar" />);
    expect(document.querySelector('[foo="bar"]')).toEqual(null);
  });
});

describe('onLayoutListBox', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when the component is rendered', () => {
    const onLayoutListBox = jest.fn();
    render(
      <DropDownWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    expect(onLayoutListBox).toHaveBeenCalledWith({
      expanded: false,
      listbox: screen.getByRole('listbox', { hidden: true }),
    });
  });

  it('is called when the listbox is displayed', async () => {
    const onLayoutListBox = jest.fn();
    render(
      <DropDownWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(onLayoutListBox).toHaveBeenCalledWith({
      expanded: true,
      listbox: screen.getByRole('listbox'),
    });
  });

  it('is called when the listbox options change', async () => {
    const onLayoutListBox = jest.fn();
    const { rerender } = render((
      <DropDownWrapper options={options} onLayoutListBox={onLayoutListBox} />
    ));
    await userEvent.click(screen.getByRole('combobox'));
    rerender(<DropDownWrapper options={['strawberry']} onLayoutListBox={onLayoutListBox} />);
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: true,
      listbox: screen.getByRole('listbox'),
    });
  });

  it('is called when a listbox closed', async () => {
    const onLayoutListBox = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />
    ));
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{Escape}');
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: false,
      listbox: screen.getByRole('listbox', { hidden: true }),
    });
  });

  it('is called while the listbox is closed', () => {
    const onLayoutListBox = jest.fn();
    const { rerender } = render((
      <DropDownWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />
    ));
    rerender(<DropDownWrapper options={['strawberry']} onLayoutListBox={onLayoutListBox} />);
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: false,
      listbox: screen.getByRole('listbox', { hidden: true }),
    });
  });
});
