import { useRef, useState } from 'react';
import { DropDown } from '../../../src';

const options = ['Apple', 'Orange', 'Banana', ''];

export function Example() {
  const [value, setValue] = useState('');
  const ref = useRef();
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
        options={options}
      />

      <label htmlFor="output">Current value</label>
      <output
        htmlFor="drop-down"
        id="output"
      >
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
