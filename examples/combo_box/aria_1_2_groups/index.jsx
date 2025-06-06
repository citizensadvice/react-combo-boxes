import { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
];

function renderGroup(props, { groupChildren, group: { key, label } }) {
  return (
    <li
      key={key}
      role="group"
      aria-labelledby={key}
    >
      <div
        className="react-combo-boxes-combobox__group-label"
        id={key}
      >
        {label}
      </div>
      <ul
        role="presentation"
        className="react-combo-boxes-combobox__group"
      >
        {groupChildren}
      </ul>
    </li>
  );
}

function renderOption({ key, 'aria-labelledby': _, ...props }) {
  return (
    <li
      key={key}
      {...props}
    />
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
        renderGroup={renderGroup}
        renderOption={renderOption}
      />

      <label htmlFor="output">Current value</label>
      <output
        htmlFor="select"
        id="output"
      >
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
