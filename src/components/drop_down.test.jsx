import React, { useState, forwardRef } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropDown } from './drop_down';

class PropUpdater {
  setUpdater(fn) {
    this.setter = fn;
  }

  update(value) {
    act(() => this.setter(value));
  }
}

const DropDownWrapper = forwardRef(({ value: initialValue, propUpdater, ...props }, ref) => {
  const [value, onValue] = useState(initialValue);
  const [newProps, setProps] = useState(props);
  if (propUpdater) {
    propUpdater.setUpdater(setProps);
  }
  return (
    <DropDown
      id="id"
      aria-labelledby="id-label"
      value={value}
      onValue={onValue}
      {...newProps}
      ref={ref}
    />
  );
});

function expectToBeClosed(combobox) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).not.toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'false');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
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
}

afterEach(async () => {
  // Fix act warning due to the focus event triggering after a timeout
  await waitFor(() => {});
});

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders a closed drop down', () => {
        const { container, getByRole } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expectToBeClosed(getByRole('combobox'));
      });

      it('renders a drop down with a selected value', () => {
        const { getByRole } = render(<DropDownWrapper options={options} value="Orange" />);
        expect(getByRole('combobox')).toHaveTextContent('Orange');
      });

      describe('expanding the list box', () => {
        describe('with no value', () => {
          describe('by clicking', () => {
            it('opens the drop down with the first option selected', () => {
              const { getAllByRole, getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });

            it('does not open the drop down with a right mouse click', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'), { button: 1 });
              expectToBeClosed(getByRole('combobox'));
            });
          });

          describe('pressing enter', () => {
            it('opens drop down', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });

          describe('pressing space', () => {
            it('opens the drop down', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: ' ' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });

          describe('pressing down arrow', () => {
            it('opens the drop down with the down arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });

            it('opens the drop down with the down arrow + alt', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown', altKey: true });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });

            it('scrolls the element into view', () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <DropDownWrapper options={options} scrollIntoView={spy} />
              ));
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
              expect(spy).toHaveBeenCalledWith(getByRole('option', { name: 'Apple' }));
            });
          });

          describe('pressing up arrow', () => {
            it('opens the drop down with the up arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });

            it('does not open the drop down with the up arrow + alt', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp', altKey: true });
              expectToBeClosed(getByRole('combobox'));
            });

            it('scrolls the element into view', () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <DropDownWrapper options={options} scrollIntoView={spy} />
              ));
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp' });
              expect(spy).toHaveBeenCalledWith(getByRole('option', { name: 'Apple' }));
            });
          });
        });

        describe('with a value', () => {
          describe('by clicking', () => {
            it('opens the drop down with the value selected', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.click(getByRole('combobox'));
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });
          });

          describe('pressing enter', () => {
            it('opens drop down with the value selected', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });
          });

          describe('pressing space', () => {
            it('opens the drop down', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: ' ' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });
          });

          describe('pressing down arrow', () => {
            it('opens the drop down with the down arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });

            it('opens the drop down with the down arrow + alt', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown', altKey: true });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });
          });

          describe('pressing up arrow', () => {
            it('opens the drop down with the up arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });
          });
        });
      });

      describe('navigating options in an open listbox', () => {
        describe('pressing the down arrow', () => {
          it('moves to the next option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves to the first option from the last option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing with the alt key pressed', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('scrolls the element into view', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} scrollIntoView={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expect(spy).toHaveBeenCalledWith(getByRole('option', { name: 'Banana' }));
          });
        });

        describe('pressing the up arrow', () => {
          it('moves to the previous option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves to the last option from the first option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('scrolls the element into view', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} scrollIntoView={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(spy).toHaveBeenCalledWith(getByRole('option', { name: 'Orange' }));
          });
        });

        describe('pressing the home key', () => {
          it('moves to the first option with the home key', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'Home' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the end key', () => {
          it('moves to the last option with the end key', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'End' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the page up key', () => {
          it('moves the page of options down', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Apple' }));
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the page down key', () => {
          it('moves the page of options down', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'PageDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getByRole('option', { name: 'Orange' }));
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('typing', () => {
          it('moves the option when typing without calling onValue', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves the option when typing case-insensitively', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'B' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('does not move the option if there is no match', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'z' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('does not move the option if pressing space', () => {
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper
                options={options}
                value="Banana"
                placeholderOption="Please choose"
              />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: ' ' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
          });

          it('moves the option when typing multiple letters', () => {
            const similarOptions = [{ label: 'Banana' }, { label: 'Blackberry' }];
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={similarOptions} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'l' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('moves the option if including a space', () => {
            const similarOptions = [{ label: 'a b' }, { label: 'a c' }];
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={similarOptions} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'a' });
            fireEvent.keyDown(document.activeElement, { key: ' ' });
            fireEvent.keyDown(document.activeElement, { key: 'c' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('resets typing after a short delay', () => {
            jest.useFakeTimers();
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            act(() => jest.advanceTimersByTime(1000));
            fireEvent.keyDown(document.activeElement, { key: 'o' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
          });

          it('does nothing if the meta key is pressed', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b', metaKey: true });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });

          it('does nothing if the control key is pressed', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b', ctrlKey: true });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });

          it('does nothing if the alt key is pressed', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b', altKey: true });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });

      describe('selecting an option', () => {
        describe('when clicking on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.click(getAllByRole('option')[1]);
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.click(getAllByRole('option')[1]);
            expectToBeClosed(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.click(getAllByRole('option')[1]);
            expect(getByRole('combobox')).toHaveTextContent('Banana');
          });

          it('does nothing if a different mouse button is pressed', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.click(getAllByRole('option')[1], { button: 1 });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('when pressing enter on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when pressing escape on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            expectToBeClosed(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            expect(getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when pressing tab on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab' });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab' });
            expectToBeClosed(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab' });
            expect(getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when pressing shift + tab on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
            expectToBeClosed(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
            expect(getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when pressing ArrowUp + alt on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expectToBeClosed(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveFocus();
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expect(getByRole('combobox')).toHaveTextContent('Banana');
          });
        });

        describe('when blurring the listbox', () => {
          it('calls onValue', async () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <>
                <DropDownWrapper options={options} onValue={spy} />
                <input />
              </>
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });
          });

          it('updates the displayed value', async () => {
            const { getByRole } = render((
              <>
                <DropDownWrapper options={options} />
                <input />
              </>
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expect(getByRole('combobox')).toHaveTextContent('Banana');
            });
          });
        });
      });

      describe('within a closed listbox', () => {
        describe('typing', () => {
          it('selects the option when typing', async () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('selects the option when typing case-insensitively', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'B' });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('does not select the option if there is no match', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'z' });
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves the option when typing multiple letters', () => {
            const spy = jest.fn();
            const similarOptions = [{ label: 'Banana' }, { label: 'Blackberry' }];
            const { getByRole } = render((
              <DropDownWrapper options={similarOptions} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'l' });
            expect(spy).toHaveBeenCalledWith({ label: 'Blackberry' });
          });

          it('resets typing after a short delay', () => {
            const spy = jest.fn();
            jest.useFakeTimers();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            act(() => jest.advanceTimersByTime(1000));
            fireEvent.keyDown(document.activeElement, { key: 'l' });
            expect(spy).not.toHaveBeenCalledWith({ label: 'Blackberry' });
          });

          it('does nothing if the metaKey is pressed', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b', metaKey: true });
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing if the ctrlKey is pressed', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b', ctrlKey: true });
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing if the altKey is pressed', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b', altKey: true });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing enter', () => {
          it('does not select an item', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} value="xxx" onValue={spy} />);
            fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing escape', () => {
          it('does not select an item', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} value="xxx" onValue={spy} />);
            fireEvent.keyDown(getByRole('combobox'), { key: 'Escape' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing tab', () => {
          it('does not select an item', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} value="xxx" onValue={spy} />);
            fireEvent.keyDown(getByRole('combobox'), { key: 'Tab' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing home', () => {
          it('does not select an item', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} value="Orange" onValue={spy} />);
            fireEvent.keyDown(getByRole('combobox'), { key: 'Home' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing end', () => {
          it('does not select an item', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            fireEvent.keyDown(getByRole('combobox'), { key: 'End' });
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });

      describe('closing an open listbox', () => {
        it('closes the listbox', () => {
          const { getByRole, getAllByRole } = render((
            <DropDownWrapper options={['foo', 'bar']} />
          ));
          fireEvent.click(getByRole('combobox'));
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          fireEvent.click(getByRole('combobox'));
          expectToBeClosed(getByRole('combobox'));
        });

        it('does not select a value', async () => {
          const spy = jest.fn();
          const { getByRole, getAllByRole } = render((
            <>
              <DropDownWrapper options={['foo', 'bar']} onValue={spy} />
              <input />
            </>
          ));
          fireEvent.click(getByRole('combobox'));
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
          fireEvent.click(getByRole('combobox'));
          expect(spy).not.toHaveBeenCalled();
          userEvent.tab();
          await waitFor(() => {
            expectToBeClosed(getByRole('combobox'));
          });
          expect(spy).not.toHaveBeenCalled();
        });

        it('cancels mousedown', () => {
          const spy = jest.fn();
          document.addEventListener('mousedown', spy);
          const { getByRole } = render((
            <DropDownWrapper options={['foo', 'bar']} />
          ));
          fireEvent.mouseDown(getByRole('combobox'));
          expect(spy.mock.calls[0][0].defaultPrevented).toEqual(true);
          document.removeEventListener('mousedown', spy);
        });
      });
    });

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', () => {
        const { container, getByRole, getAllByRole } = render((
          <DropDownWrapper options={options} />
        ));
        fireEvent.click(getByRole('combobox'));
        expect(container).toMatchSnapshot();
        expect(getAllByRole('option')[1]).toHaveAttribute('aria-disabled', 'true');
      });

      it('selects a disabled option with the arrow keys', () => {
        const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
      });

      it('does not select a disabled option by typing', () => {
        const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'b' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
      });

      describe('first option is disabled', () => {
        const disabledFirstOptions = [{ label: 'Apple', disabled: true }, 'Banana'];

        it('defaults selection to the first non-disabled option', () => {
          const { getByRole, getAllByRole } = render((
            <DropDownWrapper options={disabledFirstOptions} />
          ));
          fireEvent.click(getByRole('combobox'));
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('only disabled options', () => {
        const onlyDisabledOptions = [
          { label: 'Apple', disabled: true },
          { label: 'Banana', disabled: true },
        ];

        it('does not select any option option', () => {
          const { getByRole } = render((
            <DropDownWrapper options={onlyDisabledOptions} />
          ));
          fireEvent.click(getByRole('combobox'));
          expect(getByRole('combobox')).toHaveFocus();
          expect(getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
        });

        it('allows options to be focused', () => {
          const { getByRole, getAllByRole } = render((
            <DropDownWrapper options={onlyDisabledOptions} />
          ));
          fireEvent.click(getByRole('combobox'));
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
        });
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.click(getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });
        });

        describe('when pressing escape on an option', () => {
          it('closes the listbox but does not select the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed(getByRole('combobox'));
          });
        });

        describe('when pressing tab on an option', () => {
          it('closes the listbox but does not select the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab' });
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed(getByRole('combobox'));
          });
        });

        describe('when pressing shift + tab on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed(getByRole('combobox'));
          });
        });

        describe('when pressing arrow up + alt on an option', () => {
          it('closes the listbox without selecting the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expect(spy).not.toHaveBeenCalled();
            expectToBeClosed(getByRole('combobox'));
            expect(getByRole('combobox')).toHaveFocus();
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <>
                <DropDownWrapper options={options} onValue={spy} />
                <input type="text" />
              </>
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
            await waitFor(() => {
              expectToBeClosed(getByRole('combobox'));
            });
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        const { getByRole, getAllByRole } = render(
          <DropDownWrapper options={options} value={2} onValue={spy} />,
        );
        fireEvent.click(getByRole('combobox'));
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
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
          <DropDownWrapper options={options} value={2} onValue={spy} />,
        );
        fireEvent.click(getByRole('combobox'));
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('html', () => {
      it('sets attributes on the option', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        const { getByRole } = render(
          <DropDownWrapper options={options} />,
        );
        fireEvent.click(getByRole('combobox'));
        expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(getByRole('option')).toHaveClass('class');
      });

      describe('html id', () => {
        it('is used as the options id', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }];
          const { getByRole } = render(
            <DropDownWrapper options={options} />,
          );
          fireEvent.click(getByRole('combobox'));
          expect(getByRole('option')).toHaveAttribute('id', 'xxx');
          expectToHaveFocusedOption(getByRole('combobox'), getByRole('option'));
        });

        it('will not use duplicate ids', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }, { label: 'bar', html: { id: 'xxx' } }];
          const { getByRole, getAllByRole } = render(
            <DropDownWrapper options={options} />,
          );
          fireEvent.click(getByRole('combobox'));
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expect(getAllByRole('option')[0]).toHaveAttribute('id', 'xxx');
          expect(getAllByRole('option')[1]).toHaveAttribute('id', 'xxx_1');
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
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

      it('does not select a group with the arrow keys', () => {
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(document.activeElement).toHaveTextContent('Orange');
      });

      it('does not select a group by typing', () => {
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'c' });
        expect(document.activeElement).toHaveTextContent('Apple');
      });

      it('triggers onValue when an option is selected', () => {
        const spy = jest.fn();
        const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', () => {
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(getByRole('combobox')).toHaveTextContent('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', () => {
          const spy = jest.fn();
          const { getByRole, getAllByText, getAllByRole } = render(
            <DropDownWrapper options={options} onValue={spy} />,
          );
          fireEvent.click(getByRole('combobox'));
          fireEvent.click(getAllByText('Citrus')[0]);
          expect(spy).not.toHaveBeenCalled();
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
        });
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        expect(getByRole('option')).not.toHaveAttribute('data-foo', 'bar');
      });
    });

    describe('missing label', () => {
      it('treats as a blank string', () => {
        const options = [{}];
        const { container, getByRole } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expectToBeClosed(getByRole('combobox'));
      });
    });
  });

  describe('options as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders a closed drop down', () => {
      const { getByRole, container } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed(getByRole('combobox'));
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('Banana');
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });

    it('triggers the onValue callback with an empty string', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={['', 'foo']} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('');
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as array of numbers', () => {
    const options = [0, 1, 2, 3];

    it('renders a closed drop down', () => {
      const { container, getByRole } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed(getByRole('combobox'));
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(1);
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });

    it('triggers the onValue callback with 0', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={[1, 0]} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(0);
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as null', () => {
    it('renders a closed drop down with the option as an empty string', () => {
      const { container, getByRole } = render(<DropDownWrapper options={[null]} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed(getByRole('combobox'));
      fireEvent.click(getByRole('combobox'));
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option'));
      expect(getByRole('option')).toHaveTextContent('');
      expect(getByRole('option')).not.toHaveTextContent('null');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={[null]} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(null);
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });
  });

  describe('options as undefined', () => {
    it('renders a closed drop down with the option as an empty string', () => {
      const { container, getByRole } = render(<DropDownWrapper options={[undefined]} />);
      expect(container).toMatchSnapshot();
      expectToBeClosed(getByRole('combobox'));
      fireEvent.click(getByRole('combobox'));
      expectToHaveFocusedOption(getByRole('combobox'), getByRole('option'));
      expect(getByRole('option')).toHaveTextContent('');
      expect(getByRole('option')).not.toHaveTextContent('undefined');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={[undefined]} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(undefined);
      expectToBeClosed(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveFocus();
    });
  });

  describe('no options', () => {
    it('does not open the listbox of click', () => {
      const { getByRole } = render(
        <DropDownWrapper options={[]} />,
      );
      fireEvent.click(getByRole('combobox'));
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <DropDownWrapper options={[]} />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
      expectToBeClosed(getByRole('combobox'));
    });

    it('displays a none breaking space as the current selection', () => {
      const { getByRole } = render(
        <DropDownWrapper options={[]} />,
      );
      expect(getByRole('combobox').textContent).toEqual('\u00A0'); // eslint-disable-line jest-dom/prefer-to-have-text-content
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { getByRole, getByText } = render(<DropDownWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.click(getByText('Orange'));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { getByRole, getByText } = render(<DropDownWrapper
        options={options}
        mapOption={({ name }) => ({ label: name })}
      />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.click(getByText('Orange'));
      expect(getByRole('combobox')).toHaveTextContent('Orange');
    });
  });

  describe('updating options', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const newOptions = ['Strawberry', 'Raspberry', 'Banana'];

    it('updates the options', () => {
      const propUpdater = new PropUpdater();
      const { container, getByRole } = render(<DropDownWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, options: newOptions }));
      expect(container).toMatchSnapshot();
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<DropDownWrapper
          options={options}
          propUpdater={propUpdater}
        />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the selected option', () => {
      it('resets the currently selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<DropDownWrapper
          options={options}
          propUpdater={propUpdater}
          value="Orange"
        />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
      });
    });
  });
});

