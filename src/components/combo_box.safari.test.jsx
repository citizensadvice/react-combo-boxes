import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

Object.defineProperties(globalThis.navigator, {
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

it('uses managedFocus = true on a mac in safari', async () => {
  render(<ComboBoxWrapper options={['foo', 'bar']} />);
  await userEvent.tab();
  await userEvent.keyboard('{ArrowDown}{ArrowDown}');
  expect(screen.getByRole('option', { name: 'bar' })).toHaveFocus();
});
