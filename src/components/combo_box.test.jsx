/* eslint-disable testing-library/no-node-access */

import React, { useEffect, useState, forwardRef } from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBox } from './combo_box';
import { DISPATCH } from '../constants/dispatch';

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

function expectToBeClosed() { // and focused
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(combobox).toHaveFocus();
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).not.toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'false');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(combobox).not.toHaveDescription(new RegExp(ComboBox.defaultProps.notFoundMessage));
}

function expectToBeOpen() { // and focused with no selected or focused option
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveFocus();
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expect(combobox).not.toHaveDescription(new RegExp(ComboBox.defaultProps.notFoundMessage));
}

function expectToHaveFocusedOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(option).toHaveFocus();
  expect(combobox).not.toHaveDescription(new RegExp(ComboBox.defaultProps.notFoundMessage));
}

function expectToHaveSelectedOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(combobox).toHaveFocus();
  expect(combobox).not.toHaveDescription(new RegExp(ComboBox.defaultProps.notFoundMessage));
}

function expectToHaveActiveOption(option) {
  const combobox = screen.getByRole('combobox');
  const listbox = screen.getByRole('listbox', { hidden: true });
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(combobox).toHaveFocus();
  expect(combobox).not.toHaveDescription(new RegExp(ComboBox.defaultProps.notFoundMessage));
}

