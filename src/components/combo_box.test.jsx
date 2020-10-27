import React, { useState, useContext, forwardRef } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBox } from './combo_box';
import { Context } from '../context';

class PropUpdater {
  setUpdater(fn) {
    this.setter = fn;
  }

  update(value) {
    act(() => this.setter(value));
  }
}

const ComboBoxWrapper = forwardRef(({ value: initialValue, propUpdater, ...props }, ref) => {
  const [value, onValue] = useState(initialValue);
  const [newProps, setProps] = useState(props);
  if (propUpdater) {
    propUpdater.setUpdater(setProps);
  }
  return (
    <ComboBox
      id="id"
      aria-labelledby="id-label"
      value={value}
      onValue={onValue}
      {...newProps}
      ref={ref}
    />
  );
});

function expectToBeClosed(combobox) { // and focused
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(combobox).toHaveFocus();
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).not.toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'false');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveNotFoundMessage(combobox, message) {
  expectToBeClosed(combobox);
  const id = `${combobox.id}_not_found`;
  expect(combobox.getAttribute('aria-describedby').split(/\s+/)).toContain(id);
  const notFound = document.getElementById(id);
  expect(notFound).toBeVisible();
  expect(notFound).toHaveTextContent(message);
}

function expectNotToHaveNotFoundMessage(combobox) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const id = `${combobox.id}_not_found`;
  if (combobox.getAttribute('aria-describedby')) {
    expect(combobox.getAttribute('aria-describedby').split(/\s+/)).not.toContain(id);
  }
  const notFound = document.getElementById(id);
  expect(notFound).not.toBeVisible();
  expect(notFound).not.toHaveTextContent();
}

function expectToBeOpen(combobox) { // and focused with no selected or focused option
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(combobox).toHaveFocus();
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expectNotToHaveNotFoundMessage(combobox);
}

function expectToHaveFocusedOption(combobox, option) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(option).toHaveFocus();
  expectNotToHaveNotFoundMessage(combobox);
}

