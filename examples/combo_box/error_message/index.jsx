import React, { useState } from 'react';
import { ComboBox, useAsyncSearch } from '../../../src';

async function searcher(query) {
  if (!query) {
    return ['Apple', 'Banana', 'Orange'];
  }

  throw new Error('Something went wrong');
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [filteredOptions, busy, error] = useAsyncSearch(search, { searcher, catchErrors: true });

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
        busy={busy}
        errorMessage={error ? `⚠️ ${error.message}` : null}
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
