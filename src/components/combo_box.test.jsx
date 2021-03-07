import React, { useState, forwardRef } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBox } from './combo_box';

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

function expectToHaveActiveOption(combobox, option) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
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

          it('calls onFocusOption', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <ComboBoxWrapper options={options} onFocusOption={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expect(spy).toHaveBeenCalledWith({ option: getByRole('option', { name: 'Apple' }), listbox: getByRole('listbox') });
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

          it('calls onFocusOption', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <ComboBoxWrapper options={options} onFocusOption={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(spy).toHaveBeenCalledWith({ option: getByRole('option', { name: 'Orange' }), listbox: getByRole('listbox') });
          });
        });

        describe('pressing the home key', () => {
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

        describe('pressing the end key', () => {
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

        describe('pressing the page up key', () => {
          it('moves the page of options up', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Apple' }));
          });
        });

        describe('pressing the page down key', () => {
          it('moves the page of options down', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'PageDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Orange' }));
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

        describe('pressing Ctrl+k', () => {
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

        describe('pressing page down', () => {
          it('does not open the listbox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'PageDown' });
            expectToBeClosed(getByRole('combobox'));
          });
        });

        describe('pressing page up', () => {
          it('does not open the listbox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
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
        expect(getByRole('option')).toHaveClass('class');
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

  it('calls onFocusOption', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const spy = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper options={options} value="Banana" onFocusOption={spy} />
    ));
    getByRole('combobox').focus();
    expect(spy).toHaveBeenCalledWith({ option: getByRole('option', { name: 'Banana' }), listbox: getByRole('listbox') });
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

describe('clear button', () => {
  const options = ['Apple', 'Orange', 'Banana'];

  it('is not present without a value', () => {
    render(<ComboBoxWrapper options={options} />);
    const remove = document.getElementById('id_clear_button');
    expect(remove).not.toBeVisible();
  });

  it('pressing the button removes the value', () => {
    const spy = jest.fn();
    const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    userEvent.click(remove);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing the middle button does not remove the value', () => {
    const spy = jest.fn();
    const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    fireEvent.click(remove, { button: 1 });
    expect(spy).not.toHaveBeenCalled();
  });

  it('pressing ENTER on the button clears the value', () => {
    const spy = jest.fn();
    const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    fireEvent.keyDown(remove, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing SPACE on the button clears the value', () => {
    const spy = jest.fn();
    const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = getByRole('button', { name: 'Clear Apple' });
    expect(remove).toBeVisible();
    fireEvent.keyDown(remove, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('pressing a different key does not clear the value', () => {
    const spy = jest.fn();
    const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
    const remove = getByRole('button', { name: 'Clear Apple' });
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

describe('onFocusOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when an option is selected', () => {
    const spy = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onFocusOption={spy} />,
    );
    const comboBox = getByRole('combobox');
    comboBox.focus();
    fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
    expect(spy).toHaveBeenCalledWith({ option: getByRole('option', { name: 'Apple' }), listbox: getByRole('listbox') });
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

      describe('ctrl+k', () => {
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

describe('tabBetweenOptions', () => {
  const options = ['Apple', 'Banana'];

  describe('without managedFocus', () => {
    it('pressing tab moves to the next option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveActiveOption(getByRole('combobox'), getByRole('option', { name: 'Apple' }));

      userEvent.tab();
      expectToHaveActiveOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });

    it('pressing tab on the last option moves out of the listbox without selecting an option', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions onValue={spy} />
      ));
      getByRole('combobox').focus();

      userEvent.tab();
      userEvent.tab();
      userEvent.tab();

      await waitFor(() => {
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(getByRole('combobox')).not.toHaveValue();
      expect(spy).not.toHaveBeenCalled();
      expect(document.body).toHaveFocus();
    });

    it('pressing down arrow and tab moves between options', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab();
      expectToHaveActiveOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab moves to the previous option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expectToHaveActiveOption(getByRole('combobox'), getByRole('option', { name: 'Apple' }));
    });

    it('pressing shift tab on the first option focuses the input', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expect(getByRole('combobox')).toHaveFocus();
    });

    it('pressing tab with focus on the input and a selected option moves to the next option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus={false} value="Apple" tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveActiveOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab on the input moves focus up the page', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus={false} tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      userEvent.tab({ shift: true });

      await waitFor(() => {
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(document.body).toHaveFocus();
    });
  });

  describe('with managedFocus', () => {
    it('pressing tab moves to the next option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Apple' }));

      userEvent.tab();
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });

    it('pressing tab on the last option moves out of the listbox without selecting an option', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions onValue={spy} />
      ));
      getByRole('combobox').focus();

      userEvent.tab();
      userEvent.tab();
      userEvent.tab();

      await waitFor(() => {
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(getByRole('combobox')).not.toHaveValue();
      expect(spy).not.toHaveBeenCalled();
      expect(document.body).toHaveFocus();
    });

    it('pressing down arrow and tab moves between options', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab();
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab moves to the previous option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Apple' }));
    });

    it('pressing shift tab on the first option focuses the input', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });

      userEvent.tab({ shift: true });
      expect(getByRole('combobox')).toHaveFocus();
    });

    it('pressing tab with focus on the input and a selected option moves to the next option', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus value="Apple" tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      userEvent.tab();
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Banana' }));
    });

    it('pressing shift tab on the input moves focus up the page', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} managedFocus tabBetweenOptions />
      ));
      getByRole('combobox').focus();

      userEvent.tab({ shift: true });

      await waitFor(() => {
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });
      expect(document.body).toHaveFocus();
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
      userEvent.click(getByRole('button', { name: /Clear/ }));
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
      userEvent.click(getByRole('button', { name: /Clear/ }));
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
      const combobox = getByRole('combobox');
      combobox.focus();
      userEvent.click(getByRole('button', { name: /Clear/ }));
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
      const { getByRole } = render((
        <>
          <ComboBoxWrapper options={options} onValue={spy} selectOnBlur />
          <input />
        </>
      ));
      getByRole('combobox').focus();
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
      const { getByRole, queryByRole } = render((
        <>
          <ComboBoxWrapper options={options} onValue={spy} selectOnBlur={false} />
          <input id="other" />
        </>
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      userEvent.tab();
      expect(document.getElementById('other')).toHaveFocus();
      await waitFor(() => {
        expect(queryByRole('listbox')).toBeFalsy();
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
      expect(getByRole('combobox')).toHaveDescription('No matches found');
    });

    it('does not display a not found if busy', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} busy />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if options are null', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={null} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if options are undefined', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={undefined} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if there is no search', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      expect(getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if the list box is closed', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
      expect(getByRole('combobox')).not.toHaveDescription('No matches found');
    });

    it('does not display a not found if the search term matches the current option', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} value="foo" />
      ));
      getByRole('combobox').focus();
      expect(getByRole('combobox')).not.toHaveDescription('No matches found');
    });
  });

  describe('with custom message', () => {
    it('displays custom not found if search returns no results', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} notFoundMessage={<b>custom message</b>} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(getByRole('combobox')).toHaveDescription('custom message');
    });
  });

  describe('when null', () => {
    it('does not display a not found message when no results are found', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} notFoundMessage={null} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expect(document.getElementById('id_error_message')).toBeFalsy();
    });
  });
});

