import React, { useState } from 'react';
import { ComboBoxTable, useTokenSearch, tokenHighlight, useConfineListBox } from '../../../src';
import cats from '../../data/cats.json';

const columns = ['breed', 'country', 'origin', 'bodyType', 'coatLength', 'pattern'];

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
  const [filteredOptions, onSearch] = useTokenSearch(cats, { index: mapOption });
  const [style, onLayoutListBox] = useConfineListBox();

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
        onSearch={onSearch}
        options={filteredOptions}
        columns={columns}
        renderColumnValue={renderColumnValue}
        mapOption={mapOption}
        onLayoutListBox={onLayoutListBox}
        renderListBox={(props) => <div style={style} {...props} />}
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