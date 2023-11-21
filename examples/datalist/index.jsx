import { useState } from 'react';

const options = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Ugli fruit'];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="input">Choose a fruit</label>
      <input
        id="input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        list="fruits"
      />
      <datalist id="fruits">
        {options.map((option) => (
          <option
            key={option}
            value={option}
          />
        ))}
      </datalist>

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