function getLiveMessage() {
  return [...document.querySelectorAll('[aria-live=polite],[aria-live=assertive]')]
    .map((node) => node.textContent.trim())
    .filter(Boolean)
    .join(' ');
}

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders a closed combo box', () => {
        const { container } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });

      describe('focusing the list box', () => {
        it('opens the combo box with no option selected', () => {
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          expectToBeOpen();
        });

        describe('with no options it does not open the list box', () => {
          it('does not open the combo box', () => {
            render(<ComboBoxWrapper options={[]} />);
            screen.getByRole('combobox').focus();
            expectToBeClosed();
          });
        });
      });

      describe('navigating options in an open listbox', () => {
        describe('pressing the down arrow', () => {
          it('moves to the first option from the input', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
          });

          it('moves to the next option', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });

          it('moves from the last option to the input', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen();
          });

          it('does nothing with the alt key pressed', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expectToBeOpen();
          });

          it('calls onLayoutFocusedOption', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onLayoutFocusedOption={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Apple' }), listbox: screen.getByRole('listbox') });
          });
        });

        describe('pressing the up arrow', () => {
          it('moves from the input to the last option', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
          });

          it('moves to the previous option', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });

          it('moves from the first option to the input', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToBeOpen();
          });

          it('calls onLayoutFocusedOption', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onLayoutFocusedOption={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Orange' }), listbox: screen.getByRole('listbox') });
          });
        });

        describe('pressing the home key', () => {
          it('moves focus back to the list box', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            fireEvent.keyDown(document.activeElement, { key: 'Home' });
            expectToBeOpen();
          });
        });

        describe('pressing the end key', () => {
          it('moves focus back to the list box', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'End' });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing the page up key', () => {
          it('moves the page of options up', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing the page down key', () => {
          it('moves the page of options down', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'PageDown' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
          });
        });

        describe('typing', () => {
          it('moves focus back to the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            await userEvent.type(document.activeElement, 'a');
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing backspace', () => {
          it('moves focus back to the list box', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Backspace' });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing arrow left', () => {
          it('moves focus back to the list box', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing arrow right', () => {
          it('moves focus back to the list box', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing delete', () => {
          it('moves focus back to the list box removing the selected option', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Delete' });
            expectToBeOpen();
          });
        });

        describe('pressing Ctrl+d', () => {
          it('moves focus back to the list box removing the selected option', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'd', ctrlKey: true });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing Ctrl+k', () => {
          it('moves focus back to the list box removing the selected option', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'k', ctrlKey: true });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
          });
        });
      });

      describe('selecting an option', () => {
        describe('when clicking on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expectToBeClosed();
          });

          it('updates the displayed value', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(screen.getByRole('combobox')).toHaveValue('Banana');
          });

          it('does nothing if a different mouse button is pressed', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.click(screen.getByRole('option', { name: 'Banana' }), { button: 1 });
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen();
          });

          it('cancels mousedown', () => {
            const spy = jest.fn();
            document.addEventListener('mousedown', spy);
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.mouseDown(screen.getByRole('option', { name: 'Banana' }));
            expect(spy.mock.calls[0][0].defaultPrevented).toEqual(true);
            document.removeEventListener('mousedown', spy);
          });
        });

        describe('when pressing enter on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
          });

          it('closes the list box and selects the combobox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed();
          });

          it('updates the displayed value', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(screen.getByRole('combobox')).toHaveValue('Apple');
          });
        });

        describe('when blurring the combobox', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
            });
          });

          it('closes the list box', async () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
            });
            expect(document.body).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(screen.getByRole('combobox')).toHaveValue('Apple');
            });
          });

          describe('when no option has been selected', () => {
            it('closes the list box and clears the search', async () => {
              const spy = jest.fn();
              render(<ComboBoxWrapper options={options} onValue={spy} />);
              screen.getByRole('combobox').focus();
              await userEvent.type(document.activeElement, 'app');
              userEvent.tab();
              await waitFor(() => {
                expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
              });
              expect(spy).not.toHaveBeenCalled();
              expect(screen.getByRole('combobox')).toHaveValue('');
            });
          });
        });
      });

      describe('when pressing escape on an option', () => {
        it('closes the list box', () => {
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expectToBeClosed();
        });

        it('clears the focused value', () => {
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToBeOpen();
        });

        it('keeps the current value', () => {
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Enter' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expectToBeClosed();
          expect(screen.getByRole('combobox')).toHaveValue('Apple');
        });
      });

      describe('when pressing ArrowUp + alt on an option', () => {
        it('closes the list box', () => {
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
          expectToBeClosed();
        });

        describe('with no value', () => {
          it('resets focused value', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen();
          });
        });

        describe('with a value', () => {
          it('resets focused value', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' }); // Choose an option
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' }); // Change the selection
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });
        });
      });

      describe('on a closed listbox', () => {
        describe('pressing arrow down + alt', () => {
          it('opens the listbox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expectToBeOpen();
          });
        });

        describe('pressing arrow down', () => {
          it('opens the listbox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen();
          });
        });

        describe('pressing arrow up', () => {
          it('opens the listbox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToBeOpen();
          });
        });

        describe('pressing arrow up + alt', () => {
          it('does not open the listbox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expectToBeClosed();
          });
        });

        describe('pressing page down', () => {
          it('does not open the listbox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'PageDown' });
            expectToBeClosed();
          });
        });

        describe('pressing page up', () => {
          it('does not open the listbox', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
            expectToBeClosed();
          });
        });

        describe('pressing Enter', () => {
          it('does not select an option', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('mouse button up', () => {
          it('opens the listbox on left click', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.mouseUp(document.activeElement, { button: 0 });
            expectToBeOpen();
          });

          it('does not open the listbox on right click', () => {
            render(<ComboBoxWrapper options={options} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.mouseUp(document.activeElement, { button: 1 });
            expectToBeClosed();
          });
        });
      });

      describe('refocusing the listbox', () => {
        it('removes focus from the list box keeping the current selection', () => {
          render(<ComboBoxWrapper options={options} value="Orange" />);
          screen.getByRole('combobox').focus();
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'Orange' }));
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          screen.getByRole('combobox').focus();
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'Banana' }));
        });
      });

      describe('typing', () => {
        it('updates the input value', () => {
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          userEvent.type(screen.getByRole('combobox'), 'foo');
          expect(screen.getByRole('combobox')).toHaveValue('foo');
        });

        describe('single option with matching value', () => {
          it('does not show the listbox if the search matches the value', () => {
            render(<ComboBoxWrapper options={['foo']} />);
            screen.getByRole('combobox').focus();
            userEvent.type(screen.getByRole('combobox'), 'foo');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed();

            fireEvent.change(document.activeElement, { target: { value: 'fo' } });
            expectToHaveSelectedOption(screen.getByRole('option'));
            userEvent.type(screen.getByRole('combobox'), 'o');
            expectToBeClosed();
          });
        });

        describe('multiple options with matching value', () => {
          it('does show the listbox if the search matches the value', () => {
            render(<ComboBoxWrapper options={['foo', 'foo bar']} />);
            screen.getByRole('combobox').focus();
            userEvent.type(screen.getByRole('combobox'), 'foo');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed();

            fireEvent.change(document.activeElement, { target: { value: 'fo' } });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
            userEvent.type(screen.getByRole('combobox'), 'o');
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
          });
        });
      });

      describe('setting the search to an empty string', () => {
        describe('without an existing value', () => {
          it('does not call onValue', async () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(spy).not.toHaveBeenCalled();
          });

          it('clears the focused option', async () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
            expect(spy).toHaveBeenCalledWith(null);
            expectToBeOpen(document.activeElement);
          });
        });

        describe('with an existing value', () => {
          it('calls onValue with null', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} value="Apple" />);
            screen.getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(spy).toHaveBeenCalledWith(null);
          });

          it('clears the existing option', () => {
            render(<ComboBoxWrapper options={options} value="Apple" />);
            screen.getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(document.activeElement).toHaveValue('');
          });

          it('clears the selected option', () => {
            render(<ComboBoxWrapper options={options} value="Apple" />);
            screen.getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expectToBeOpen(document.activeElement);
          });
        });
      });
    });

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', () => {
        const { container } = render((
          <ComboBoxWrapper options={options} />
        ));
        screen.getByRole('combobox').focus();
        expect(container).toMatchSnapshot();
        expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-disabled', 'true');
      });

      it('selects a disabled option with the arrow keys', () => {
        render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen();
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
            const spy = jest.fn();
            render(<ComboBoxWrapper options={options} onValue={spy} />);
            screen.getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
            });
            expect(spy).not.toHaveBeenCalled();
            expect(document.body).toHaveFocus();
          });
        });
      });
    });

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        render(<ComboBoxWrapper options={options} value={2} onValue={spy} />);
        screen.getByRole('combobox').focus();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        render(<ComboBoxWrapper options={options} value={2} onValue={spy} />);
        screen.getByRole('combobox').focus();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('html', () => {
      it('sets attributes on the option', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        expect(screen.getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(screen.getByRole('option')).toHaveClass('class');
      });

      describe('html id', () => {
        it('is used as the options id', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }];
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          expect(screen.getByRole('option')).toHaveAttribute('id', 'xxx');
        });

        it('will not use duplicate ids', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }, { label: 'bar', html: { id: 'xxx' } }];
          render(<ComboBoxWrapper options={options} />);
          screen.getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expect(screen.getByRole('option', { name: 'foo' })).toHaveAttribute('id', 'xxx');
          expect(screen.getByRole('option', { name: 'bar' })).toHaveAttribute('id', 'xxx_1');
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
        const { container } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('does not select a group with the arrow keys', () => {
        render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(screen.getByRole('option', { name: /Orange/ }));
      });

      it('triggers onValue when an option is selected', () => {
        const spy = jest.fn();
        render(<ComboBoxWrapper options={options} onValue={spy} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', () => {
        render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(screen.getByRole('combobox')).toHaveValue('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', () => {
          const spy = jest.fn();
          render(<ComboBoxWrapper options={options} onValue={spy} />);
          screen.getByRole('combobox').focus();
          userEvent.click(screen.getAllByText('Citrus')[0]);
          expect(spy).not.toHaveBeenCalled();
          expectToBeOpen();
        });
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        expect(screen.getByRole('option')).not.toHaveAttribute('data-foo', 'bar');
      });
    });

    describe('missing label', () => {
      it('treats as a blank string', () => {
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

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={options} onValue={spy} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('Banana');
      expectToBeClosed();
    });

    it('can select an empty string', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={['']} onValue={spy} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
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

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={options} onValue={spy} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(2);
      expectToBeClosed();
    });

    it('can select 0', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={[0]} onValue={spy} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(0);
      expectToBeClosed();
    });
  });

  describe('options as null', () => {
    it('renders an option with an empty string', () => {
      const { container } = render(<ComboBoxWrapper options={[null, 'foo']} />);
      expect(container).toMatchSnapshot();
      screen.getByRole('combobox').focus();
      expectToBeOpen();
      expect(screen.getAllByRole('option')[0]).toHaveTextContent('');
      expect(screen.getAllByRole('option')[0]).not.toHaveTextContent('null');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={[null, 'foo']} onValue={spy} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(null);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as undefined', () => {
    it('renders an option with an empty string', () => {
      const { container } = render(<ComboBoxWrapper options={[undefined, 'foo']} />);
      expect(container).toMatchSnapshot();
      screen.getByRole('combobox').focus();
      expectToBeOpen();
      expect(screen.getAllByRole('option')[0]).toHaveTextContent('');
      expect(screen.getAllByRole('option')[0]).not.toHaveTextContent('undefined');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={[undefined, 'foo']} onValue={spy} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(undefined);
      expectToBeClosed();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('no options', () => {
    it('does not open the listbox on focus', () => {
      render(<ComboBoxWrapper options={[]} />);
      screen.getByRole('combobox').focus();
      expectToBeClosed();
    });

    it('does not open the listbox on arrow down', () => {
      render(<ComboBoxWrapper options={[]} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToBeClosed();
    });

    it('does not open the listbox on alt + arrow down', () => {
      render(<ComboBoxWrapper options={[]} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
      expectToBeClosed();
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      screen.getByRole('combobox').focus();
      userEvent.click(screen.getByText('Orange'));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      render(<ComboBoxWrapper
        options={options}
        mapOption={({ name }) => ({ label: name })}
      />);
      screen.getByRole('combobox').focus();
      userEvent.click(screen.getByText('Orange'));
      expect(screen.getByRole('combobox')).toHaveValue('Orange');
    });
  });
});

describe('value', () => {
  it('sets the initial selected option', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    render(<ComboBoxWrapper options={options} value="Banana" />);
    screen.getByRole('combobox').focus();
    expectToHaveSelectedOption(screen.getByRole('option', { name: 'Banana' }));
  });

  it('calls onLayoutFocusedOption', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} value="Banana" onLayoutFocusedOption={spy} />);
    screen.getByRole('combobox').focus();
    expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Banana' }), listbox: screen.getByRole('listbox') });
  });

  it('sets the combo box value', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    render(<ComboBoxWrapper options={options} value="Banana" />);
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('combobox')).toHaveValue('Banana');
  });

  describe('with a single option matching the value', () => {
    it('does not open the combo box', () => {
      const options = ['foo'];
      render(<ComboBoxWrapper options={options} value="foo" />);
      screen.getByRole('combobox').focus();
      expectToBeClosed();
    });
  });

  describe('value is disabled', () => {
    it('selects the disabled option', () => {
      const options = [{ label: 'Apple', disabled: true }, 'Banana'];
      render(<ComboBoxWrapper options={options} value="Apple" />);
      screen.getByRole('combobox').focus();
      expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
    });
  });

  describe('value is not in options', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('does not select a value', () => {
      render(<ComboBoxWrapper options={options} value="Strawberry" />);
      screen.getByRole('combobox').focus();
      expectToBeOpen();
    });

    it('displays value as the combo box label', () => {
      render(<ComboBoxWrapper options={options} value="Strawberry" />);
      expect(screen.getByRole('combobox')).toHaveValue('Strawberry');
    });
  });

  describe('value is an empty string', () => {
    const options = [null, 'foo'];

    it('selects the value', () => {
      render(<ComboBoxWrapper options={options} value="" />);
      screen.getByRole('combobox').focus();
      expectToHaveSelectedOption(screen.getAllByRole('option')[0]);
    });
  });

  describe('updating the value', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('updates the aria-selected value of an open listbox', () => {
      const { rerender } = render(<ComboBoxWrapper options={options} value="Orange" />);
      screen.getByRole('combobox').focus();
      rerender(<ComboBoxWrapper options={options} value="Apple" />);
      expectToHaveSelectedOption(screen.getByRole('option', { name: 'Apple' }));
    });

    it('changes the focused value of an open listbox', () => {
      const { rerender } = render(<ComboBoxWrapper options={options} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      rerender(<ComboBoxWrapper options={options} value="Banana" />);
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('changes the value of a closed listbox', () => {
      const { rerender } = render(<ComboBoxWrapper options={options} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      rerender(<ComboBoxWrapper options={options} value="Banana" />);
      expect(document.activeElement).toHaveValue('Banana');
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
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

  it('pressing the button removes the value', () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    userEvent.click(remove);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing the middle button does not remove the value', () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    fireEvent.click(remove, { button: 1 });
    expect(spy).not.toHaveBeenCalled();
  });

  it('pressing ENTER on the button clears the value', () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    fireEvent.keyDown(remove, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing SPACE on the button clears the value', () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    fireEvent.keyDown(remove, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing a different key does not clear the value', () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = screen.getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    fireEvent.keyDown(remove, { key: 'x' });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('busy', () => {
  describe('busyDebounce is null', () => {
    describe('when false', () => {
      it('sets aria-busy=false on the wrapper', () => {
        const { container } = render((
          <ComboBoxWrapper options={['foo']} busyDebounce={null} />
        ));
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
      });
    });

    describe('when true', () => {
      describe('with no search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container } = render((
            <ComboBoxWrapper options={['foo']} busy busyDebounce={null} />
          ));
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });

      describe('with a search', () => {
        it('sets aria-busy=true on the wrapper', () => {
          const { container } = render((
            <ComboBoxWrapper options={['foo']} busy busyDebounce={null} />
          ));
          screen.getByRole('combobox').focus();
          userEvent.type(screen.getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
        });
      });

      describe('with a search matching the current value', () => {
        it('does not set aria-busy', () => {
          const { container } = render((
            <ComboBoxWrapper options={['foo']} value="foo" busy busyDebounce={null} />
          ));
          screen.getByRole('combobox').focus();
          fireEvent.change(document.activeElement, { target: { value: 'foo' } });
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });
    });

    describe('when null', () => {
      describe('with no search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container } = render((
            <ComboBoxWrapper options={['foo']} busy={null} busyDebounce={null} />
          ));
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });

      describe('with a search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container } = render((
            <ComboBoxWrapper options={['foo']} busy={null} busyDebounce={null} />
          ));
          screen.getByRole('combobox').focus();
          userEvent.type(screen.getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });
    });
  });

  describe('busyDebounce is the default', () => {
    describe('when true', () => {
      it('sets aria-busy=true on the wrapper after 400ms', () => {
        jest.useFakeTimers();
        const { container } = render((
          <ComboBoxWrapper options={['foo']} busy />
        ));
        screen.getByRole('combobox').focus();
        userEvent.type(screen.getByRole('combobox'), 'foo');
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
      it('sets aria-busy=true on the wrapper after delay', () => {
        jest.useFakeTimers();
        const { container } = render((
          <ComboBoxWrapper options={['foo']} busy busyDebounce={500} />
        ));
        screen.getByRole('combobox').focus();
        userEvent.type(screen.getByRole('combobox'), 'foo');
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
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    });
  });

  describe('when provided', () => {
    it('sets aria-autocomplete to list', () => {
      render(<ComboBoxWrapper options={['foo']} onSearch={() => {}} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    describe('on rendering', () => {
      it('does not call onSearch', () => {
        const spy = jest.fn();
        render(<ComboBoxWrapper options={['foo']} onSearch={spy} value="foo" />);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('on focus', () => {
      it('calls onSearch without a value', () => {
        const spy = jest.fn();
        render(<ComboBoxWrapper options={['foo']} onSearch={spy} />);
        screen.getByRole('combobox').focus();
        expect(spy).toHaveBeenCalledWith('');
      });

      it('calls onSearch with a value', () => {
        const spy = jest.fn();
        render(<ComboBoxWrapper options={['foo']} onSearch={spy} value="foo" />);
        screen.getByRole('combobox').focus();
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });

    describe('typing', () => {
      it('calls onSearch', async () => {
        const spy = jest.fn();
        render(<ComboBoxWrapper options={['foo']} onSearch={spy} />);
        screen.getByRole('combobox').focus();
        await userEvent.type(screen.getByRole('combobox'), 'foo');
        expect(spy.mock.calls).toEqual([
          [''],
          ['f'],
          ['fo'],
          ['foo'],
        ]);
      });
    });

    describe('on selecting a value', () => {
      it('calls onSearch', () => {
        const spy = jest.fn();
        render(<ComboBoxWrapper options={['foo']} onValue={spy} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenLastCalledWith('foo');
      });
    });
  });

  describe('updating options', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const newOptions = ['Strawberry', 'Raspberry', 'Banana'];
    const otherNewOptions = ['Peach', 'Kiwi', 'Grape'];

    it('updates the displayed options', () => {
      const { container, rerender } = render(<ComboBoxWrapper options={options} />);
      screen.getByRole('combobox').focus();
      rerender(<ComboBoxWrapper options={newOptions} />);
      expect(container).toMatchSnapshot();
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
        'Strawberry',
        'Raspberry',
        'Banana',
      ]);
    });

    describe('update contains the focused option', () => {
      it('keeps the currently focused option', () => {
        const { rerender } = render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(screen.getAllByRole('option')[1]);
        rerender(<ComboBoxWrapper options={newOptions} />);
        expectToHaveFocusedOption(screen.getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the focused option', () => {
      it('removes the focused option', () => {
        const { rerender } = render(<ComboBoxWrapper options={options} />);
        screen.getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(screen.getAllByRole('option')[1]);
        rerender(<ComboBoxWrapper options={otherNewOptions} />);
        expectToBeOpen();
      });
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', () => {
        const { rerender } = render(<ComboBoxWrapper options={options} value="Banana" />);
        screen.getByRole('combobox').focus();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        rerender(<ComboBoxWrapper value="Banana" options={newOptions} />);
        expectToHaveSelectedOption(screen.getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the selected option', () => {
      it('removes the selected option', () => {
        const { rerender } = render(<ComboBoxWrapper options={options} value="Banana" />);
        screen.getByRole('combobox').focus();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        rerender(<ComboBoxWrapper value="Banana" options={otherNewOptions} />);
        expectToBeOpen();
      });
    });

    describe('updated options are empty', () => {
      it('closes the list box', () => {
        const { rerender } = render(<ComboBoxWrapper options={options} value="Banana" />);
        screen.getByRole('combobox').focus();
        expectToHaveSelectedOption(screen.getAllByRole('option')[1]);
        rerender(<ComboBoxWrapper value="Banana" options={[]} />);
        expectToBeClosed();
      });
    });
  });
});

describe('onLayoutFocusedOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when an option is selected', () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} onLayoutFocusedOption={spy} />);
    const comboBox = screen.getByRole('combobox');
    comboBox.focus();
    fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
    expect(spy).toHaveBeenCalledWith({ option: screen.getByRole('option', { name: 'Apple' }), listbox: screen.getByRole('listbox') });
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', () => {
      render(<ComboBoxWrapper options={options} managedFocus={false} />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveFocus();
      expect(comboBox).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Banana' }).id);
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
    });

    it('allows an option to be selected', () => {
      render(<ComboBoxWrapper options={options} managedFocus={false} />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'Enter' });
      expect(comboBox).toHaveFocus();
      expectToBeClosed();
      expect(comboBox).toHaveValue('Apple');
    });
  });
});

describe('showSelectedLabel', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('by default', () => {
    it('does not show the selected option label in the input', () => {
      render(<ComboBoxWrapper options={options} />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when false', () => {
    it('does not show the selected option label in the input', () => {
      render(<ComboBoxWrapper options={options} showSelectedLabel={false} />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when true', () => {
    it('shows the selected option label in the input', () => {
      render(<ComboBoxWrapper options={options} showSelectedLabel />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('Apple');
    });

    it('shows the selected option label in the input after typing', () => {
      render(<ComboBoxWrapper options={options} showSelectedLabel />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      userEvent.type(document.activeElement, 'a');
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('Apple');
    });

    it('shows the original search when returning to the input', () => {
      render(<ComboBoxWrapper options={options} showSelectedLabel />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      userEvent.type(document.activeElement, 'a');
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'ArrowUp' });
      expect(comboBox).toHaveValue('a');
    });

    it('does not show the label of a disabled option', () => {
      render(<ComboBoxWrapper options={[{ disabled: true, label: 'foo' }]} showSelectedLabel />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });

    it('does not trigger a search when moving through options', () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={options} showSelectedLabel onSearch={spy} />);
      const comboBox = screen.getByRole('combobox');
      comboBox.focus();
      spy.mockClear();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe('autoselect', () => {
  describe('when true', () => {
    it('does not change the value of aria-autocomplete for no onSearch', () => {
      render(<ComboBoxWrapper options={['foo']} autoselect />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('does not change the value of aria-autocomplete for an onSearch', () => {
      render(<ComboBoxWrapper options={['foo']} autoselect onSearch={() => {}} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    describe('when typing', () => {
      it('auto selects the first matching option', async () => {
        render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
      });

      it('auto selects the first non-disabled option', async () => {
        render(<ComboBoxWrapper options={[{ disabled: true, label: 'frog' }, 'foo']} autoselect />);
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
      });

      it('does not auto select no matching option', async () => {
        render(<ComboBoxWrapper options={['foc', 'bar']} autoselect />);
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'c');
        expectToBeOpen();
      });

      it('does not auto select later matching options', async () => {
        render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'b');
        expectToBeOpen();
      });
    });

    describe('backspace', () => {
      it('does not auto-select an option', async () => {
        render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'fo');
        fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' });
        expectToBeOpen();
      });

      describe('ctrl+d', () => {
        it('continues to auto-select an option', async () => {
          render(<ComboBoxWrapper options={['food', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          fireEvent.keyDown(screen.getByRole('combobox'), { key: 'd', ctrlKey: true });
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'food' }));
        });
      });
    });

    describe('delete', () => {
      it('does not auto-select an option', async () => {
        render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'foo');
        fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Delete' });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'foo' } });
        expectToBeOpen();
      });

      describe('ctrl+h', () => {
        it('continues to auto-select an option', async () => {
          render(<ComboBoxWrapper options={['fooh', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          fireEvent.keyDown(screen.getByRole('combobox'), { key: 'h', ctrlKey: true });
          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fooh' } });
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'fooh' }));
        });
      });

      describe('ctrl+k', () => {
        it('continues to auto-select an option', async () => {
          render(<ComboBoxWrapper options={['fook', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          fireEvent.keyDown(screen.getByRole('combobox'), { key: 'k', ctrlKey: true });
          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fok' } });
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'fook' }));
        });
      });

      describe('selecting options', () => {
        it('allows other options to be selected', async () => {
          render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'bar' }));
        });
      });

      describe('updates to options', () => {
        it('autoselects a new value if no value is autoselected', async () => {
          const { rerender } = render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'ba');
          expectToBeOpen();
          rerender(<ComboBoxWrapper options={['bar', 'foo']} autoselect />);
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'bar' }));
        });

        it('autoselects a new value if a value is autoselected', async () => {
          const { rerender } = render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
          rerender(<ComboBoxWrapper options={['food', 'bard']} autoselect />);
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'food' }));
        });

        it('removes the autoselect if there is no matching value', async () => {
          const { rerender } = render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
          rerender(<ComboBoxWrapper options={['bar', 'foo']} autoselect />);
          expectToBeOpen();
        });

        it('does not autoselect if a different value is focused', async () => {
          const { rerender } = render(<ComboBoxWrapper options={['foo', 'bar']} autoselect />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'bar' }));
          rerender(<ComboBoxWrapper options={['food', 'bar']} autoselect />);
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'bar' }));
        });
      });

      describe('on blur', () => {
        it('selects the autoselected value', async () => {
          const spy = jest.fn();
          render(<ComboBoxWrapper options={['foo']} autoselect onValue={spy} />);
          screen.getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          userEvent.tab();
          await waitFor(() => {
            expect(spy).toHaveBeenCalledWith('foo');
          });
        });
      });
    });
  });

  describe('when inline', () => {
    it('changes the value of aria-autocomplete for no onSearch', () => {
      render(<ComboBoxWrapper options={['foo']} autoselect="inline" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'inline');
    });

    it('changes the value of aria-autocomplete for an onSearch', () => {
      render(<ComboBoxWrapper options={['foo']} autoselect="inline" onSearch={() => {}} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'both');
    });

    describe('when typing', () => {
      it('selects the text of the autoselected option', async () => {
        render(<ComboBoxWrapper options={['foo']} autoselect="inline" />);
        screen.getByRole('combobox').focus();
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(screen.getByRole('option'));
        expect(document.activeElement).toHaveValue('foo');
        expect(spy).toHaveBeenCalledWith(1, 3, 'backwards');
      });

      it('does not select the text of a disabled option', async () => {
        render(<ComboBoxWrapper options={[{ label: 'foo', disabled: true }]} autoselect="inline" />);
        screen.getByRole('combobox').focus();
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        userEvent.type(document.activeElement, 'f');
        expectToBeOpen();
        expect(document.activeElement).toHaveValue('f');
        expect(spy).not.toHaveBeenCalled();
      });

      it('does not select the text if the cursor position is inappropriate', async () => {
        render(<ComboBoxWrapper options={['abcd']} autoselect="inline" />);
        screen.getByRole('combobox').focus();
        document.activeElement.value = 'ac';
        document.activeElement.setSelectionRange(1, 1);
        // can't use userEvent.type, as it always sets the selectionRange to the end of the input
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.change(document.activeElement, { target: { value: 'abc' } });
        expectToHaveSelectedOption(screen.getByRole('option'));
        expect(document.activeElement).toHaveValue('abc');
        expect(spy).not.toHaveBeenCalled();
      });

      it('removes the autoselected text and last character on backspace', async () => {
        render(<ComboBoxWrapper options={['foo']} autoselect="inline" />);
        screen.getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expect(document.activeElement).toHaveValue('foo');
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.keyDown(document.activeElement, { key: 'Backspace' });
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expect(document.activeElement).toHaveValue('f');
        expect(spy).not.toHaveBeenCalled();
      });

      it('removes the autoselected text on delete', async () => {
        render(<ComboBoxWrapper options={['foo']} autoselect="inline" />);
        screen.getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expect(document.activeElement).toHaveValue('foo');
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.keyDown(document.activeElement, { key: 'Delete' });
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expect(document.activeElement).toHaveValue('fo');
        expect(spy).not.toHaveBeenCalled();
      });

      it('removes the autoselected text on escape', async () => {
        render(<ComboBoxWrapper options={['foo']} autoselect="inline" />);
        screen.getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expect(document.activeElement).toHaveValue('foo');
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.keyDown(document.activeElement, { key: 'Escape' });
        expect(document.activeElement).toHaveValue('');
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('moving between options', () => {
      describe('when showSelectedLabel is true', () => {
        it('updates the value to the selected label', () => {
          render(<ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel />);
          screen.getByRole('combobox').focus();
          // can't use userEvent.type, as it ignores selection ranges
          fireEvent.change(document.activeElement, { target: { value: 'fo' } });
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'foe' }));
          expect(screen.getByRole('combobox')).toHaveValue('foe');
          expect(spy).not.toHaveBeenCalled();
        });

        describe('when returning to the original option', () => {
          it('sets the search string without selecting the text', () => {
            render(<ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel />);
            screen.getByRole('combobox').focus();
            // can't use userEvent.type, as it ignores selection ranges
            fireEvent.change(document.activeElement, { target: { value: 'fo' } });
            expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));

            const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen();
            expect(screen.getByRole('combobox')).toHaveValue('fo');
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });

      describe('when showSelectedLabel is false', () => {
        it('does not update the value to the selected label', () => {
          render(
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel={false} />,
          );
          screen.getByRole('combobox').focus();
          // can't use userEvent.type, as it ignores selection ranges
          fireEvent.change(document.activeElement, { target: { value: 'fo' } });
          expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(screen.getByRole('option', { name: 'foe' }));
          expect(screen.getByRole('combobox')).toHaveValue('fo');
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe('selecting an option', () => {
      it('removes the text selection', () => {
        render(
          <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />,
        );
        screen.getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expectToBeClosed();
        expect(screen.getByRole('combobox')).toHaveValue('foo');
        expect(spy).toHaveBeenCalledWith(3, 3, 'forward');
      });

      it('does not change the selection without focus', async () => {
        render(<ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />);
        screen.getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        userEvent.tab();
        await waitFor(() => {
          expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
        });
        expect(screen.getByRole('combobox')).toHaveValue('foo');
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});

describe('tabAutocomplete', () => {
  describe('when tabAutocomplete is false', () => {
    it('pressing tab does not select the item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} onValue={spy} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('when tabAutocomplete is true', () => {
    it('pressing tab selects the suggested item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).toHaveBeenCalledWith('foo');
    });

    it('pressing shift+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing alt+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', altKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing ctrl+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', ctrlKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing meta+tab does not select the suggested item item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', metaKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing tab does not select a focused item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'foo' }));
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing tab does not reselect the suggested item current item', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} value="foo" />
      ));
      screen.getByRole('combobox').focus();
      expectToHaveSelectedOption(screen.getByRole('option', { name: 'foo' }));
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });

    describe('when autoselect is true', () => {
      it('pressing tab selects the item', async () => {
        const spy = jest.fn();
        render((
          <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
        ));
        screen.getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'fo');
        fireEvent.keyDown(document.activeElement, { key: 'Tab' });
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });

    describe('when autoselect is inline', () => {
      it('pressing tab selects the item', async () => {
        const spy = jest.fn();
        render((
          <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" tabAutocomplete onValue={spy} />
        ));
        screen.getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        fireEvent.keyDown(document.activeElement, { key: 'Tab' });
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });
  });
});

describe('tabBetweenOptions', () => {
  const options = ['Apple', 'Banana'];

  describe('without managedFocus', () => {
    it('pressing tab moves to the next option', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Apple' }));

      userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing tab on the last option moves out of the listbox without selecting an option', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions onValue={spy} />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab();
      userEvent.tab();
      userEvent.tab();

      await waitFor(() => {
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(screen.getByRole('combobox')).not.toHaveValue();
      expect(spy).not.toHaveBeenCalled();
      expect(document.body).toHaveFocus();
    });

    it('pressing down arrow and tab moves between options', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab moves to the previous option', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Apple' }));
    });

    it('pressing shift tab on the first option focuses the input', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('pressing tab with focus on the input and a selected option moves to the next option', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus={false} value="Apple" tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveActiveOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab on the input moves focus up the page', async () => {
      render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab({ shift: true });

      await waitFor(() => {
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(document.body).toHaveFocus();
    });
  });

  describe('with managedFocus', () => {
    it('pressing tab moves to the next option', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));

      userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing tab on the last option moves out of the listbox without selecting an option', async () => {
      const spy = jest.fn();
      render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions onValue={spy} />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab();
      userEvent.tab();
      userEvent.tab();

      await waitFor(() => {
        expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(screen.getByRole('combobox')).not.toHaveValue();
      expect(spy).not.toHaveBeenCalled();
      expect(document.body).toHaveFocus();
    });

    it('pressing down arrow and tab moves between options', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab moves to the previous option', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
    });

    it('pressing shift tab on the first option focuses the input', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('pressing tab with focus on the input and a selected option moves to the next option', () => {
      render((
        <ComboBoxWrapper options={options} managedFocus value="Apple" tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveFocusedOption(screen.getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab on the input moves focus up the page', async () => {
      render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      screen.getByRole('combobox').focus();

      userEvent.tab({ shift: true });

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
    it('expands on focus', () => {
      render((
        <ComboBoxWrapper options={options} />
      ));
      screen.getByRole('combobox').focus();
      expectToBeOpen();
    });

    it('expands when the clear button is pressed', () => {
      render((
        <ComboBoxWrapper options={options} value="Apple" />
      ));
      screen.getByRole('combobox').focus();
      userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      expectToBeOpen();
    });
  });

  describe('when true', () => {
    it('expands on focus', () => {
      render((
        <ComboBoxWrapper options={options} expandOnFocus />
      ));
      screen.getByRole('combobox').focus();
      expectToBeOpen();
    });

    it('expands when the clear button is pressed', () => {
      render((
        <ComboBoxWrapper options={options} value="Apple" expandOnFocus />
      ));
      screen.getByRole('combobox').focus();
      userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      expectToBeOpen();
    });
  });

  describe('when false', () => {
    it('does not expand on focus', () => {
      render((
        <ComboBoxWrapper options={options} expandOnFocus={false} />
      ));
      screen.getByRole('combobox').focus();
      expectToBeClosed();
    });

    it('does not expand when the clear button is pressed', () => {
      render((
        <ComboBoxWrapper options={options} value="Apple" expandOnFocus={false} />
      ));
      const combobox = screen.getByRole('combobox');
      combobox.focus();
      userEvent.click(screen.getByRole('button', { name: /Clear/ }));
      const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
      expect(listbox).toHaveAttribute('role', 'listbox');
      expect(listbox).not.toBeVisible();
    });
  });
});

describe('selectOnBlur', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  describe('when true', () => {
    it('calls onValue when bluring the list box', async () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={options} onValue={spy} selectOnBlur />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      userEvent.tab();
      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith('Apple');
      });
    });
  });

  describe('when false', () => {
    it('does not call onValue when bluring the list box', async () => {
      const spy = jest.fn();
      render(<ComboBoxWrapper options={options} onValue={spy} selectOnBlur={false} />);
      screen.getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      userEvent.tab();
      expect(document.body).toHaveFocus();
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).toBeFalsy();
      });
      expect(spy).not.toHaveBeenCalled();
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
    render((
      <ComboBoxWrapper options={options} autoselect findSuggestion={findSuggestion} />
    ));
    screen.getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'o');
    expectToHaveSelectedOption(screen.getByRole('option', { name: 'Orange' }));
    expect(findSuggestion.mock.calls).toEqual([
      [expect.objectContaining({ value: 'Apple' }), 'o'],
      [expect.objectContaining({ value: 'Pear' }), 'o'],
      [expect.objectContaining({ value: 'Orange' }), 'o'],
    ]);
  });

  it('ends the search by returning false', async () => {
    const findSuggestion = jest.fn((option) => {
      if (option.label !== 'Orange') {
        return false;
      }
      return true;
    });
    render((
      <ComboBoxWrapper options={options} autoselect findSuggestion={findSuggestion} />
    ));
    screen.getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'o');
    expectToBeOpen();
    expect(findSuggestion.mock.calls).toEqual([
      [expect.objectContaining({ value: 'Apple' }), 'o'],
    ]);
  });
});

describe('notFoundMessage', () => {
  describe('by default', () => {
    it('displays not found if search returns no results', async () => {
      render((
        <ComboBoxWrapper options={[]} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(screen.getByRole('combobox')).toHaveDescription('No matches found');
    });

    it('does not display a not found if busy', async () => {
      render((
        <ComboBoxWrapper options={[]} busy />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(screen.getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if options are null', async () => {
      render((
        <ComboBoxWrapper options={null} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(screen.getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if options are undefined', async () => {
      render((
        <ComboBoxWrapper options={undefined} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(screen.getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if there is no search', async () => {
      render((
        <ComboBoxWrapper options={[]} />
      ));
      screen.getByRole('combobox').focus();
      expect(screen.getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if the list box is closed', async () => {
      render((
        <ComboBoxWrapper options={[]} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
      expect(screen.getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if the search term matches the current option', async () => {
      render((
        <ComboBoxWrapper options={[]} value="foo" />
      ));
      screen.getByRole('combobox').focus();
      expect(screen.getByRole('combobox')).not.toHaveDescription('No matches found');
    });
  });

  describe('with custom message', () => {
    it('displays custom not found if search returns no results', async () => {
      render((
        <ComboBoxWrapper options={[]} notFoundMessage={<b>custom message</b>} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(screen.getByRole('combobox')).toHaveDescription('custom message');
    });
  });

  describe('when null', () => {
    it('does not display a not found message when no results are found', async () => {
      render((
        <ComboBoxWrapper options={[]} notFoundMessage={null} />
      ));
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(document.getElementById('id_error_message')).toBeFalsy();
    });
  });
});

describe('errorMessage', () => {
  it('displays the error message if supplied', async () => {
    render((
      <ComboBoxWrapper options={['Foo']} errorMessage="Error" />
    ));
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('combobox')).toHaveDescription('Error');
    expectToBeClosed();
  });
});

describe('hint', () => {
  it('is empty with no results', () => {
    render((
      <ComboBoxWrapper options={[]} />
    ));
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('combobox')).toHaveDescription('');
  });

  it('is empty if list box is not showing', () => {
    render((
      <ComboBoxWrapper options={['foo']} value="foo" />
    ));
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('combobox')).toHaveDescription('');
  });

  it('lists the number of options', () => {
    render((
      <ComboBoxWrapper options={['foo', 'bar']} />
    ));
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('combobox')).toHaveDescription('2 options found');
  });

  it('lists one option', () => {
    render((
      <ComboBoxWrapper options={['foo']} />
    ));
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('combobox')).toHaveDescription('1 option found');
  });

  describe('foundOptionsMessage', () => {
    it('customises the found options message', () => {
      const spy = jest.fn((options) => `found ${options.length} options`);
      render((
        <ComboBoxWrapper options={['foo', 'bar']} foundOptionsMessage={spy} />
      ));
      screen.getByRole('combobox').focus();
      expect(screen.getByRole('combobox')).toHaveDescription('found 2 options');
    });
  });
});

describe('screen reader message', () => {
  const options = ['foo'];

  it('adds a debounced message', async () => {
    jest.useFakeTimers();
    const { rerender } = render(<ComboBoxWrapper options={options} />);

    screen.getByRole('combobox').focus();

    expect(getLiveMessage()).toEqual('');
    act(() => jest.advanceTimersByTime(500));
    expect(getLiveMessage()).toEqual('1 option found');

    rerender(<ComboBoxWrapper options={['foo', 'bar']} />);
    expect(getLiveMessage()).toEqual('1 option found');
    act(() => jest.advanceTimersByTime(500));
    expect(getLiveMessage()).toEqual('2 options found');

    rerender(<ComboBoxWrapper options={[]} />);
    await userEvent.type(document.activeElement, 'a');
    expect(getLiveMessage()).toEqual('2 options found');
    act(() => jest.advanceTimersByTime(500));
    expect(getLiveMessage()).toEqual('No matches found');
  });

  it('does not update the message if not focused', () => {
    jest.useFakeTimers();
    render(<ComboBoxWrapper options={options} />);

    expect(getLiveMessage()).toEqual('');
    act(() => jest.advanceTimersByTime(500));
    expect(getLiveMessage()).toEqual('');
  });

  describe('foundOptionsMessage', () => {
    it('customises the found options message', async () => {
      jest.useFakeTimers();
      const spy = jest.fn((ops) => `found ${ops.length} options`);
      render((
        <ComboBoxWrapper options={['foo', 'bar']} foundOptionsMessage={spy} />
      ));
      screen.getByRole('combobox').focus();
      act(() => jest.advanceTimersByTime(500));
      expect(getLiveMessage()).toEqual('found 2 options');
    });
  });

  describe('notFoundMessage', () => {
    it('customises the not found message', async () => {
      jest.useFakeTimers();
      render(<ComboBoxWrapper options={[]} notFoundMessage="not found" />);
      screen.getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'a');
      act(() => jest.advanceTimersByTime(500));
      expect(getLiveMessage()).toEqual('not found');
    });
  });
});

describe('id', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Pear' },
    { label: 'Orange', group: 'Citrus' },
  ];

  it('prefixes all ids', () => {
    const { container } = render(
      <ComboBoxWrapper options={options} id="foo" />,
    );
    screen.getByRole('combobox').focus();
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('div')).not.toHaveAttribute('id');
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'foo');
    expect(screen.getByRole('listbox')).toHaveAttribute('id', 'foo_listbox');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('id', 'foo_option_apple');
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('id', 'foo_option_pear');
    expect(screen.getAllByRole('option')[2]).toHaveAttribute('id', 'foo_option_orange');

    expect(document.getElementById('foo_down_arrow')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_clear_button')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_aria_description')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_not_found')).toBeInstanceOf(Element);
  });
});

describe('classPrefix', () => {
  const options = [
    { label: 'Orange', group: 'Citrus' },
  ];

  it('removes classes when nil', () => {
    const { container } = render(
      <ComboBoxWrapper options={options} classPrefix={null} />,
    );
    screen.getByRole('combobox').focus();
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

  it('prefixes all classes', () => {
    const { container } = render(
      <ComboBoxWrapper options={options} classPrefix="foo" />,
    );
    screen.getByRole('combobox').focus();
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('div')).toHaveClass('foo');
    expect(screen.getByRole('combobox')).toHaveClass('foo__input');
    expect(screen.getByRole('listbox')).toHaveClass('foo__listbox');
    expect(screen.getByRole('option')).toHaveClass('foo__option');
    expect(screen.getByRole('option').previousSibling).toHaveClass('foo__group-label');

    expect(document.getElementById('id_down_arrow')).toHaveClass('foo__down-arrow');
    expect(document.getElementById('id_clear_button')).toHaveClass('foo__clear-button');
    expect(document.getElementById('id_not_found')).toHaveClass('foo__not-found');
  });
});

describe('skipOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows options to be skipped moving forward', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    render(
      <ComboBoxWrapper options={options} skipOption={skipOption} />,
    );
    screen.getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Orange' }));
  });

  it('allows options to be skipped moving backwards', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    render(
      <ComboBoxWrapper options={options} skipOption={skipOption} />,
    );
    screen.getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    expectToHaveFocusedOption(screen.getByRole('option', { name: 'Apple' }));
  });
});

describe('onChange', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('triggers on typing', async () => {
    const spy = jest.fn((e) => e.persist());
    render(
      <ComboBoxWrapper options={options} onChange={spy} />,
    );
    screen.getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'foo');
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'change',
      target: expect.objectContaining({
        value: 'foo',
        nodeName: 'INPUT',
      }),
    }));
  });
});

describe('onBlur', () => {
  it('is called when the input is blurred', async () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={['foo']} onBlur={spy} />);
    await act(async () => {
      screen.getByRole('combobox').focus();
    });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expect(spy).not.toHaveBeenCalled();
    await act(async () => {
      userEvent.tab();
    });
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('onFocus', () => {
  it('is called when the input is focused', async () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={['foo']} onFocus={spy} />);
    screen.getByRole('combobox').focus();
    expect(spy).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    userEvent.tab();
    await waitFor(() => {
      expect(document.body).toHaveFocus();
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('aria-describedby', () => {
  it('is appended to the input', () => {
    render((
      <ComboBoxWrapper options={['foo']} aria-describedby="foo" />
    ));
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'id_aria_description foo');
  });

  it('is appended to the input when not found is showing', async () => {
    render((
      <ComboBoxWrapper options={[]} aria-describedby="foo" />
    ));
    screen.getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'foo');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'id_not_found id_aria_description foo');
  });
});

describe('boolean attributes', () => {
  it.each(['disabled', 'readOnly', 'required'])('%s is added to input', (name) => {
    const props = { [name]: true };
    render((
      <ComboBoxWrapper options={['foo']} {...props} />
    ));
    expect(screen.getByRole('combobox')).toHaveAttribute(name);
  });
});

describe('string attributes', () => {
  it.each([
    'autoComplete', 'autoCapitalize', 'autoCorrect', 'inputMode',
    'pattern', 'placeholder', 'spellCheck',
  ])('%s is added to input', (name) => {
    const props = { [name]: 'foo' };
    render((
      <ComboBoxWrapper options={['foo']} {...props} />
    ));
    expect(screen.getByRole('combobox')).toHaveAttribute(name, 'foo');
  });
});

describe('number attributes', () => {
  it.each(['size', 'maxLength', 'minLength'])('%s is added to input', (name) => {
    const props = { [name]: 2 };
    render((
      <ComboBoxWrapper options={['foo']} {...props} />
    ));
    expect(screen.getByRole('combobox')).toHaveAttribute(name, '2');
  });
});

describe('autoFocus', () => {
  it('focuses the input', () => {
    render((
      <ComboBoxWrapper options={['foo']} autoFocus />
    ));
    // React polyfills autofocus behaviour rather than adding the attribute
    expectToBeOpen();
  });
});

describe('ref', () => {
  it('references the input for an object ref', () => {
    const ref = { current: null };
    render((
      <ComboBoxWrapper options={['foo']} ref={ref} />
    ));
    expect(ref.current).toEqual(screen.getByRole('combobox'));
  });

  it('references the input for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    render((
      <ComboBoxWrapper options={['foo']} ref={ref} />
    ));
    expect(value).toEqual(screen.getByRole('combobox'));
  });
});

describe('renderWrapper', () => {
  it('allows the wrapper to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper options={['foo']} renderWrapper={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toEqual('DL');
    expect(wrapper).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderWrapper={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderInput', () => {
  it('allows the input to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} renderInput={(props) => <textarea data-foo="bar" {...props} />} />,
    );
    expect(screen.getByRole('combobox').tagName).toEqual('TEXTAREA');
    expect(screen.getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderInput={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderListBox', () => {
  it('allows the list box to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} renderListBox={(props) => <dl data-foo="bar" {...props} />} />,
    );
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('listbox').tagName).toEqual('DL');
    expect(screen.getByRole('listbox')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderListBox={spy} test="foo" />
    ));
    screen.getByRole('combobox').focus();
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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroup', () => {
  it('allows the group to be replaced', () => {
    render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroup={(props) => <dl data-foo="bar" {...props} />} />,
    );
    screen.getByRole('combobox').focus();
    const group = screen.getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroup={spy} test="foo" />
    ));
    screen.getByRole('combobox').focus();

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroupLabel', () => {
  it('allows the group label to be replaced', () => {
    render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupLabel={(props) => <dl data-foo="bar" {...props} />} />,
    );
    screen.getByRole('combobox').focus();

    const group = screen.getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupLabel={spy} test="foo" />
    ));
    screen.getByRole('combobox').focus();

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderOption', () => {
  it('allows the option to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} renderOption={(props) => <dl data-foo="bar" {...props} />} />,
    );
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('option').tagName).toEqual('DL');
    expect(screen.getByRole('option')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderOption={spy} test="foo" />
    ));
    screen.getByRole('combobox').focus();
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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroupAccessibleLabel', () => {
  it('allows the group accessible label to be replaced', () => {
    render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupAccessibleLabel={(props) => <dl data-foo="bar" {...props} />} />,
    );
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('option').firstChild.tagName).toEqual('DL');
    expect(screen.getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupAccessibleLabel={spy} test="foo" />
    ));
    screen.getByRole('combobox').focus();
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        children: 'bar ',
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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderValue', () => {
  it('allows the value to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} renderValue={(props) => <dl data-foo="bar" {...props} />} />,
    );
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('option').firstChild.tagName).toEqual('DL');
    expect(screen.getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderValue={spy} test="foo" />
    ));
    screen.getByRole('combobox').focus();
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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderDownArrow', () => {
  it('allows the down arrow to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} renderDownArrow={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const arrow = document.getElementById('id_down_arrow');
    expect(arrow.tagName).toEqual('DL');
    expect(arrow).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderDownArrow={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderClearButton', () => {
  it('allows the clear button to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} value="foo" renderClearButton={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const button = screen.getByRole('button', { name: 'Clear foo' });
    expect(button.tagName).toEqual('DL');
    expect(button).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderClearButton={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderAriaDescription', () => {
  it('allows the clear button to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} value="foo" renderAriaDescription={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const description = document.getElementById('id_aria_description');
    expect(description.tagName).toEqual('DL');
    expect(description).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderAriaDescription={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderNotFound', () => {
  it('allows the not found message to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} value="foo" renderNotFound={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const description = document.getElementById('id_not_found');
    expect(description.tagName).toEqual('DL');
    expect(description).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderNotFound={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderErrorMessage', () => {
  it('allows the error message to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} errorMessage="error" renderErrorMessage={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const description = document.getElementById('id_error_message');
    expect(description.tagName).toEqual('DL');
    expect(description).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} errorMessage="error" renderErrorMessage={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderAriaLiveMessage', () => {
  it('allows the aria live message to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} value="foo" renderAriaLiveMessage={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const description = document.querySelector('[aria-live=polite]');
    expect(description.tagName).toEqual('DL');
    expect(description).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <ComboBoxWrapper options={['foo']} renderAriaLiveMessage={spy} test="foo" />
    ));

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
        [DISPATCH]: expect.any(Function),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('visuallyHiddenClassName', () => {
  it('allows custom props', () => {
    render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        visuallyHiddenClassName="bar"
      />,
    );
    screen.getByRole('combobox').focus();
    expect(screen.getByRole('option').firstChild).toHaveClass('bar');
  });
});

describe('onLayoutListBox', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when the component is rendered', () => {
    const onLayoutListBox = jest.fn();
    render(
      <ComboBoxWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    expect(onLayoutListBox).toHaveBeenCalledWith({
      expanded: false,
      listbox: screen.getByRole('listbox', { hidden: true }),
    });
  });

  it('is called when the listbox is displayed', () => {
    const onLayoutListBox = jest.fn();
    render(
      <ComboBoxWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    screen.getByRole('combobox').focus();
    expect(onLayoutListBox).toHaveBeenCalledWith({
      expanded: true,
      listbox: screen.getByRole('listbox'),
    });
  });

  it('is called when the listbox options change', () => {
    const onLayoutListBox = jest.fn();
    const { rerender } = render((
      <ComboBoxWrapper options={options} onLayoutListBox={onLayoutListBox} />
    ));
    screen.getByRole('combobox').focus();
    rerender(<ComboBoxWrapper options={['strawberry']} onLayoutListBox={onLayoutListBox} />);
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: true,
      listbox: screen.getByRole('listbox'),
    });
  });

  it('when the listbox is closed', () => {
    const onLayoutListBox = jest.fn();
    render((
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />
    ));
    screen.getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: false,
      listbox: screen.getByRole('listbox', { hidden: true }),
    });
  });

  it('is called while the listbox is closed', () => {
    const onLayoutListBox = jest.fn();
    const { rerender } = render((
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />
    ));
    rerender(<ComboBoxWrapper options={['strawberry']} onLayoutListBox={onLayoutListBox} />);
    expect(onLayoutListBox).toHaveBeenCalledWith({
      expanded: false,
      listbox: screen.getByRole('listbox', { hidden: true }),
    });
  });
});

describe('other props', () => {
  it('are discarded', () => {
    render((
      <ComboBoxWrapper options={['foo']} foo="bar" />
    ));
    expect(screen.getByRole('combobox')).not.toHaveAttribute('foo');
  });
});