describe('value', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('sets the initial focused option', () => {
    const { getAllByRole, getByRole } = render((
      <DropDownWrapper options={options} value="Banana" />
    ));
    fireEvent.click(getByRole('combobox'));
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
  });

  it('scrolls the option into view', () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper options={options} value="Banana" scrollIntoView={spy} />
    ));
    fireEvent.click(getByRole('combobox'));
    expect(spy).toHaveBeenCalledWith(getByRole('option', { name: 'Banana' }));
  });

  describe('value is not in options', () => {
    it('sets the initial focused option to the first option', () => {
      const { getAllByRole, getByRole } = render((
        <DropDownWrapper options={options} value="Strawberry" />
      ));
      fireEvent.click(getByRole('combobox'));
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
    });

    it('displays value as the combo box label', () => {
      const { getByRole } = render((
        <DropDownWrapper options={options} value="Strawberry" />
      ));
      expect(getByRole('combobox')).toHaveTextContent('Strawberry');
    });
  });

  describe('updating the value', () => {
    it('updates the aria-selected value of an open listbox', () => {
      const propUpdater = new PropUpdater();
      const { container, getByRole, getAllByRole } = render(<DropDownWrapper
        options={options}
        propUpdater={propUpdater}
        value="Orange"
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, value: 'Apple' }));
      expect(container.querySelector('[aria-selected="true"]')).toEqual(getAllByRole('option')[0]);
    });

    it('changes the focused value', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<DropDownWrapper
        options={options}
        propUpdater={propUpdater}
        value="Orange"
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, value: 'Apple' }));
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
    });

    describe('value is not in options', () => {
      it('retains existing selection', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<DropDownWrapper
          options={options}
          propUpdater={propUpdater}
          value="Orange"
        />);
        fireEvent.click(getByRole('combobox'));
        propUpdater.update((props) => ({ ...props, value: 'Potato' }));
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
      });
    });
  });
});

