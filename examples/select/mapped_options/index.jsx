import React, { useState } from 'react';
import { Select } from '../../../src';
import countries from '../../data/countries.json';

function map({ name, code }) {
  return { label: `${name} (${code})` };
}

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <Select
        id="select"
        value={value}
        onValue={setValue}
        options={countries}
        mapOption={map}
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
