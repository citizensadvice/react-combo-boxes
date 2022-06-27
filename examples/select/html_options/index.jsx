import { useState } from 'react';
import { Select } from '../../../src';

const options = [
  { label: 'Apple', html: { style: { color: 'green' } } },
  { label: 'Orange', html: { style: { color: 'orange' } } },
  { label: 'Lemon', html: { style: { color: 'yellow' } } },
  { label: 'Raspberry', html: { style: { color: 'maroon' } } },
  { label: 'Strawberry', html: { style: { color: 'orangered' } } },
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