describe('placeholderOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a placeholder option', () => {
    const { container, getByRole, getAllByRole } = render(<DropDownWrapper options={options} placeholderOption="Please select…" />);
    expect(container).toMatchSnapshot();
    fireEvent.click(getByRole('combobox'));
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
    expect(getAllByRole('option')[0]).toHaveTextContent('Please select…');
  });

  it('renders with a selected value', () => {
    const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} placeholderOption="Please select…" value="Orange" />);
    fireEvent.click(getByRole('combobox'));
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[3]);
  });

  it('renders with value as null', () => {
    const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} placeholderOption="Please select…" value={null} />);
    fireEvent.click(getByRole('combobox'));
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
  });

  it('allows a placeholder option to be selected', () => {
    const spy = jest.fn();
    const { getByRole, getByText } = render(<DropDownWrapper
      options={options}
      placeholderOption="Please select…"
      value="Orange"
      onValue={spy}
    />);
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('Please select…'));
    expect(spy).toHaveBeenCalledWith(null);
  });
});

describe('children', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders children in the combobox', () => {
    const { getByRole } = render(
      <DropDownWrapper options={options} placeholderOption="Please select…">
        Custom text
      </DropDownWrapper>,
    );
    expect(getByRole('combobox')).toHaveTextContent('Custom text');
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', () => {
      const { getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} managedFocus={false} />,
      );
      const comboBox = getByRole('combobox');
      fireEvent.click(comboBox);
      const listBox = getByRole('listbox');
      expect(comboBox).toHaveFocus();
      fireEvent.keyDown(listBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveFocus();
      expect(comboBox).toHaveAttribute('aria-activedescendant', getAllByRole('option')[1].id);
    });

    it('scrolls the element into view', () => {
      const spy = jest.fn();
      const { getByRole } = render(
        <DropDownWrapper options={options} managedFocus={false} scrollIntoView={spy} />,
      );
      const comboBox = getByRole('combobox');
      fireEvent.click(comboBox);
      const listBox = getByRole('listbox');
      expect(comboBox).toHaveFocus();
      fireEvent.keyDown(listBox, { key: 'ArrowDown' });
      expect(spy).toHaveBeenCalledWith(getByRole('option', { name: 'Banana' }));
    });

    it('allows an option to be selected', () => {
      const { getByRole } = render(
        <DropDownWrapper options={options} managedFocus={false} />,
      );
      const combobox = getByRole('combobox');
      fireEvent.click(combobox);
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(combobox).toHaveTextContent('Banana');
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
      <DropDownWrapper options={options} id="foo" />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(container.querySelector('div')).not.toHaveAttribute('id');
    expect(getByRole('combobox')).toHaveAttribute('id', 'foo');
    expect(getByRole('listbox')).toHaveAttribute('id', 'foo_listbox');
    expect(getAllByRole('option')[0]).toHaveAttribute('id', 'foo_option_apple');
    expect(getAllByRole('option')[1]).toHaveAttribute('id', 'foo_option_pear');
    expect(getAllByRole('option')[2]).toHaveAttribute('id', 'foo_option_orange');
  });
});

