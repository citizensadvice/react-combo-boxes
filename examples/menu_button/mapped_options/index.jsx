import React, { useCallback, useRef, useState } from 'react';
import { DropDown } from '../../../src';
import countries from '../../data/countries.json';

export function Example() {
  const [value, setValue] = useState(null);
  const ref = useRef();
  const mapOption = useCallback(
    ({ name, code }) => ({ label: `${name} (${code})` }),
    [],
  );

  return (
    <>
      <div
        className="label"
        onClick={() => ref.current.focus()}
        id="drop-down-label"
      >
        Drop down
      </div>
      <DropDown
        ref={ref}
        id="drop-down"
        aria-labelledby="drop-down-label"
        value={value}
        onValue={setValue}
        options={countries}
        mapOption={mapOption}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="drop-down" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
