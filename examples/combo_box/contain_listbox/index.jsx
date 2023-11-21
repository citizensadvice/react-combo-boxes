import { useState } from 'react';
import {
  ComboBox,
  useTokenSearch,
  layoutMaxWidth,
  layoutMaxHeight,
} from '../../../src';
import countries from '../../data/countries.json';

function mapOption({ name, code }) {
  return `${name} (${code})`;
}

const onLayoutListBox = [
  (el) => layoutMaxHeight(el, { contain: '.contain-listbox' }),
  (el) => layoutMaxWidth(el, { contain: '.contain-listbox' }),
];

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, {
    options: countries,
    index: mapOption,
  });

  return (
    <div
      className="contain-listbox"
      style={{
        height: '500px',
        width: '300px',
        overflow: 'auto',
        padding: '10px',
        margin: '10px',
        paddingTop: '200px',
        border: '10px dashed #ddd',
      }}
    >
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
        mapOption={mapOption}
        onLayoutListBox={onLayoutListBox}
      />

      <label htmlFor="output">Current value</label>
      <output
        htmlFor="select"
        id="output"
      >
        {JSON.stringify(value, undefined, ' ')}
      </output>
      <div style={{ height: '1000px', width: '500px' }} />
    </div>
  );
}