describe('classPrefix', () => {
  const options = [
    { label: 'Orange', group: 'Citrus' },
  ];

  it('removes classes when null', () => {
    const { container, getByRole } = render(
      <DropDownWrapper options={options} classPrefix={null} />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(container.querySelector('div')).not.toHaveClass();
    expect(getByRole('combobox')).not.toHaveClass();
    expect(getByRole('listbox')).not.toHaveClass();
    expect(getByRole('option')).not.toHaveClass();
    expect(getByRole('option').previousSibling).not.toHaveClass();
  });

  it('prefixes all classes', () => {
    const { container, getByRole } = render(
      <DropDownWrapper options={options} classPrefix="foo" />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(container.querySelector('div')).toHaveClass('foo');
    expect(getByRole('combobox')).toHaveClass('foo__combobox');
    expect(getByRole('listbox')).toHaveClass('foo__listbox');
    expect(getByRole('option')).toHaveClass('foo__option');
    expect(getByRole('option').previousSibling).toHaveClass('foo__group-label');
  });
});

describe('required', () => {
  it('when false it does not set aria-required on the combobox', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} required={false} />,
    );
    expect(getByRole('combobox')).not.toBeRequired();
  });

  it('when true it sets aria-required on the combobox', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} required />,
    );
    expect(getByRole('combobox')).toBeRequired();
  });
});

