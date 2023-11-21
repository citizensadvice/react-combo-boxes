import { useState } from 'react';
import { Checkboxes } from '../../../src';

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
      <fieldset className="radios">
        <legend>What is your favourite fruit</legend>
        <Checkboxes
          id="checkboxes"
          values={values}
          onValues={setValues}
          options={options}
        />
      </fieldset>
      <label htmlFor="output">Current value</label>
      <output id="output">{JSON.stringify(values, undefined, ' ')}</output>
    </>
  );
}
