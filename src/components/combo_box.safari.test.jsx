import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

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
  const { getByRole, getAllByRole } = render(
    <ComboBoxWrapper options={['foo', 'bar']} />,
  );
  const comboBox = getByRole('combobox');
  comboBox.focus();
  fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
  fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
  expect(getAllByRole('option')[1]).toHaveFocus();
});
