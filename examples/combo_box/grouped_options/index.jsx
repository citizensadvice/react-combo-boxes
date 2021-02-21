import React, { useState } from 'react';
import { ComboBox, useTokenSearch, tokenHighlight } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
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
        renderValue={tokenHighlight}
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
