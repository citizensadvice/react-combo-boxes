import React, { useState } from 'react';
import { Select } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange' },
  { label: 'Lemon', disabled: true },
  { label: 'Raspberry' },
  { label: 'Strawberry' },
];

export function Example() {
  const [values, setValues] = useState(['Lemon']);
  return (
    <>

      <label htmlFor="select">
        Select
      </label>
      <Select
        id="select"
        multiple
        size={5}
        values={values}
        onValues={setValues}
        options={options}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(values, undefined, ' ')}
      </output>
    </>
  );
}