function expectToHaveSelectedOption(combobox, option) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(combobox).toHaveFocus();
  expectNotToHaveNotFoundMessage(combobox);
}

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders a closed combo box', () => {
        const { container, getByRole } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });

      describe('focusing the list box', () => {
        it('opens the combo box with no option selected', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          expectToBeOpen(getByRole('combobox'));
        });

        describe('with no options it does not open the list box', () => {
          it('does not open the combo box', () => {
            const { getByRole } = render(<ComboBoxWrapper options={[]} />);
            getByRole('combobox').focus();
            expectToBeClosed(getByRole('combobox'));
          });
        });
      });

      describe('navigating options in an open listbox', () => {
        describe('pressing the down arrow', () => {
          it('moves to the first option from the input', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });

          it('moves to the next option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('moves from the last option to the input', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen(getByRole('combobox'));
          });

          it('does nothing with the alt key pressed', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing the up arrow', () => {
          it('moves from the input to the last option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
          });

          it('moves to the previous option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('moves from the first option to the input', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing the home key', () => {
          describe('on a mac', () => {
            it('moves to the first option with the home key', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
              fireEvent.keyDown(document.activeElement, { key: 'Home' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box', () => {
              const { getByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
              fireEvent.keyDown(document.activeElement, { key: 'Home' });
              expectToBeOpen(getByRole('combobox'));
            });
          });
        });

        describe('pressing the end key', () => {
          describe('on a mac', () => {
            it('moves to the last option with the end key', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'End' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box', () => {
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'End' });
              expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });
        });

        describe('typing', () => {
          it('moves focus back to the list box', async () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            await userEvent.type(document.activeElement, 'a');
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing backspace', () => {
          it('moves focus back to the list box', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Backspace' });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing arrow left', () => {
          it('moves focus back to the list box', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing arrow right', () => {
          it('moves focus back to the list box', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing delete', () => {
          it('moves focus back to the list box removing the selected option', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Delete' });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing Ctrl+d', () => {
          describe('on a mac', () => {
            it('moves focus back to the list box removing the selected option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'd', ctrlKey: true });
              expectToBeOpen(getByRole('combobox'));
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box removing the selected option', () => {
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'd', ctrlKey: true });
              expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });
        });

        describe('pressing Ctrl+k', () => {
          describe('on a mac', () => {
            it('moves focus back to the list box removing the selected option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'k', ctrlKey: true });
              expectToBeOpen(getByRole('combobox'));
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box removing the selected option', () => {
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'k', ctrlKey: true });
              expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });
        });
      });

      describe('selecting an option', () => {
        describe('when clicking on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expectToBeClosed(getByRole('combobox'));
          });

          it('updates the displayed value', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expect(getByRole('combobox')).toHaveValue('Banana');
          });

          it('does nothing if a different mouse button is pressed', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1], { button: 1 });
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen(getByRole('combobox'));
          });

          it('cancels mousedown', () => {
            const spy = jest.fn();
            document.addEventListener('mousedown', spy);
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.mouseDown(getAllByRole('option')[1]);
            expect(spy.mock.calls[0][0].defaultPrevented).toEqual(true);
            document.removeEventListener('mousedown', spy);
          });
        });

        describe('when pressing enter on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed(getByRole('combobox'));
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(getByRole('combobox')).toHaveValue('Apple');
          });
        });

        describe('when blurring the combobox', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <>
                <ComboBoxWrapper options={options} onValue={spy} />
                <input />
              </>
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
            });
          });

          it('closes the list box', async () => {
            const { getByRole } = render((
              <>
                <ComboBoxWrapper options={options} />
                <input type="text" />
              </>
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
            });
            expect(getByRole('textbox')).toHaveFocus();
          });

          it('updates the displayed value', async () => {
            const { getByRole } = render((
              <>
                <ComboBoxWrapper options={options} />
                <input />
              </>
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(getByRole('combobox')).toHaveValue('Apple');
            });
          });

          describe('when no option has been selected', () => {
            it('closes the list box and clears the search', async () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <>
                  <ComboBoxWrapper options={options} onValue={spy} />
                  <input />
                </>
              ));
              getByRole('combobox').focus();
              await userEvent.type(document.activeElement, 'app');
              userEvent.tab();
              await waitFor(() => {
                expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              });
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('combobox')).toHaveValue('');
            });
          });
        });
      });

      describe('when pressing escape on an option', () => {
        it('closes the list box', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expectToBeClosed(getByRole('combobox'));
        });

        it('clears the focused value', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToBeOpen(getByRole('combobox'));
        });

        it('keeps the current value', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Enter' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expectToBeClosed(getByRole('combobox'));
          expect(getByRole('combobox')).toHaveValue('Apple');
        });
      });

      describe('when pressing ArrowUp + alt on an option', () => {
        it('closes the list box', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
          expectToBeClosed(getByRole('combobox'));
        });

        describe('with no value', () => {
          it('resets focused value', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('with a value', () => {
          it('resets focused value', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' }); // Choose an option
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' }); // Change the selection
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });
        });
      });

      describe('on a closed listbox', () => {
        describe('pressing arrow down + alt', () => {
          it('opens the listbox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing arrow down', () => {
          it('opens the listbox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing arrow up', () => {
          it('opens the listbox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing arrow up + alt', () => {
          it('does not open the listbox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expectToBeClosed(getByRole('combobox'));
          });
        });

        describe('pressing Enter', () => {
          it('does not select an option', () => {
            const spy = jest.fn();
            const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the Home key', () => {
          describe('on a mac', () => {
            it('does not change the option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Enter' });
              fireEvent.keyDown(document.activeElement, { key: 'Home' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
            });
          });
        });

        describe('pressing the End key', () => {
          describe('on a mac', () => {
            it('does not change the option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Enter' });
              fireEvent.keyDown(document.activeElement, { key: 'End' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
            });
          });
        });

        describe('mouse button up', () => {
          it('opens the listbox on left click', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.mouseUp(document.activeElement, { button: 0 });
            expectToBeOpen(getByRole('combobox'));
          });

          it('does not open the listbox on right click', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.mouseUp(document.activeElement, { button: 1 });
            expectToBeClosed(getByRole('combobox'));
          });
        });
      });

      describe('refocusing the listbox', () => {
        it('removes focus from the list box keeping the current selection', () => {
          const { getByRole, getAllByRole } = render((
            <ComboBoxWrapper options={options} value="Orange" />
          ));
          getByRole('combobox').focus();
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[2]);
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          getByRole('combobox').focus();
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('typing', () => {
        it('updates the input value', () => {
          const { getByRole } = render((
            <ComboBoxWrapper options={options} />
          ));
          getByRole('combobox').focus();
          userEvent.type(getByRole('combobox'), 'foo');
          expect(getByRole('combobox')).toHaveValue('foo');
        });

        describe('single option with matching value', () => {
          it('does not show the listbox if the search matches the value', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={['foo']} />
            ));
            getByRole('combobox').focus();
            userEvent.type(getByRole('combobox'), 'foo');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed(getByRole('combobox'));

            fireEvent.change(document.activeElement, { target: { value: 'fo' } });
            expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));
            userEvent.type(getByRole('combobox'), 'o');
            expectToBeClosed(getByRole('combobox'));
          });
        });

        describe('multiple options with matching value', () => {
          it('does show the listbox if the search matches the value', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={['foo', 'foo bar']} />
            ));
            getByRole('combobox').focus();
            userEvent.type(getByRole('combobox'), 'foo');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed(getByRole('combobox'));

            fireEvent.change(document.activeElement, { target: { value: 'fo' } });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
            userEvent.type(getByRole('combobox'), 'o');
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });

      describe('setting the search to an empty string', () => {
        describe('without an existing value', () => {
          it('does not call onValue', async () => {
            const spy = jest.fn();
            const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(spy).not.toHaveBeenCalled();
          });

          it('clears the focused option', async () => {
            const spy = jest.fn();
            const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.change(getByRole('combobox'), { target: { value: '' } });
            expect(spy).toHaveBeenCalledWith(null);
            expectToBeOpen(document.activeElement);
          });
        });

        describe('with an existing value', () => {
          it('calls onValue with null', () => {
            const spy = jest.fn();
            const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} value="Apple" />);
            getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(spy).toHaveBeenCalledWith(null);
          });

          it('clears the existing option', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" />);
            getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(document.activeElement).toHaveValue('');
          });

          it('clears the selected option', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" />);
            getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expectToBeOpen(document.activeElement);
          });
        });
      });
    });

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', () => {
        const { container, getByRole, getAllByRole } = render((
          <ComboBoxWrapper options={options} />
        ));
        getByRole('combobox').focus();
        expect(container).toMatchSnapshot();
        expect(getAllByRole('option')[1]).toHaveAttribute('aria-disabled', 'true');
      });

      it('selects a disabled option with the arrow keys', () => {
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <>
                <ComboBoxWrapper options={options} onValue={spy} />
                <input type="text" />
              </>
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
            });
            expect(spy).not.toHaveBeenCalled();
            expect(getByRole('textbox')).toHaveFocus();
          });
        });
      });
    });

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={options} value={2} onValue={spy} />,
        );
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={options} value={2} onValue={spy} />,
        );
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('html', () => {
      it('sets attributes on the option', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        const { getByRole } = render(
          <ComboBoxWrapper options={options} />,
        );
        getByRole('combobox').focus();
        expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(getByRole('option')).toHaveAttribute('class', 'class');
      });

      describe('html id', () => {
        it('is used as the options id', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }];
          const { getByRole } = render(
            <ComboBoxWrapper options={options} />,
          );
          getByRole('combobox').focus();
          expect(getByRole('option')).toHaveAttribute('id', 'xxx');
        });

        it('will not use duplicate ids', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }, { label: 'bar', html: { id: 'xxx' } }];
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={options} />,
          );
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expect(getAllByRole('option')[0]).toHaveAttribute('id', 'xxx');
          expect(getAllByRole('option')[1]).toHaveAttribute('id', 'xxx_1');
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
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        expect(getAllByRole('option')[1]).toHaveTextContent('Orange');
      });

      it('triggers onValue when an option is selected', () => {
        const spy = jest.fn();
        const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', () => {
        const { getByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(getByRole('combobox')).toHaveValue('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', () => {
          const spy = jest.fn();
          const { getByRole, getAllByText } = render(
            <ComboBoxWrapper options={options} onValue={spy} />,
          );
          getByRole('combobox').focus();
          fireEvent.click(getAllByText('Citrus')[0]);
          expect(spy).not.toHaveBeenCalled();
          expectToBeOpen(getByRole('combobox'));
        });
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        const { getByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        expect(getByRole('option')).not.toHaveAttribute('data-foo', 'bar');
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
      const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('Banana');
      expectToBeClosed(getByRole('combobox'));
    });

    it('can select an empty string', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={['']} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('');
      expectToBeClosed(getByRole('combobox'));
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
      const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(2);
      expectToBeClosed(getByRole('combobox'));
    });

    it('can select 0', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={[0]} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(0);
      expectToBeClosed(getByRole('combobox'));
    });
  });

  describe('options as null', () => {
    it('renders an option with an empty string', () => {
      const { container, getByRole, getAllByRole } = render(<ComboBoxWrapper options={[null, 'foo']} />);
      expect(container).toMatchSnapshot();
      getByRole('combobox').focus();
      expectToBeOpen(getByRole('combobox'));
      expect(getAllByRole('option')[0]).toHaveTextContent('');
      expect(getAllByRole('option')[0]).not.toHaveTextContent('null');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={[null, 'foo']} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(null);
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as undefined', () => {
    it('renders an option with an empty string', () => {
      const { container, getByRole, getAllByRole } = render(<ComboBoxWrapper options={[undefined, 'foo']} />);
      expect(container).toMatchSnapshot();
      getByRole('combobox').focus();
      expectToBeOpen(getByRole('combobox'));
      expect(getAllByRole('option')[0]).toHaveTextContent('');
      expect(getAllByRole('option')[0]).not.toHaveTextContent('undefined');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={[undefined, 'foo']} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(undefined);
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });
  });

  describe('no options', () => {
    it('does not open the listbox on focus', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not open the listbox on alt + arrow down', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
      expectToBeClosed(getByRole('combobox'));
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { getByRole, getByText } = render(<ComboBoxWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      getByRole('combobox').focus();
      fireEvent.click(getByText('Orange'));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { getByRole, getByText } = render(<ComboBoxWrapper
        options={options}
        mapOption={({ name }) => ({ label: name })}
      />);
      getByRole('combobox').focus();
      fireEvent.click(getByText('Orange'));
      expect(getByRole('combobox')).toHaveValue('Orange');
    });
  });
});

