import React, { useState } from 'react';
import { Select } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange' },
  { label: 'Lemon' },
  { label: 'Raspberry' },
  { label: 'Strawberry' },
];

export function Example() {
  const [value, setValue] = useState('Lemon');
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
