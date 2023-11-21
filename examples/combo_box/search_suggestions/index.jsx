import { useState } from 'react';
import { ComboBox, usePrefixSearch, TokenHighlight } from '../../../src';

const options = [
  'css',
  'css italic',
  'css isolation',
  'css is awesome',
  'css is awesome mug',
  'css is',
  'css is visible',
  'css is selector',
  'css is hard',
  "css isn't being applied",
  'css is not',
  'css is not a function',
  'css syallbus',
  'css grid',
  'cssd',
];

function renderValue(_, { search, option: { label } }) {
  return (
    <TokenHighlight
      search={search}
      value={label}
      inverse
    />
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const filteredOptions = usePrefixSearch(value, { options });

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
        onSearch={setValue}
        options={filteredOptions}
        showSelectedLabel
        managedFocus={false}
        expandOnFocus={false}
        renderDownArrow={() => null}
        renderClearButton={() => null}
        renderNotFound={() => null}
        renderValue={renderValue}
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