describe('value', () => {
  it('sets the initial selected option', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const { getAllByRole, getByRole } = render((
      <ComboBoxWrapper options={options} value="Banana" />
    ));
    getByRole('combobox').focus();
    expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
  });

  it('sets the combo box value', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const { getByRole } = render((
      <ComboBoxWrapper options={options} value="Banana" />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveValue('Banana');
  });

  describe('with a single option matching the value', () => {
    it('does not open the combo box', () => {
      const options = ['foo'];
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="foo" />
      ));
      getByRole('combobox').focus();
      expectToBeClosed(getByRole('combobox'));
    });
  });

  describe('value is disabled', () => {
    it('selects the disabled option', () => {
      const options = [{ label: 'Apple', disabled: true }, 'Banana'];
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={options} value="Apple" />
      ));
      getByRole('combobox').focus();
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
    });
  });

  describe('value is not in options', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('does not select a value', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Strawberry" />
      ));
      getByRole('combobox').focus();
      expectToBeOpen(getByRole('combobox'));
    });

    it('displays value as the combo box label', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Strawberry" />
      ));
      expect(getByRole('combobox')).toHaveValue('Strawberry');
    });
  });

  describe('value is an empty string', () => {
    const options = [null, 'foo'];

    it('selects the value', () => {
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={options} value="" />
      ));
      getByRole('combobox').focus();
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
    });
  });

  describe('updating the value', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('updates the aria-selected value of an open listbox', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
        value="Orange"
      />);
      getByRole('combobox').focus();
      propUpdater.update((props) => ({ ...props, value: 'Apple' }));
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
    });

    it('changes the focused value of an open listbox', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      propUpdater.update((props) => ({ ...props, value: 'Banana' }));
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
    });

    it('changes the value of a closed listbox', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      propUpdater.update((props) => ({ ...props, value: 'Banana' }));
      expect(document.activeElement).toHaveValue('Banana');
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
    });
  });
});

