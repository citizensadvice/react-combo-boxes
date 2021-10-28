import React, { useMemo, useState } from 'react';
import { ComboBox, substringHighlight } from '../../../src';

const options = [
  'Toffee yum yum',
  'Blood orange',
  'Lemon meringue',
  'Raspberry fool',
  'Strawberry pavlova',
  'Tiramisu (contains raw egg)',
];

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [inverse, setInverse] = useState(false);
  const filteredOptions = useMemo(() => options.filter((v) => v.includes(search)), [search]);

  return (
    <>
      <label
        id="select-label"
        htmlFor="select"
      >
        Select
      </label>
      <ComboBox
        id="select"
        aria-labelledby="select-label"
        value={value}
        onValue={setValue}
        onSearch={setSearch}
        options={filteredOptions}
        renderValue={substringHighlight({ inverse })}
      />

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setInverse(checked)}
          checked={inverse}
        />
        {' '}
        Toggle inverse
      </label>

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}