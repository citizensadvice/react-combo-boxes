import React, { useCallback, useState } from 'react';
import { ComboBox, useTokenSearch, tokenHighlight } from '../../../src';
import emoji from '../../data/emoji.json';

// The emoji set includes identical variations on code sequences
const seen = new Set();
const dedupedEmoji = emoji.filter(({ name }) => {
  if (seen.has(name)) {
    return false;
  }
  seen.add(name);
  return true;
});

export function Example() {
  const index = useCallback((o) => `${o.name} ${o.char}`, []);
  const map = useCallback(({ name, char, group }) => ({ label: `${name} ${char}`, group }), []);
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  // The list of emoji can be thousands.  This rather ruins performance so limit results to 100.
  const filteredOptions = useTokenSearch(
    search,
    { options: dedupedEmoji, index, minLength: 1, maxResults: 100 },
  );

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
        mapOption={map}
        renderValue={tokenHighlight()}
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