describe('open button', () => {
  const options = ['Apple', 'Orange', 'Banana'];

  it('pressing the button focuses the input', () => {
    render(<ComboBoxWrapper options={options} />);
    const open = document.getElementById('id_open_button');
    expect(open).toBeVisible();
    userEvent.click(open);
    expectToBeOpen(document.activeElement);
  });

  it('pressing the middle button does not focus the input', () => {
    const { getByRole } = render(<ComboBoxWrapper options={options} />);
    const open = document.getElementById('id_open_button');
    expect(open).toBeVisible();
    fireEvent.click(open, { button: 1 });
    expect(getByRole('combobox')).not.toHaveFocus();
    expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
  });

  it('is not present with a value', () => {
    render(<ComboBoxWrapper options={options} value="Apple" />);
    const open = document.getElementById('id_open_button');
    expect(open).not.toBeVisible();
  });

  it('is not present with no options', () => {
    render(<ComboBoxWrapper options={[]} />);
    const open = document.getElementById('id_open_button');
    expect(open).not.toBeVisible();
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
    const remove = document.getElementById('id_clear_button');
    expect(remove).toBeVisible();
    userEvent.click(remove);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing the middle button does not remove the value', () => {
    const spy = jest.fn();
    render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = document.getElementById('id_clear_button');
    expect(remove).toBeVisible();
    fireEvent.click(remove, { button: 1 });
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
          const { container, getByRole } = render((
            <ComboBoxWrapper options={['foo']} busy busyDebounce={null} />
          ));
          getByRole('combobox').focus();
          userEvent.type(getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
        });
      });

      describe('with a search matching the current value', () => {
        it('does not set aria-busy', () => {
          const { container, getByRole } = render((
            <ComboBoxWrapper options={['foo']} value="foo" busy busyDebounce={null} />
          ));
          getByRole('combobox').focus();
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
          const { container, getByRole } = render((
            <ComboBoxWrapper options={['foo']} busy={null} busyDebounce={null} />
          ));
          getByRole('combobox').focus();
          userEvent.type(getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });
    });
  });

  describe('busyDebounce is the default', () => {
    describe('when true', () => {
      it('sets aria-busy=true on the wrapper after 400ms', () => {
        jest.useFakeTimers();
        const { container, getByRole } = render((
          <ComboBoxWrapper options={['foo']} busy />
        ));
        getByRole('combobox').focus();
        userEvent.type(getByRole('combobox'), 'foo');
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
        const { container, getByRole } = render((
          <ComboBoxWrapper options={['foo']} busy busyDebounce={500} />
        ));
        getByRole('combobox').focus();
        userEvent.type(getByRole('combobox'), 'foo');
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
      const { getByRole } = render(<ComboBoxWrapper options={['foo']} />);
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    });
  });

  describe('when provided', () => {
    it('sets aria-autocomplete to list', () => {
      const { getByRole } = render(<ComboBoxWrapper options={['foo']} onSearch={() => {}} />);
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    describe('on rendering', () => {
      it('does not call onSearch', () => {
        const spy = jest.fn();
        render((
          <ComboBoxWrapper options={['foo']} onSearch={spy} value="foo" />
        ));
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('on focus', () => {
      it('calls onSearch without a value', () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onSearch={spy} />
        ));
        getByRole('combobox').focus();
        expect(spy).toHaveBeenCalledWith('');
      });

      it('calls onSearch with a value', () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onSearch={spy} value="foo" />
        ));
        getByRole('combobox').focus();
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });

    describe('typing', () => {
      it('calls onSearch', async () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onSearch={spy} />
        ));
        getByRole('combobox').focus();
        await userEvent.type(getByRole('combobox'), 'foo');
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
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onValue={spy} />
        ));
        getByRole('combobox').focus();
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
      const propUpdater = new PropUpdater();
      const { container, getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      getByRole('combobox').focus();
      propUpdater.update((props) => ({ ...props, options: newOptions }));
      expect(container).toMatchSnapshot();
      expect(getAllByRole('option').map((o) => o.textContent)).toEqual([
        'Strawberry',
        'Raspberry',
        'Banana',
      ]);
    });

    describe('update contains the focused option', () => {
      it('keeps the currently focused option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the focused option', () => {
      it('removes the focused option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: otherNewOptions }));
        expectToBeOpen(getByRole('combobox'));
      });
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          value="Banana"
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the selected option', () => {
      it('removes the selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          value="Banana"
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: otherNewOptions }));
        expectToBeOpen(getByRole('combobox'));
      });
    });

    describe('updated options are empty', () => {
      it('closes the list box', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          value="Banana"
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: [] }));
        expectToBeClosed(getByRole('combobox'));
      });
    });
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', () => {
      const { getByRole, getAllByRole } = render(
        <ComboBoxWrapper options={options} managedFocus={false} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveFocus();
      expect(comboBox).toHaveAttribute('aria-activedescendant', getAllByRole('option')[1].id);
      expect(getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('allows an option to be selected', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} managedFocus={false} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'Enter' });
      expect(comboBox).toHaveFocus();
      expectToBeClosed(getByRole('combobox'));
      expect(comboBox).toHaveValue('Apple');
    });
  });
});

