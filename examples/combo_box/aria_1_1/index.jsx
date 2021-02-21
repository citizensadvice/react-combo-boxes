import React, { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  'Apple',
  'Orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
];

function renderWrapper(props, { expanded }, { id, 'aria-labelledby': ariaLabelledBy }) {
  return (
    <div
      {...props}
      role="combobox"
      aria-owns={id}
      aria-expanded={expanded ? 'true' : 'false'}
      aria-labelledby={ariaLabelledBy}
    />
  );
}

function renderInput(props) {
  return (
    <input
      {...props}
      role={null}
      aria-expanded={null}
    />
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options });
  const [managedFocus, setManagedFocus] = useState(true);

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
        renderWrapper={renderWrapper}
        renderInput={renderInput}
        managedFocus={managedFocus}
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
