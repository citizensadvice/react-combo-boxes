import { useMemo, useState } from 'react';
import { ComboBox, SubstringHighlight } from '../../../src';

const options = [
  'Toffee yum yum',
  'Blood orange',
  'Lemon meringue',
  'Raspberry fool',
  'Strawberry pavlova',
  'Tiramisu (contains raw egg)',
];

function renderValue({ children }, { search }) {
  return (
    <SubstringHighlight label={children} search={search} />
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
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
