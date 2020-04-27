import React, { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  { label: 'Apple', id: 1 },
  { label: 'Orange', value: 1 },
  { label: 'Banana', value: '1', id: 2 },
  1,
  '1',
];

export function Example() {
  const [value, setValue] = useState(1);
  const [filteredOptions, onSearch] = useTokenSearch(options);

  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        onValue={setValue}
        onSearch={onSearch}
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
