import React, { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  { label: 'Apple', disabled: true },
  { label: 'Banana', disabled: true },
  { label: 'Cherry', disabled: true },
  { label: 'Mango', disabled: true },
  { label: 'Ugli fruit', disabled: true },
];

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
