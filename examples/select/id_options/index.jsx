import { useState } from 'react';
import { Select } from '../../../src';

const options = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
  { id: 4, name: 'Mango' },
  { id: 5, name: 'Ugli fruit' },
];

function mapOption({ id, name }) {
  return {
    id,
    label: name,
  };
}

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <Select
        id="select"
        placeholderOption="Choose an option…"
        value={value}
        onValue={({ id }) => setValue(id)}
        mapOption={mapOption}
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