describe('disabled', () => {
  describe('when false', () => {
    it('does not set aria-disabld on the combobox', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled={false} />,
      );
      expect(getByRole('combobox')).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('when true', () => {
    it('sets aria-disabled on the combobox', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not open the listbox of click', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      fireEvent.click(getByRole('combobox'));
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not change the value when pressing a key', () => {
      const spy = jest.fn();
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled onValue={spy} />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 't' });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe('aria-labelledby', () => {
  it('is labelled by the value', () => {
    const { getByRole, getByLabelText } = render(
      <DropDownWrapper options={['one', 'two']} value="two" />,
    );
    expect(getByLabelText('two')).toEqual(getByRole('combobox'));
  });

  it('is labelled by the children', () => {
    const { getByRole, getByLabelText } = render((
      <DropDownWrapper options={['one', 'two']} value="two">
        bar
      </DropDownWrapper>
    ));
    expect(getByLabelText('bar')).toEqual(getByRole('combobox'));
  });

  it('sets aria-labelledby as a string', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} aria-labelledby="foo" />,
    );
    expect(getByRole('combobox')).toHaveAttribute('aria-labelledby', 'foo id');
  });
});

describe('aria-invalid', () => {
  it('is not set with no value', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} />,
    );
    expect(getByRole('combobox')).not.toHaveAttribute('aria-invalid');
  });

  it('sets aria-invalid to true', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} aria-invalid="true" />,
    );
    expect(getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid to false', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} aria-invalid="false" />,
    );
    expect(getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
  });
});

