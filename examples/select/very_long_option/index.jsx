import React, { useState } from 'react';
import { Select } from '../../../src';

const options = [
  'Apple',
  'Banana',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <Select
        id="select"
        value={value}
        onValue={setValue}
        options={options}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
