import { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  { label: 'Apple', html: { style: { color: 'green' } } },
  { label: 'Orange', html: { style: { color: 'orange' } } },
  { label: 'Lemon', html: { style: { color: 'yellow' } } },
  { label: 'Raspberry', html: { style: { color: 'maroon' } } },
  { label: 'Strawberry', html: { style: { color: 'orangered' } } },
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
