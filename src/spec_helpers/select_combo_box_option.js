/* eslint-disable import/no-extraneous-dependencies */
import { waitFor, findByRole, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  // Wait for the list box and option to appear
  let listBox;
  let option;
  await waitFor(() => {
    const ids = (comboBox.getAttribute('aria-controls') || '').split(/\s+/).filter(Boolean);
    listBox = document.querySelector(ids.map((id) => `[role="listbox"]#${id}`).join(','));
    expect(listBox).toBeInstanceOf(HTMLElement);
    option = getByRole(listBox, 'option', options(select));
  });

  // Select the option
  userEvent.click(option);

  await waitFor(() => {
    expect(listBox).not.toBeVisible();
  });
}
