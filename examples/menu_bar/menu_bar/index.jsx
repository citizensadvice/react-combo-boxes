import React, { useMemo, useState } from 'react';
import { MenuBar } from '../../../src';

export function Example() {
  const [value, setValue] = useState(null);

  const options = useMemo(() => [
    { label: 'Blue', onClick: () => setValue('blue') },
    { label: 'Red', onClick: () => setValue('red') },
    { label: 'Green', onClick: () => setValue('green') },
  ], []);

  return (
    <>
      <MenuBar
        id="menu-button"
        options={options}
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
