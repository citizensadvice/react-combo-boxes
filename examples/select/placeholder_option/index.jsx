import { useState } from 'react';
import { Select } from '../../../src';

const options = ['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit'];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="select">Select</label>
      <Select
        id="select"
        placeholderOption="Please choose…"
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