describe('errorMessage', () => {
  it('displays the error message if supplied', async () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['Foo']} errorMessage="Error" />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveDescription('Error');
    expectToBeClosed(getByRole('combobox'));
  });
});

describe('hint', () => {
  it('is empty with no results', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={[]} />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveDescription('');
  });

  it('is empty if list box is not showing', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} value="foo" />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveDescription('');
  });

  it('lists the number of options', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo', 'bar']} />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveDescription('2 options found');
  });

  it('lists one option', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveDescription('1 option found');
  });

  describe('foundOptionsMessage', () => {
    it('customises the found options message', () => {
      const spy = jest.fn((options) => `found ${options.length} options`);
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'bar']} foundOptionsMessage={spy} />
      ));
      getByRole('combobox').focus();
      expect(getByRole('combobox')).toHaveDescription('found 2 options');
    });
  });
});

describe('screen reader message', () => {
  const options = ['foo'];

  it('adds a debounced message', async () => {
    jest.useFakeTimers();
    const propUpdater = new PropUpdater();
    const { container, getByRole } = render(<ComboBoxWrapper
      options={options}
      propUpdater={propUpdater}
    />);

    getByRole('combobox').focus();

    expect(container.querySelector('[aria-live="polite"]')).not.toHaveTextContent();
    act(() => jest.advanceTimersByTime(500));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('1 option found');

    propUpdater.update((props) => ({ ...props, options: ['foo', 'bar'] }));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('1 option found');
    act(() => jest.advanceTimersByTime(500));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('2 options found');

    propUpdater.update((props) => ({ ...props, options: [] }));
    await userEvent.type(document.activeElement, 'a');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('2 options found');
    act(() => jest.advanceTimersByTime(500));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('No matches found');
  });

  it('does not update the message if not focused', () => {
    jest.useFakeTimers();
    const propUpdater = new PropUpdater();
    const { container } = render(<ComboBoxWrapper
      options={options}
      propUpdater={propUpdater}
    />);

    expect(container.querySelector('[aria-live="polite"]')).not.toHaveTextContent();
    act(() => jest.advanceTimersByTime(500));
    expect(container.querySelector('[aria-live="polite"]')).not.toHaveTextContent();
  });

  describe('foundOptionsMessage', () => {
    it('customises the found options message', async () => {
      jest.useFakeTimers();
      const spy = jest.fn((ops) => `found ${ops.length} options`);
      const { container, getByRole } = render((
        <ComboBoxWrapper options={['foo', 'bar']} foundOptionsMessage={spy} />
      ));
      getByRole('combobox').focus();
      act(() => jest.advanceTimersByTime(500));
      expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('found 2 options');
    });
  });

  describe('notFoundMessage', () => {
    it('customises the not found message', async () => {
      jest.useFakeTimers();
      const { container, getByRole } = render((
        <ComboBoxWrapper options={[]} notFoundMessage="not found" />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'a');
      act(() => jest.advanceTimersByTime(500));
      expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('not found');
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
    const { container, getByRole } = render(
      <ComboBoxWrapper options={options} classPrefix={null} />,
    );
    getByRole('combobox').focus();
    expect(container.querySelector('div')).not.toHaveClass();
    expect(getByRole('combobox')).not.toHaveClass();
    expect(getByRole('listbox')).not.toHaveClass();
    expect(getByRole('option')).not.toHaveClass();
    expect(getByRole('option').previousSibling).not.toHaveClass();

    expect(document.getElementById('id_down_arrow')).not.toHaveClass();
    expect(document.getElementById('id_clear_button')).not.toHaveClass();
    expect(document.getElementById('id_not_found')).not.toHaveClass();
  });

  it('prefixes all classes', () => {
    const { container, getByRole } = render(
      <ComboBoxWrapper options={options} classPrefix="foo" />,
    );
    getByRole('combobox').focus();
    expect(container.querySelector('div')).toHaveClass('foo');
    expect(getByRole('combobox')).toHaveClass('foo__input');
    expect(getByRole('listbox')).toHaveClass('foo__listbox');
    expect(getByRole('option')).toHaveClass('foo__option');
    expect(getByRole('option').previousSibling).toHaveClass('foo__group-label');

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
    expect(getByRole('combobox')).toHaveAttribute('aria-describedby', 'id_aria_description foo');
  });

  it('is appended to the input when not found is showing', async () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={[]} aria-describedby="foo" />
    ));
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'foo');
    expect(getByRole('combobox')).toHaveAttribute('aria-describedby', 'id_not_found id_aria_description foo');
  });
});