describe('skipOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows options to be skipped by moving forward', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    const { getByRole } = render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expect(document.activeElement).toHaveTextContent('Orange');
  });

  it('allows options to be skipped by moving backwards', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    const { getByRole } = render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    expect(document.activeElement).toHaveTextContent('Apple');
  });

  it('allows options to be skipped by pressing home', () => {
    function skipOption(option) {
      return option.label === 'Apple';
    }
    const { getByRole } = render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'Home' });
    expect(document.activeElement).toHaveTextContent('Pear');
  });

  it('allows options to be skipped by pressing end', () => {
    function skipOption(option) {
      return option.label === 'Orange';
    }
    const { getByRole } = render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'End' });
    expect(document.activeElement).toHaveTextContent('Pear');
  });

  describe('all options are skipped', () => {
    // Prevent infinite loops
    it('returns the original option going forward', () => {
      function skipOption() {
        return true;
      }
      const { getByRole } = render(
        <DropDownWrapper options={options} skipOption={skipOption} />,
      );
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(document.activeElement).toHaveTextContent('Apple');
    });

    it('returns the original option going backwards', () => {
      function skipOption() {
        return true;
      }
      const { getByRole } = render(
        <DropDownWrapper options={options} skipOption={skipOption} />,
      );
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
      expect(document.activeElement).toHaveTextContent('Apple');
    });
  });
});

