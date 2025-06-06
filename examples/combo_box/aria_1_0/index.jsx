import { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = ['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit'];

function renderInput({ 'aria-controls': ariaOwns, ...props }) {
  return (
    <input
      {...props}
      aria-owns={ariaOwns}
    />
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options });

  return (
    <>
      <label
        id="select-label"
        htmlFor="select"
      >
        Select
      </label>
      <ComboBox
        id="select"
        aria-labelledby="select-label"
        value={value}
        onValue={setValue}
        onSearch={setSearch}
        options={filteredOptions}
        renderInput={renderInput}
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
