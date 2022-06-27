import { useState } from 'react';
import { Radios } from '../../../src';

const options = [
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Ugli fruit',
];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <fieldset className="radios">
        <legend>What is your favourite fruit</legend>
        <Radios
          id="radios"
          name="radios"
          value={value}
          onValue={setValue}
          options={options}
        />
      </fieldset>
      <label htmlFor="output">
        Current value
      </label>
      <output id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
