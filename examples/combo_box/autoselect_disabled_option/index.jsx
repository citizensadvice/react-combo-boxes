import { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange' },
  { label: 'Lemon', disabled: true },
  { label: 'Raspberry' },
  { label: 'Strawberry' },
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
        autoselect="inline"
        onValue={setValue}
        onSearch={setSearch}
        options={filteredOptions}
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
