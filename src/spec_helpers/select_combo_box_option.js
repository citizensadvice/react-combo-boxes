/* eslint-disable import/no-extraneous-dependencies */
import { waitFor, findByRole, getByRole, queryAllByRole, isInaccessible, prettyDOM, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { computeAccessibleDescription } from 'dom-accessibility-api';

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
 * Note this helper has a few expectations:
 *
 * - It is used on an ARIA 1.2 combo-box
 * - The listbox remains part of the DOM when hidden
 */
export async function selectComboBoxOption({ from, searchFor, select, container = document.body }) {
  const comboBox = await findByRole(container, 'combobox', options(from));

  userEvent.click(comboBox);

  if (searchFor) {
    userEvent.clear(comboBox);
    userEvent.type(comboBox, searchFor);
  }

  // If the box contains previous or default options then allow the update to complete
  await act(async () => {});

  // Wait for the list box and option to appear
  let listBox;
  let option;
  try {
    await waitFor(() => {
      const ids = [comboBox.getAttribute('aria-controls'), comboBox.getAttribute('aria-owns')].join(' ').split(/\s+/).filter(Boolean);
      listBox = document.querySelector(ids.map((id) => `[role="listbox"]#${id}`).join(','));
      expect(listBox).toBeInstanceOf(HTMLElement);
      expect(listBox).toBeVisible();
      option = getByRole(listBox, 'option', options(select));
    });
  } catch (e) {
    // Display pretty errors that will help the developer
    if (!e.name === 'TestingLibraryElementError') {
      throw e;
    }
    if (!listBox || isInaccessible(listBox)) {
      let message = 'Unable to find visible listbox for combobox';
      message += `\n\n${prettyDOM(comboBox)}`;
      message += `\n\nwith description:\n\n"${computeAccessibleDescription(comboBox).trim()}"`;
      message += '\n\n--------------------------------------------------';

      const listBoxes = queryAllByRole(document.body, 'listbox', { hidden: true });
      if (!listBox) {
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
      option = getByRole(listBox, 'option', options(select));
    } catch (error) {
      error.message += '\n\n--------------------------------------------------';
      error.message += `\n\nFor combobox:\n\n${prettyDOM(comboBox)}`;
      error.message += `\n\nwith description:\n\n"${computeAccessibleDescription(comboBox).trim()}"`;
      throw error;
    }
  }

  // Select the option
  userEvent.click(option);

  await waitFor(() => {
    expect(listBox).not.toBeVisible();
  });
}
