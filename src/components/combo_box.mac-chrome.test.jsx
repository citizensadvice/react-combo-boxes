import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

Object.defineProperties(global.navigator, {
  platform: {
    get() {
      return 'MacIntel';
    },
  },
  vendor: {
    get() {
      return 'Goole Inc.';
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

it('uses managedFocus = false on a mac not in safari', () => {
  const { getByRole } = render(
    <ComboBoxWrapper options={['foo', 'bar']} />,
  );
  const comboBox = getByRole('combobox');
  comboBox.focus();
  fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
  fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
  expect(comboBox).toHaveFocus();
  expect(comboBox).toHaveAttribute('aria-activedescendant', getByRole('option', { name: 'bar' }).id);
  expect(getByRole('option', { name: 'bar' })).toHaveAttribute('aria-selected', 'true');
});
