import React, { useState } from 'react';
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
  'css isn\'t being applied',
  'css is not',
  'css is not a function',
  'css syallbus',
  'css grid',
  'cssd',
];

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = usePrefixSearch(options);

  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        onChange={({ target: { value: v } }) => setValue(v)}
        onSearch={onSearch}
        options={filteredOptions}
        showSelectedLabel
        managedFocus={false}
        expandOnFocus={false}
        ClearButtonComponent={() => null}
        ValueComponent={TokenHighlight}
        valueProps={{ inverse: true }}
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
