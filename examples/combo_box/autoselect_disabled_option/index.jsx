import React, { useState } from 'react';
import { ComboBox, useTokenSearch, TokenHighlight } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange' },
  { label: 'Lemon', disabled: true },
  { label: 'Raspberry' },
  { label: 'Strawberry' },
];

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(options);

  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        autoselect="inline"
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
