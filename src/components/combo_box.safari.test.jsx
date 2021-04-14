import React, { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

Object.defineProperties(global.navigator, {
  vendor: {
    get() {
      return 'Apple Computers, Inc.';
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

it('uses managedFocus = true on a mac in safari', () => {
  render(<ComboBoxWrapper options={['foo', 'bar']} />);
  const comboBox = screen.getByRole('combobox');

  comboBox.focus();
  fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
  fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
  expect(screen.getByRole('option', { name: 'bar' })).toHaveFocus();
});
