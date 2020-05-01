import React, { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  'Apple',
  'Banana',
  'Orange',
];

export function Example() {
  const [value, setValue] = useState();
  const [filteredOptions, onSearch, busy] = useTokenSearch(options, { minLength: 2 });

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
        busy={busy}
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
