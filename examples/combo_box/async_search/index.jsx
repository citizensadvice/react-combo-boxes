import React, { useState } from 'react';
import { ComboBox, useSearch, tokenSearcher } from '../../../src';
import countries from '../../data/countries.json';

function mapOption({ name }) {
  return name;
}

const searcher = tokenSearcher(countries, { index: mapOption });

async function search(term) {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 1000);
  });

  return searcher(term);
}


export function Example() {
  const [value, setValue] = useState(null);
  const [searchDebounce, setSearchDebounce] = useState(200);
  const [busyDebounce, setBusyDebounce] = useState(400);
  const [filteredOptions, onSearch, busy] = useSearch(
    search,
    { initialOptions: countries, debounce: searchDebounce },
  );

  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        onValue={setValue}
        onSearch={onSearch}
        options={filteredOptions}
        mapOption={mapOption}
        busy={busy}
        busyDebounce={busyDebounce}
      />

      <label htmlFor="busy-debounce">
        Busy debounce
        {`(${busyDebounce})`}
      </label>
      <input
        id="busy-debounce"
        onChange={({ target: { value: v } }) => setBusyDebounce(+v)}
        value={busyDebounce}
        type="range"
        min={0}
        max={1000}
        step={100}
      />

      <label htmlFor="search-debounce">
        Search debounce
        {`(${searchDebounce})`}
      </label>
      <input
        id="busy-debounce"
        onChange={({ target: { value: v } }) => setSearchDebounce(+v)}
        value={searchDebounce}
        type="range"
        min={0}
        max={1000}
        step={100}
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