describe('showSelectedLabel', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('by default', () => {
    it('does not show the selected option label in the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when false', () => {
    it('does not show the selected option label in the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel={false} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when true', () => {
    it('shows the selected option label in the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('Apple');
    });

    it('shows the selected option label in the input after typing', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      userEvent.type(document.activeElement, 'a');
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('Apple');
    });

    it('shows the original search when returning to the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      userEvent.type(document.activeElement, 'a');
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'ArrowUp' });
      expect(comboBox).toHaveValue('a');
    });

    it('does not show the label of a disabled option', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[{ disabled: true, label: 'foo' }]} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });

    it('does not trigger a search when moving through options', () => {
      const spy = jest.fn();
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel onSearch={spy} />,
      );
      const comboBox = getByRole('combobox');
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
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('does not change the value of aria-autocomplete for an onSearch', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect onSearch={() => {}} />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    describe('when typing', () => {
      it('auto selects the first matching option', async () => {
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
      });

      it('auto selects the first non-disabled option', async () => {
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={[{ disabled: true, label: 'frog' }, 'foo']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
      });

      it('does not auto select no matching option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foc', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'c');
        expectToBeOpen(getByRole('combobox'));
      });

      it('does not auto select later matching options', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'b');
        expectToBeOpen(getByRole('combobox'));
      });
    });

    describe('backspace', () => {
      it('does not auto-select an option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'fo');
        fireEvent.keyDown(getByRole('combobox'), { key: 'Backspace' });
        expectToBeOpen(getByRole('combobox'));
      });

      describe('ctrl+d', () => {
        describe('on a mac', () => {
          it('does not auto-select an option', async () => {
            jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
            const { getByRole } = render(
              <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'fo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'd', ctrlKey: true });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('on other systems', () => {
          it('continues to auto-select an option', async () => {
            const { getByRole, getAllByRole } = render(
              <ComboBoxWrapper options={['food', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'd', ctrlKey: true });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });
    });

    describe('delete', () => {
      it('does not auto-select an option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'foo');
        fireEvent.keyDown(getByRole('combobox'), { key: 'Delete' });
        fireEvent.change(getByRole('combobox'), { target: { value: 'foo' } });
        expectToBeOpen(getByRole('combobox'));
      });

      describe('ctrl+h', () => {
        describe('on a mac', () => {
          it('does not auto-select an option', async () => {
            jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
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

        describe('on other systems', () => {
          it('continues to auto-select an option', async () => {
            const { getByRole, getAllByRole } = render(
              <ComboBoxWrapper options={['fooh', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'h', ctrlKey: true });
            fireEvent.change(getByRole('combobox'), { target: { value: 'fooh' } });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });

      describe('ctrl+k', () => {
        describe('on a mac', () => {
          it('does not auto-select an option', async () => {
            jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
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

        describe('on other systems', () => {
          it('continues to auto-select an option', async () => {
            const { getByRole, getAllByRole } = render(
              <ComboBoxWrapper options={['fook', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'k', ctrlKey: true });
            fireEvent.change(getByRole('combobox'), { target: { value: 'fok' } });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });

      describe('selecting options', () => {
        it('allows other options to be selected', async () => {
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
          );
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('updates to options', () => {
        it('autoselects a new value if no value is autoselected', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'ba');
          expectToBeOpen(getByRole('combobox'));
          propUpdater.update((props) => ({ ...props, options: ['bar', 'foo'] }));
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
        });

        it('autoselects a new value if a value is autoselected', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          propUpdater.update((props) => ({ ...props, options: ['food', 'bard'] }));
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
        });

        it('removes the autoselect if there is no matching value', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          propUpdater.update((props) => ({ ...props, options: ['bar', 'foo'] }));
          expectToBeOpen(getByRole('combobox'));
        });

        it('does not autoselect if a different value is focused', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          propUpdater.update((props) => ({ ...props, options: ['food', 'bar'] }));
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('on blur', () => {
        it('selects the autoselected value', async () => {
          const spy = jest.fn();
          const { getByRole } = render((
            <>
              <ComboBoxWrapper options={['foo']} autoselect onValue={spy} />
              <input />
            </>
          ));
          getByRole('combobox').focus();
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
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect="inline" />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'inline');
    });

    it('changes the value of aria-autocomplete for an onSearch', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect="inline" onSearch={() => {}} />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'both');
    });

    describe('when typing', () => {
      it('selects the text of the autoselected option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));
        expect(document.activeElement).toHaveValue('foo');
        expect(spy).toHaveBeenCalledWith(1, 3, 'backwards');
      });

      it('does not select the text of a disabled option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={[{ label: 'foo', disabled: true }]} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        userEvent.type(document.activeElement, 'f');
        expectToBeOpen(getByRole('combobox'));
        expect(document.activeElement).toHaveValue('f');
        expect(spy).not.toHaveBeenCalled();
      });

      it('does not select the text if the cursor position is inappropriate', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['abcd']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        document.activeElement.value = 'ac';
        document.activeElement.setSelectionRange(1, 1);
        // can't use userEvent.type, as it always sets the selectionRange to the end of the input
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.change(document.activeElement, { target: { value: 'abc' } });
        expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));
        expect(document.activeElement).toHaveValue('abc');
        expect(spy).not.toHaveBeenCalled();
      });

      it('removes the autoselected text and last character on backspace', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
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
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
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
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
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
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel />,
          );
          getByRole('combobox').focus();
          // can't use userEvent.type, as it ignores selection ranges
          fireEvent.change(document.activeElement, { target: { value: 'fo' } });
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          expect(getByRole('combobox')).toHaveValue('foe');
          expect(spy).not.toHaveBeenCalled();
        });

        describe('when returning to the original option', () => {
          it('sets the search string without selecting the text', () => {
            const { getByRole, getAllByRole } = render(
              <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel />,
            );
            getByRole('combobox').focus();
            // can't use userEvent.type, as it ignores selection ranges
            fireEvent.change(document.activeElement, { target: { value: 'fo' } });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

            const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveValue('fo');
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });

      describe('when showSelectedLabel is false', () => {
        it('does not update the value to the selected label', () => {
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel={false} />,
          );
          getByRole('combobox').focus();
          // can't use userEvent.type, as it ignores selection ranges
          fireEvent.change(document.activeElement, { target: { value: 'fo' } });
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          expect(getByRole('combobox')).toHaveValue('fo');
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe('selecting an option', () => {
      it('removes the text selection', () => {
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expectToBeClosed(getByRole('combobox'));
        expect(getByRole('combobox')).toHaveValue('foo');
        expect(spy).toHaveBeenCalledWith(3, 3, 'forward');
      });

      it('does not change the selection without focus', async () => {
        const { getByRole, getAllByRole } = render((
          <>
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />
            <input />
          </>
        ));
        getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        userEvent.tab();
        await waitFor(() => {
          expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
        });
        expect(getByRole('combobox')).toHaveValue('foo');
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});

describe('tabAutocomplete', () => {
  describe('when tabAutocomplete is false', () => {
    it('pressing tab does not select the item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('when tabAutocomplete is true', () => {
    it('pressing tab selects the suggested item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).toHaveBeenCalledWith('foo');
    });

    it('pressing shift+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing alt+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', altKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing ctrl+tab does not select the suggested item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', ctrlKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing meta+tab does not select the suggested item item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', metaKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing tab does not select a focused item', async () => {
      const spy = jest.fn();
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing tab does not reselect the suggested item current item', async () => {
      const spy = jest.fn();
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} value="foo" />
      ));
      getByRole('combobox').focus();
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });

    describe('when autoselect is true', () => {
      it('pressing tab selects the item', async () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
        ));
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'fo');
        fireEvent.keyDown(document.activeElement, { key: 'Tab' });
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });

    describe('when autoselect is inline', () => {
      it('pressing tab selects the item', async () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" tabAutocomplete onValue={spy} />
        ));
        getByRole('combobox').focus();
        // can't use userEvent.type, as it ignores selection ranges
        fireEvent.change(document.activeElement, { target: { value: 'fo' } });
        fireEvent.keyDown(document.activeElement, { key: 'Tab' });
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });
  });
});

describe('expandOnFocus', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  describe('when unset', () => {
    it('expands on focus', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} />
      ));
      getByRole('combobox').focus();
      expectToBeOpen(getByRole('combobox'));
    });

    it('expands when the clear button is pressed', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Apple" />
      ));
      getByRole('combobox').focus();
      userEvent.click(document.getElementById('id_clear_button'));
      expectToBeOpen(getByRole('combobox'));
    });
  });

  describe('when true', () => {
    it('expands on focus', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} expandOnFocus />
      ));
      getByRole('combobox').focus();
      expectToBeOpen(getByRole('combobox'));
    });

    it('expands when the clear button is pressed', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Apple" expandOnFocus />
      ));
      getByRole('combobox').focus();
      userEvent.click(document.getElementById('id_clear_button'));
      expectToBeOpen(getByRole('combobox'));
    });
  });

  describe('when false', () => {
    it('does not expand on focus', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} expandOnFocus={false} />
      ));
      getByRole('combobox').focus();
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not expand when the clear button is pressed', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Apple" expandOnFocus={false} />
      ));
      getByRole('combobox').focus();
      userEvent.click(document.getElementById('id_clear_button'));
      expectToBeClosed(getByRole('combobox'));
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
    const { getByRole, getAllByRole } = render((
      <ComboBoxWrapper options={options} autoselect findSuggestion={findSuggestion} />
    ));
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'o');
    expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[2]);
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
    const { getByRole } = render((
      <ComboBoxWrapper options={options} autoselect findSuggestion={findSuggestion} />
    ));
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'o');
    expectToBeOpen(getByRole('combobox'));
    expect(findSuggestion.mock.calls).toEqual([
      [expect.objectContaining({ value: 'Apple' }), 'o'],
    ]);
  });
});

