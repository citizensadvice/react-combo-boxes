import React, { useState } from 'react';
import { Checkboxes } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
];

export function Example() {
  const [values, setValues] = useState([]);
  return (
    <>
      <fieldset className="radios">
        <legend id="legend">What is your favourite fruit</legend>
        <Checkboxes
          aria-labelledby="legend"
          id="checkboxes"
          values={values}
          onValues={setValues}
          options={options}
        />
      </fieldset>
      <label htmlFor="output">
        Current value
      </label>
      <output id="output">
        {JSON.stringify(values, undefined, ' ')}
      </output>
    </>
  );
}