describe('findOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows search options to be skipped', () => {
    const findOption = jest.fn((option) => {
      if (option.label !== 'Orange') {
        return false;
      }
      return true;
    });

    const { getByRole } = render(
      <DropDownWrapper options={options} findOption={findOption} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'b' });
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
    const { getByRole } = render((
      <DropDownWrapper options={['foo']} ref={ref} />
    ));
    expect(ref.current).toEqual(getByRole('combobox'));
  });

  it('references the combobox for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    const { getByRole } = render((
      <DropDownWrapper options={['foo']} ref={ref} />
    ));
    expect(value).toEqual(getByRole('combobox'));
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
      { expanded: false, search: '', currentOption: expect.objectContaining({ label: 'foo' }) },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderComboBox', () => {
  it('allows the combo box to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} renderComboBox={(props) => <dl data-foo="bar" {...props} />} />,
    );
    expect(getByRole('combobox').tagName).toEqual('DL');
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <DropDownWrapper options={['foo']} renderComboBox={spy} test="foo" />
    ));

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      { expanded: false, search: '', currentOption: expect.objectContaining({ label: 'foo' }) },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderListBox', () => {
  it('allows the list box to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} renderListBox={(props) => <dl data-foo="bar" {...props} />} />,
    );
    expect(getByRole('listbox', { hidden: true }).tagName).toEqual('DL');
    expect(getByRole('listbox', { hidden: true })).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    render((
      <DropDownWrapper options={['foo']} renderListBox={spy} test="foo" />
    ));

    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      { expanded: false, search: '', currentOption: expect.objectContaining({ label: 'foo' }) },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroup', () => {
  it('allows the group to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroup={(props) => <dl data-foo="bar" {...props} />} />,
    );
    fireEvent.click(getByRole('combobox'));
    const group = getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroup={spy} test="foo" />
    ));
    fireEvent.click(getByRole('combobox'));

    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        expanded: true,
        search: '',
        currentOption: expect.objectContaining({ label: 'foo' }),
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
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupLabel={(props) => <dl data-foo="bar" {...props} />} />,
    );
    fireEvent.click(getByRole('combobox'));
    const group = getByRole('listbox').firstChild;
    expect(group.tagName).toEqual('DL');
    expect(group).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupLabel={spy} test="foo" />
    ));
    fireEvent.click(getByRole('combobox'));

    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        expanded: true,
        search: '',
        currentOption: expect.objectContaining({ label: 'foo' }),
        group: expect.objectContaining({ label: 'bar' }),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderOption', () => {
  it('allows the option to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} renderOption={(props) => <dl data-foo="bar" {...props} />} />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').tagName).toEqual('DL');
    expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <DropDownWrapper options={['foo']} renderOption={spy} test="foo" />
    ));

    fireEvent.click(getByRole('combobox'));
    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        expanded: true,
        search: '',
        currentOption: expect.objectContaining({ label: 'foo' }),
        option: expect.objectContaining({ label: 'foo' }),
        selected: true,
        group: undefined,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderGroupAccessibleLabel', () => {
  it('allows the group accessible label to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupAccessibleLabel={(props) => <dl data-foo="bar" {...props} />} />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
    expect(getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} renderGroupAccessibleLabel={spy} test="foo" />
    ));

    fireEvent.click(getByRole('combobox'));
    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        expanded: true,
        search: '',
        currentOption: expect.objectContaining({ label: 'foo' }),
        group: expect.objectContaining({ label: 'bar' }),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderValue', () => {
  it('allows the list box to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} renderValue={(props) => <dl data-foo="bar" {...props} />} />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
    expect(getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });

  it('is called with context and props', () => {
    const spy = jest.fn(() => null);
    const { getByRole } = render((
      <DropDownWrapper options={['foo']} renderValue={spy} test="foo" />
    ));

    fireEvent.click(getByRole('combobox'));
    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        expanded: true,
        search: '',
        currentOption: expect.objectContaining({ label: 'foo' }),
        option: expect.objectContaining({ label: 'foo' }),
        selected: true,
        group: undefined,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('visuallyHiddenClassName', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <DropDownWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        visuallyHiddenClassName="bar"
      />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').firstChild).toHaveClass('bar');
  });
});

