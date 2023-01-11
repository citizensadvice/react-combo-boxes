/* eslint-disable import/no-extraneous-dependencies */
import { waitFor, screen, isInaccessible, prettyDOM, within } from '@testing-library/react';
import importedUserEvent from '@testing-library/user-event';

function options(name) {
  if (typeof name === 'string' || name instanceof RegExp) {
    return { name };
  }
  return name;
}

/**
 * Select a combo box option
 *
 * await selectComboBoxOption({ from: 'My label', searchFor: 'Foo', select: 'Bar' });
 *
 * Options:
 *
 * `from` (String|RegExp|Object)
 *
 * The name for the combo-box, or an object if you want to specify more findByRole options
 *
 * `searchFor` (String)
 *
 * Text to type and search, replaces existing content
 * Optional, omit, and the combo box will just be focused
 *
 * `select` (String|RegExp|Object)
 *
 * The name of the option, or an object if you want to specify more findByRole options
 *
 * `container` (Node)
 *
 * The container to search within.  Defaults to document.body
 *
 * `userEvent` (UserEvent)
 *
 * An existing userEvent object. This is required for user-event v14.
 *
 * Note this helper has a few expectations:
 *
 * - It is used on an ARIA 1.2 combo-box
 * - The listbox remains part of the DOM when hidden
 */
export async function selectComboBoxOption({
  from,
  searchFor,
  select,
  container = document.body,
  userEvent = importedUserEvent,
}) {
  const comboBox = await within(container).findByRole('combobox', options(from));
  // Suport ARIA 1.1
  let textBox = comboBox;
  if (!textBox.matches('input')) {
    const ids = (comboBox.getAttribute('aria-owns') || '').split(/\s+/).filter(Boolean);
    // Technically the textbox can be child, or owned by the combobox
    // If it is a readonly combobox there will be no textbox
    textBox = within(comboBox).queryByRole('textbox') || within(container).queryAllByRole('textbox').find((id) => ids.include(id)) || comboBox;
  }

  await userEvent.click(textBox);

  if (typeof searchFor === 'string') {
    await userEvent.clear(textBox);
    if (searchFor) {
      await userEvent.type(textBox, searchFor);
    }
  }

  // Wait for the list box and option to appear
  let listBox;
  let option;
  try {
    await waitFor(() => {
      // Support ARIA 1.0, 1.1 and 1.2
      const ids = [
        comboBox.getAttribute('aria-controls'), // ARIA 1.2
        comboBox.getAttribute('aria-owns'), // ARIA 1.0 / 1.1
        textBox.getAttribute('aria-controls'), // ARIA 1.1
      ].join(' ').split(/\s+/).filter(Boolean);
      listBox = within(container).getAllByRole('listbox').find((listbox) => ids.includes(listbox.id));
      expect(listBox).toBeInTheDocument();
      option = within(listBox).getByRole('option', options(select));
    });
  } catch (e) {
    // Display pretty errors that will help the developer
    if (!e.name === 'TestingLibraryElementError') {
      throw e;
    }
    if (!listBox || isInaccessible(listBox)) {
      let message = 'Unable to find visible listbox for combobox';
      message += `\n\n${prettyDOM(comboBox)}`;
      message += '\n\n--------------------------------------------------';

      const listBoxes = screen.queryAllByRole('listbox', { hidden: true });
      if (!listBoxes) {
        message += `\n\nNo elements with the role "listbox" found in document:\n\n${prettyDOM(document.body)}`;
      } else {
        message += '\n\nHere are the found elements with the role "listbox":';
        listBoxes.forEach((box) => {
          message += `\n\n${prettyDOM(box)}`;
        });
      }
      throw new Error(message);
    }
    try {
      option = within(listBox).getByRole('option', options(select));
    } catch (error) {
      error.message += '\n\n--------------------------------------------------';
      error.message += `\n\nFor combobox:\n\n${prettyDOM(comboBox)}`;
      throw error;
    }
  }

  // Select the option
  await userEvent.click(option);

  await waitFor(() => {
    expect(listBox).not.toBeVisible();
  });
}