describe('notFoundMessage', () => {
  describe('by default', () => {
    it('displays not found if search returns no results', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectToHaveNotFoundMessage(document.activeElement, 'No matches found');
    });

    it('does not display a not found if busy', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} busy />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if busy is null', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} busy={null} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if there is no search', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if the list box is closed', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if the search term matches the current option', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} value="foo" />
      ));
      getByRole('combobox').focus();
      expectNotToHaveNotFoundMessage(document.activeElement);
    });
  });

  describe('with custom message', () => {
    it('displays custom not found if search returns no results', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} notFoundMessage={<b>custom message</b>} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectToHaveNotFoundMessage(document.activeElement, 'custom message');
    });
  });

  describe('when null', () => {
    it('does not disabled a not found message when no results are found', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} notFoundMessage={null} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectNotToHaveNotFoundMessage(document.activeElement);
    });
  });
});

describe('hint', () => {
  it('is empty with no results', () => {
    const { container, getByRole } = render((
      <ComboBoxWrapper options={[]} />
    ));
    getByRole('combobox').focus();
    expect(container.querySelector('#id_found_description')).not.toHaveTextContent();
  });

  it('is empty if list box is not showing', () => {
    const { container, getByRole } = render((
      <ComboBoxWrapper options={['foo']} value="foo" />
    ));
    getByRole('combobox').focus();
    expect(container.querySelector('#id_found_description')).not.toHaveTextContent();
  });

  it('lists the number of options', () => {
    const { container, getByRole } = render((
      <ComboBoxWrapper options={['foo', 'bar']} />
    ));
    getByRole('combobox').focus();
    expect(container.querySelector('#id_found_description')).toHaveTextContent('2 options found');
  });

  it('lists one option', () => {
    const { container, getByRole } = render((
      <ComboBoxWrapper options={['foo']} />
    ));
    getByRole('combobox').focus();
    expect(container.querySelector('#id_found_description')).toHaveTextContent('1 option found');
  });
});

describe('id', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Pear' },
    { label: 'Orange', group: 'Citrus' },
  ];

  it('prefixes all ids', () => {
    const { container, getByRole, getAllByRole } = render(
      <ComboBoxWrapper options={options} id="foo" />,
    );
    getByRole('combobox').focus();
    expect(container.querySelector('div')).not.toHaveAttribute('id');
    expect(getByRole('combobox')).toHaveAttribute('id', 'foo');
    expect(getByRole('listbox')).toHaveAttribute('id', 'foo_listbox');
    expect(getAllByRole('option')[0]).toHaveAttribute('id', 'foo_option_apple');
    expect(getAllByRole('option')[1]).toHaveAttribute('id', 'foo_option_pear');
    expect(getAllByRole('option')[2]).toHaveAttribute('id', 'foo_option_orange');

    expect(document.getElementById('foo_open_button')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_clear_button')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_found_description')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_not_found')).toBeInstanceOf(Element);
  });
});

describe('skipOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows options to be skipped moving forward', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    const { getByRole, getAllByRole } = render(
      <ComboBoxWrapper options={options} skipOption={skipOption} />,
    );
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
  });

  it('allows options to be skipped moving backwards', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    const { getByRole, getAllByRole } = render(
      <ComboBoxWrapper options={options} skipOption={skipOption} />,
    );
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
  });

  describe('on a mac', () => {
    it('allows options to be skipped pressing home', () => {
      jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
      function skipOption(option) {
        return option.label === 'Apple';
      }
      const { getByRole, getAllByRole } = render(
        <ComboBoxWrapper options={options} skipOption={skipOption} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'Home' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
    });

    it('allows options to be skipped pressing end', () => {
      jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
      function skipOption(option) {
        return option.label === 'Orange';
      }
      const { getByRole, getAllByRole } = render(
        <ComboBoxWrapper options={options} skipOption={skipOption} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'End' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
    });
  });
});

describe('onChange', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('triggers on typing', async () => {
    const spy = jest.fn((e) => e.persist());
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onChange={spy} />,
    );
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'foo');
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'change',
      target: expect.objectContaining({
        value: 'foo',
        nodeName: 'INPUT',
      }),
    }));
  });

  it('does not trigger when a value is selected', async () => {
    const spy = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onChange={spy} />,
    );
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: 'Apple',
        nodeName: 'INPUT',
      }),
    }));
  });

  it('triggers when a value is removed', async () => {
    const spy = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} value="Apple" onChange={spy} />,
    );
    getByRole('combobox').focus();
    userEvent.click(document.getElementById(`${getByRole('combobox').id}_clear_button`));

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: '',
        nodeName: 'INPUT',
      }),
    }));
  });
});

