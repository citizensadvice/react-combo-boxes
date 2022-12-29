import { useState } from 'react';
import {
  ComboBoxTable,
  useTokenSearch,
  TokenHighlight,
  layoutMaxWidth,
  layoutMaxHeight,
  layoutColumnsAlignLeft,
} from '../../../src';
import cats from '../../data/cats.json';

const columns = [
  {
    name: 'breed',
  },
  {
    name: 'country',
  },
];

function mapOption({ breed, bodyType }) {
  return { label: breed, group: bodyType };
}

function index({ breed }) {
  return breed;
}

function renderValue({ children }, { search, column: { name } }) {
  if (name === 'breed') {
    return (
      <TokenHighlight search={search} label={children} />
    );
  }
  return children;
}

const onLayoutListBox = [
  layoutMaxWidth,
  layoutMaxHeight,
  layoutColumnsAlignLeft,
];

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options: cats, index });

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
        renderColumnValue={renderValue}
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
