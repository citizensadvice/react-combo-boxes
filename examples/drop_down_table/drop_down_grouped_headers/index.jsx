import { useState } from 'react';
import {
  DropDownTable,
  layoutMaxWidth,
  layoutMaxHeight,
  layoutColumnsAlignLeft,
} from '../../../src';
import cats from '../../data/cats.json';

const columns = [
  { name: 'breed', label: 'Breed' },
  { name: 'country', label: 'Country' },
  { name: 'origin', label: 'Origin' },
  { name: 'bodyType', label: 'Body type' },
  { name: 'coatLength', label: 'Coat length' },
  { name: 'pattern', label: 'Pattern' },
];

function mapOption({ breed, bodyType }) {
  return { label: breed, group: bodyType };
}

const onLayoutListBox = [
  layoutMaxWidth,
  layoutMaxHeight,
  layoutColumnsAlignLeft,
];

export function Example() {
  const [value, setValue] = useState(null);

  return (
    <>
      <label
        id="drop-down-label"
        htmlFor="select"
      >
        Select
      </label>
      <DropDownTable
        id="drop-down"
        aria-labelledby="drop-down-label"
        value={value}
        onValue={setValue}
        columns={columns}
        options={cats}
        mapOption={mapOption}
        onLayoutListBox={onLayoutListBox}
      />

      <label htmlFor="output">Current value</label>
      <output
        htmlFor="drop-down"
        id="output"
      >
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
