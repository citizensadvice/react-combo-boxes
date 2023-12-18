import { useState } from 'react';
import {
  ComboBox,
  useTokenSearch,
  layoutMaxWidth,
  layoutMaxHeight,
} from '../../../src';
import { layoutPopover } from '../../../src/layout/layout_popover';

const options = [
  'Apple',
  'Orange',
  'Blood orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
];

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options });

  const onLayoutListBox = [layoutMaxWidth, layoutMaxHeight, layoutPopover];

  return (
    <div style={{ overflow: 'scroll', height: '100px', padding: '.5em' }}>
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
        onLayoutListBox={onLayoutListBox}
      />

      <label htmlFor="output">Current value</label>
      <output
        htmlFor="select"
        id="output"
      >
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </div>
  );
}
