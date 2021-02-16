import React, { useState } from 'react';
import { ComboBoxTable, useTokenSearch, tokenHighlight, useConfineListBox } from '../../../src';
import cats from '../../data/cats.json';

const columns = [
  { name: 'breed', label: 'Breed' },
  { name: 'country', label: 'Country' },
  { name: 'origin', label: 'Origin' },
  { name: 'bodyType', label: 'Body type' },
  { name: 'coatLength', label: 'Coat length' },
  { name: 'pattern', label: 'Pattern' },
];

function mapOption({ breed }) {
  return breed;
}

function renderColumnValue(props, state, componentProps) {
  const { column: { name } } = state;
  if (name === 'breed') {
    return (
      tokenHighlight(props, state, componentProps)
    );
  }
  return props.children;
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options: cats, index: mapOption });
  const [style, onLayoutListBox] = useConfineListBox();
  const [managedFocus, setManagedFocus] = useState(true);

  return (
    <>
      <label
        id="select-label"
        htmlFor="select"
      >
        Select
      </label>
      <ComboBoxTable
        id="select"
        aria-labelledby="select-label"
        value={value}
        onValue={setValue}
        onSearch={setSearch}
        options={filteredOptions}
        columns={columns}
        renderColumnValue={renderColumnValue}
        mapOption={mapOption}
        onLayoutListBox={onLayoutListBox}
        renderListBox={(props) => <div style={style} {...props} />}
        managedFocus={managedFocus}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setManagedFocus(checked)}
          checked={managedFocus}
        />
        {' '}
        Toggle managed focus
      </label>
    </>
  );
}
