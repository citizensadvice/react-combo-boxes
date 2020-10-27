import React, { useState } from 'react';
import { ComboBox, useTokenSearch, TokenHighlight } from '../../../src';

const options = [
  'Apple',
  'Orange',
  'Blood orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
];

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(options);

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
        onSearch={onSearch}
        options={filteredOptions}
        ValueComponent={TokenHighlight}
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
