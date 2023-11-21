import { useState } from 'react';
import { Select } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="select">Select</label>
      <Select
        id="select"
        value={value}
        onValue={setValue}
        options={options}
      />

      <label htmlFor="output">Current value</label>
      <output
        htmlFor="select"
        id="output"
      >
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
