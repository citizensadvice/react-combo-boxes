import React, { useState } from 'react';
import {
  ComboBoxTable,
  useTokenSearch,
  tokenHighlighter,
  passThroughHighlighter,
  highlightValue,
  useLayoutListBox,
  layoutMaxWidth,
  layoutMaxHeight,
  layoutColumnsAlignLeft,
} from '../../../src';
import cats from '../../data/cats.json';

const columns = [
  {
    name: 'breed',
    label: 'Breed',
  },
  {
    name: 'country',
    label: 'Country',
  },
];

function mapOption({ breed }) {
  return breed;
}

function highlighter(term, query, options, state) {
  const { column: { name } } = state;
  if (name === 'breed') {
    return tokenHighlighter(term, query);
  }
  return passThroughHighlighter(term);
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options: cats, index: mapOption });

  const onLayoutListBox = useLayoutListBox(
    layoutMaxWidth,
    layoutMaxHeight,
    layoutColumnsAlignLeft,
  );

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
        onLayoutListBox={onLayoutListBox}
        options={filteredOptions}
        columns={columns}
        renderColumnValue={highlightValue(highlighter)}
        mapOption={mapOption}
        size={100}
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