describe('boolean attributes', () => {
  it.each(['disabled', 'readOnly', 'required'])('%s is added to input', (name) => {
    const props = { [name]: true };
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} {...props} />
    ));
    expect(getByRole('combobox')).toHaveAttribute(name);
  });
});

describe('string attributes', () => {
  it.each([
    'autoComplete', 'autoCapitalize', 'autoCorrect', 'inputMode',
    'pattern', 'placeholder', 'spellCheck',
  ])('%s is added to input', (name) => {
    const props = { [name]: 'foo' };
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} {...props} />
    ));
    expect(getByRole('combobox')).toHaveAttribute(name, 'foo');
  });
});

describe('number attributes', () => {
  it.each(['size', 'maxLength', 'minLength'])('%s is added to input', (name) => {
    const props = { [name]: 2 };
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} {...props} />
    ));
    expect(getByRole('combobox')).toHaveAttribute(name, '2');
  });
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
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderInput', () => {
  it('allows the input to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} renderInput={(props) => <textarea data-foo="bar" {...props} />} />,
    );
    expect(getByRole('combobox').tagName).toEqual('TEXTAREA');
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
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
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderListBox', () => {
  it('allows the list box to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} renderListBox={(props) => <dl data-foo="bar" {...props} />} />,
    );
    getByRole('combobox').focus();
    expect(getByRole('listbox').tagName).toEqual('DL');
    expect(getByRole('listbox')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} renderListBox={spy} test="foo" />
    ));
    getByRole('combobox').focus();
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
  it('allows the group to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroup={(props) => <dl data-foo="bar" {...props} />} />,
    );
    getByRole('combobox').focus();
    const group = getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroup={spy} test="foo" />
    ));
    getByRole('combobox').focus();

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
  it('allows the group label to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupLabel={(props) => <dl data-foo="bar" {...props} />} />,
    );
    getByRole('combobox').focus();

    const group = getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupLabel={spy} test="foo" />
    ));
    getByRole('combobox').focus();

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

