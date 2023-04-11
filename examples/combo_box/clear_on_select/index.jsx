import { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  'Apple',
  'Orange',
  'Blood orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
];

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [clearOnSelect, setClearOnSelect] = useState(true);
  const filteredOptions = useTokenSearch(search, { options, minLength: 1 });

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
        onValue={setValue}
        onSearch={(s) => setSearch(s)}
        options={filteredOptions}
        clearOnSelect={clearOnSelect}
      />

      <label>
        <input
          type="checkbox"
          checked={clearOnSelect}
          onChange={({ target: { checked } }) => {
            setClearOnSelect(checked);
          }}
        />
        {' '}
        <code>clearOnSelect</code>
      </label>

      <label htmlFor="output">
        Selected value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