describe('onBlur', () => {
  it('is called when the input is blurred', async () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <>
        <ComboBoxWrapper options={['foo']} onBlur={spy} />
        <input />
      </>
    ));
    await act(async () => {
      getByRole('combobox').focus();
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
    const { getByRole } = render((
      <>
        <ComboBoxWrapper options={['foo']} onFocus={spy} />
        <input type="text" />
      </>
    ));
    getByRole('combobox').focus();
    expect(spy).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    await act(async () => {
      userEvent.tab();
    });
    await waitFor(() => {
      expect(getByRole('textbox')).toHaveFocus();
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('aria-describedby', () => {
  it('is appended to the input', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} aria-describedby="foo" />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveAttribute('aria-describedby', 'id_found_description foo');
  });

  it('is appended to the input when not found is showing', async () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={[]} aria-describedby="foo" />
    ));
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'foo');
    expect(getByRole('combobox')).toHaveAttribute('aria-describedby', 'id_not_found id_found_description foo');
  });
});

it.each(['disabled', 'readOnly', 'required'])('%i is added to input', (name) => {
  const props = { [name]: true };
  const { getByRole } = render((
    <ComboBoxWrapper options={['foo']} {...props} />
  ));
  expect(getByRole('combobox')).toHaveAttribute(name);
});

it.each([
  'autoComplete', 'autoCapitalize', 'autoCorrect', 'inputMode',
  'maxLength', 'minLength', 'pattern', 'placeholder',
  'spellCheck',
])('%i is added to input', (name) => {
  const props = { [name]: 'foo' };
  const { getByRole } = render((
    <ComboBoxWrapper options={['foo']} {...props} />
  ));
  expect(getByRole('combobox')).toHaveAttribute(name, 'foo');
});

describe('autoFocus', () => {
  it('focuses the input', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} autoFocus />
    ));
    // React polyfills autofocus behaviour rather than adding the attribute
    expectToBeOpen(getByRole('combobox'));
  });
});

describe('size', () => {
  it('is added to the input', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} size={2} />
    ));
    expect(getByRole('combobox')).toHaveAttribute('size', '2');
  });
});

describe('ref', () => {
  it('references the input for an object ref', () => {
    const ref = { current: null };
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} ref={ref} />
    ));
    expect(ref.current).toEqual(getByRole('combobox'));
  });

  it('references the input for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} ref={ref} />
    ));
    expect(value).toEqual(getByRole('combobox'));
  });
});

describe('WrapperComponent', () => {
  it('allows the wrapper to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper options={['foo']} WrapperComponent="dl" />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toEqual('DL');
  });

  it('allows access to the context', () => {
    const spy = jest.fn();

    const WrapperComponent = forwardRef((props, ref) => {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} ref={ref} />
      );
    });

    render(
      <ComboBoxWrapper foo="bar" options={['foo']} WrapperComponent={WrapperComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      'aria-autocomplete': 'none',
      'aria-busy': false,
      expanded: false,
      notFound: false,
      currentOption: null,
      search: null,
      suggestedOption: null,
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
    });
  });

  it('allows custom layouts', () => {
    const WrapperComponent = forwardRef((props, ref) => {
      const {
        children: [beforeInput, input, openButton, clearButton, listBox, hint, notFound],
      } = props;

      return (
        <div {...props} ref={ref}>
          <div className="input-wrapper">
            {input}
          </div>
          <div className="before-input">
            {beforeInput}
          </div>
          <div className="open-button-wrapper">
            {openButton}
          </div>
          <div className="clear-button-wrapper">
            {clearButton}
          </div>
          <div className="listbox-wrapper">
            {listBox}
          </div>
          <div className="listbox-hint">
            {hint}
          </div>
          <div className="not-found-wrapper">
            {notFound}
          </div>
        </div>
      );
    });

    const { container } = render(
      <ComboBoxWrapper options={['foo']} WrapperComponent={WrapperComponent} />,
    );

    expect(container).toMatchSnapshot();
  });
});

describe('wrapperProps', () => {
  it('allows custom props to be added to the wrapper', () => {
    const { container } = render(
      <ComboBoxWrapper options={['foo']} wrapperProps={{ className: 'foo' }} />,
    );
    expect(container.firstChild).toHaveClass('foo');
  });
});

describe('BeforeInputComponent', () => {
  it('allows the input to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} BeforeInputComponent="dl" />,
    );
    expect(getByRole('combobox').previousSibling.tagName).toEqual('DL');
  });
});

describe('InputComponent', () => {
  it('allows the input to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} InputComponent="dl" />,
    );
    expect(getByRole('combobox').tagName).toEqual('DL');
  });
});

describe('inputProps', () => {
  it('allows custom props to be added to the wrapper', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} inputProps={{ className: 'foo' }} />,
    );
    expect(getByRole('combobox')).toHaveClass('foo');
  });
});

describe('ListBoxComponent', () => {
  it('allows the listbox to be replaced', () => {
    const ListBox = forwardRef((props, ref) => <dl ref={ref} />);
    const { queryByRole } = render(
      <ComboBoxWrapper options={['foo']} ListBoxComponent={ListBox} />,
    );
    expect(queryByRole('listbox', { hidden: true })).toBeNull();
    expect(document.querySelector('dl')).toBeInstanceOf(Element);
  });
});

describe('listBoxProps', () => {
  it('allows custom props to be added to the listbox', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} listBoxProps={{ className: 'bar' }} />,
    );
    expect(getByRole('listbox', { hidden: true })).toHaveClass('bar');
  });
});

describe('ListBoxListComponent', () => {
  it('allows the listbox to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} ListBoxListComponent="dl" />,
    );
    expect(getByRole('listbox', { hidden: true }).tagName).toEqual('DL');
  });
});

describe('listBoxListProps', () => {
  it('allows custom props to be added to the listbox', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} listBoxListProps={{ className: 'foo' }} />,
    );
    expect(getByRole('listbox', { hidden: true })).toHaveClass('foo');
  });
});