describe('additional props', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('does not include arbitrary props', () => {
    const { container } = render(
      <DropDownWrapper options={options} foo="bar" />,
    );
    expect(container.querySelector('[foo="bar"]')).toEqual(null);
  });
});

describe('onLayoutListBox', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when the component is rendered', () => {
    const onLayoutListBox = jest.fn();
    render(
      <DropDownWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    expect(onLayoutListBox).not.toHaveBeenCalled();
  });

  it('is called when the listbox is displayed', () => {
    const onLayoutListBox = jest.fn();
    const { getByRole } = render(
      <DropDownWrapper options={options} onLayoutListBox={onLayoutListBox} />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(onLayoutListBox).toHaveBeenCalledWith({
      expanded: true,
      listbox: getByRole('listbox'),
      combobox: getByRole('combobox'),
    });
  });

  it('is called when the listbox options change', () => {
    const propUpdater = new PropUpdater();
    const onLayoutListBox = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
        propUpdater={propUpdater}
      />
    ));
    fireEvent.click(getByRole('combobox'));
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: true,
      listbox: getByRole('listbox'),
      combobox: getByRole('combobox'),
    });
  });

  it('is called when a listbox closed', () => {
    const onLayoutListBox = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
      />
    ));
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(onLayoutListBox).toHaveBeenLastCalledWith({
      expanded: false,
      listbox: getByRole('listbox', { hidden: true }),
      combobox: getByRole('combobox'),
    });
  });

  it('is not called while the listbox is closed', () => {
    const propUpdater = new PropUpdater();
    const onLayoutListBox = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        onLayoutListBox={onLayoutListBox}
        propUpdater={propUpdater}
      />
    ));
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(onLayoutListBox).not.toHaveBeenCalled();
  });
});
