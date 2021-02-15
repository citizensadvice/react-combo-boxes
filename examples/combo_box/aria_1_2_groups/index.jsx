import React, { useState } from 'react';
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
      role="group"
      aria-labelledby={key}
    >
      <div
        className="react-combo-boxes-listbox__group-label"
        id={key}
      >
        {label}
      </div>
      <ul
        role="presentation"
        className="react-combo-boxes-listbox__group"
      >
        {groupChildren}
      </ul>
    </li>
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [managedFocus, setManagedFocus] = useState(true);
  const [filteredOptions, onSearch] = useTokenSearch(options);

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
        onSearch={onSearch}
        options={filteredOptions}
        managedFocus={managedFocus}
        renderGroup={renderGroup}
        renderGroupAccessibleLabel={() => null}
      />

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setManagedFocus(checked)}
          checked={managedFocus}
        />
        {' '}
        Toggle managed focus
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