describe('GroupComponent', () => {
  it('allows the group wrapper to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} GroupComponent="dl" />,
    );
    expect(container.querySelector('dl').firstChild).toBeInstanceOf(Element);
  });

  it('allows access to the context with group properties', () => {
    const spy = jest.fn();

    function GroupComponent(props) {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    }

    render(
      <ComboBoxWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} GroupComponent={GroupComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      'aria-autocomplete': 'none',
      'aria-busy': false,
      expanded: false,
      notFound: false,
      currentOption: null,
      search: null,
      suggestedOption: null,
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
      group: expect.objectContaining({
        label: 'bar',
        options: expect.any(Array),
      }),
    });
  });
});

describe('groupProps', () => {
  it('allows custom props', () => {
    const { container } = render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        GroupComponent="dl"
        groupProps={{ className: 'foo' }}
      />,
    );
    expect(container.querySelector('dl')).toHaveClass('foo');
  });
});

describe('GroupLabelComponent', () => {
  it('allows the group to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} GroupLabelComponent="dl" />,
    );
    expect(container.querySelector('dl')).toHaveTextContent('bar');
  });
});

describe('groupLabelProps', () => {
  it('allows custom props', () => {
    const { container } = render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        GroupLabelComponent="dl"
        groupLabelProps={{ className: 'foo' }}
      />,
    );
    expect(container.querySelector('dl')).toHaveClass('foo');
  });
});

describe('OptionComponent', () => {
  it('allows the option to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} OptionComponent="dl" />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').tagName).toEqual('DL');
  });

  it('allows access to the context with option and group properties', () => {
    const spy = jest.fn();

    const OptionComponent = forwardRef((props, _) => {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    });

    render(
      <ComboBoxWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} OptionComponent={OptionComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      'aria-autocomplete': 'none',
      'aria-busy': false,
      expanded: false,
      notFound: false,
      currentOption: null,
      search: null,
      suggestedOption: null,
      selected: false,
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
      group: expect.objectContaining({
        label: 'bar',
        options: expect.any(Array),
      }),
      option: expect.objectContaining({
        label: 'foo',
        group: expect.objectContaining({
          label: 'bar',
        }),
      }),
    });
  });
});

describe('optionProps', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        optionProps={{ className: 'foo' }}
      />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option')).toHaveClass('foo');
  });
});

describe('ValueComponent', () => {
  it('allows the component to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} ValueComponent="dl" />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
  });
});

describe('valueProps', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <ComboBoxWrapper
        options={['foo']}
        valueProps={{ 'data-foo': 'bar' }}
        ValueComponent="div"
      />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });
});

describe('OpenButtonComponent', () => {
  it('allows the component to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} OpenButtonComponent="dl" />,
    );
    const button = document.getElementById('id_open_button');
    expect(button.tagName).toEqual('DL');
  });
});

describe('openButtonProps', () => {
  it('allows custom props', () => {
    render(
      <ComboBoxWrapper options={['foo']} openButtonProps={{ className: 'foo' }} />,
    );
    const button = document.getElementById('id_open_button');
    expect(button).toHaveClass('foo');
  });
});

describe('ClearButtonComponent', () => {
  it('allows the component to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} ClearButtonComponent="dl" />,
    );
    const button = document.getElementById('id_clear_button');
    expect(button.tagName).toEqual('DL');
  });
});

describe('clearButtonProps', () => {
  it('allows custom props', () => {
    render(
      <ComboBoxWrapper options={['foo']} clearButtonProps={{ className: 'foo' }} />,
    );
    const button = document.getElementById('id_clear_button');
    expect(button).toHaveClass('foo');
  });
});

describe('FoundDescriptionComponent', () => {
  it('allows the component to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} FoundDescriptionComponent="dl" />,
    );
    const el = document.getElementById('id_found_description');
    expect(el.tagName).toEqual('DL');
  });
});

describe('NotFoundComponent', () => {
  it('allows the component to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} NotFoundComponent="dl" />,
    );
    const el = document.getElementById('id_not_found');
    expect(el.tagName).toEqual('DL');
  });
});

describe('notFoundProps', () => {
  it('allows custom props', () => {
    render(
      <ComboBoxWrapper options={['foo']} notFoundProps={{ className: 'foo' }} />,
    );
    const el = document.getElementById('id_not_found');
    expect(el).toHaveClass('foo');
  });
});

describe('visuallyHiddenClassName', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        visuallyHiddenClassName="bar"
      />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').firstChild).toHaveClass('bar');
  });
});

describe('onLayoutListBox', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is not called when the component is rendered', () => {
    const onLayoutListBox = jest.fn();
    render(
      <ComboBoxWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    expect(onLayoutListBox).not.toHaveBeenCalled();
  });

  it('is called when the listbox is displayed', () => {
    const onLayoutListBox = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    getByRole('combobox').focus();
    expect(onLayoutListBox).toHaveBeenCalledWith({
      expanded: true,
      listbox: getByRole('listbox'),
      combobox: getByRole('combobox'),
      option: undefined,
    });
  });

  it('is called when the listbox options change', () => {
    const propUpdater = new PropUpdater();
    const onLayoutListBox = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
        propUpdater={propUpdater}
      />
    ));
    getByRole('combobox').focus();
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: true,
      listbox: getByRole('listbox'),
      combobox: getByRole('combobox'),
      option: undefined,
    });
  });

  it('is called when the selected option changes', () => {
    const onLayoutListBox = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: true,
      listbox: getByRole('listbox'),
      combobox: getByRole('combobox'),
      option: document.activeElement,
    });
  });

  it('when the listbox is closed', () => {
    const onLayoutListBox = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: false,
      listbox: getByRole('listbox', { hidden: true }),
      combobox: getByRole('combobox'),
      option: undefined,
    });
  });

  it('is not called while the listbox is closed', () => {
    const propUpdater = new PropUpdater();
    const onLayoutListBox = jest.fn();
    render((
      <ComboBoxWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
        propUpdater={propUpdater}
      />
    ));
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(onLayoutListBox).not.toHaveBeenCalled();
  });
});

describe('other props', () => {
  it('are discarded', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} foo="bar" />
    ));
    expect(getByRole('combobox')).not.toHaveAttribute('foo');
  });
});
