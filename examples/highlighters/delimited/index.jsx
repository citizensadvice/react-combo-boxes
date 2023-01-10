import { useState } from 'react';
import { ComboBox, useTokenSearch, DelimitedHighlight } from '../../../src';

const options = [
  { label: 'Toffee yum yum', highlighted: 'Toffee <em>yum</em> yum' },
  { label: 'Blood orange', highlighted: 'Bl<em>oo</em>d orange' },
  { label: 'Lemon meringue' },
  { label: 'Raspberry fool', highlighted: '<em>Raspberry</em> fool' },
];

function renderValue({ children }, { option: { value: { highlighted } } }) {
  return (
    <DelimitedHighlight value={highlighted || children} start="<em>" end="</em>" />
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options });

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
        renderValue={renderValue}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
