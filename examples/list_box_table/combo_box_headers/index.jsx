import React, { useContext, useState } from 'react';
import { Context, ComboBox, useTokenSearch, ListBoxTable, TokenHighlight, useConfineListBoxTable } from '../../../src';
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

function Highlight(props) {
  const { column: { name } } = useContext(Context);
  if (name === 'breed') {
    return (
      <TokenHighlight {...props} />
    );
  }
  return props.children;
}

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(cats, { index: mapOption });
  const [style, onLayoutListBox] = useConfineListBoxTable();

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
        ListBoxComponent={ListBoxTable}
        columns={columns}
        ValueComponent={Highlight}
        mapOption={mapOption}
        onLayoutListBox={onLayoutListBox}
        listBoxListProps={{ style }}
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
