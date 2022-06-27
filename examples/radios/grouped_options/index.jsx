import { useState } from 'react';
import { Radios } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <fieldset className="radios">
        <legend id="legend">What is your favourite fruit</legend>
        <Radios
          aria-labelledby="legend"
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
