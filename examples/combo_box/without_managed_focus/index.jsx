import React, { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';
import countries from '../../data/countries.json';

function map({ name, code }) {
  return `${name} (${code})`;
}

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(countries, { index: map });

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
        mapOption={map}
        managedFocus={false}
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