describe('renderOption', () => {
  it('allows the option to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} renderOption={(props) => <dl data-foo="bar" {...props} />} />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').tagName).toEqual('DL');
    expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} renderOption={spy} test="foo" />
    ));
    getByRole('combobox').focus();
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
  it('allows the group accessible label to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupAccessibleLabel={(props) => <dl data-foo="bar" {...props} />} />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
    expect(getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupAccessibleLabel={spy} test="foo" />
    ));
    getByRole('combobox').focus();
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
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderValue', () => {
  it('allows the value to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} renderValue={(props) => <dl data-foo="bar" {...props} />} />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
    expect(getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} renderValue={spy} test="foo" />
    ));
    getByRole('combobox').focus();
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
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderClearButton', () => {
  it('allows the clear button to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} value="foo" renderClearButton={(props) => <dl data-foo="bar" {...props} />} />,
    );
    const button = getByRole('button', { name: 'Clear foo' });
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
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
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

describe('onDisplayOptions', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when the component is rendered', () => {
    const onDisplayOptions = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onDisplayOptions={onDisplayOptions} />,
    );
    expect(onDisplayOptions).toHaveBeenCalledWith({
      expanded: false,
      listbox: getByRole('listbox', { hidden: true }),
    });
  });

  it('is called when the listbox is displayed', () => {
    const onDisplayOptions = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onDisplayOptions={onDisplayOptions} />,
    );
    getByRole('combobox').focus();
    expect(onDisplayOptions).toHaveBeenCalledWith({
      expanded: true,
      listbox: getByRole('listbox'),
    });
  });

  it('is called when the listbox options change', () => {
    const propUpdater = new PropUpdater();
    const onDisplayOptions = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        onDisplayOptions={onDisplayOptions}
        propUpdater={propUpdater}
      />
    ));
    getByRole('combobox').focus();
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(onDisplayOptions).toHaveBeenLastCalledWith({
      expanded: true,
      listbox: getByRole('listbox'),
    });
  });

  it('when the listbox is closed', () => {
    const onDisplayOptions = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        onDisplayOptions={onDisplayOptions}
      />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(onDisplayOptions).toHaveBeenLastCalledWith({
      expanded: false,
      listbox: getByRole('listbox', { hidden: true }),
    });
  });

  it('is called while the listbox is closed', () => {
    const propUpdater = new PropUpdater();
    const onDisplayOptions = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        onDisplayOptions={onDisplayOptions}
        propUpdater={propUpdater}
      />
    ));
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(onDisplayOptions).toHaveBeenCalledWith({
      expanded: false,
      listbox: getByRole('listbox', { hidden: true }),
    });
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
