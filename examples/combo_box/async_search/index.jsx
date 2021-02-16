import React, { useMemo, useState } from 'react';
import { ComboBox, useAsyncSearch, tokenSearcher } from '../../../src';
import countries from '../../data/countries.json';

function mapOption({ name }) {
  return name;
}

function useFindOptions(query, { debounce }) {
  const searcher = useMemo(() => {
    const search = tokenSearcher(countries, { index: mapOption });
    return async (term) => {
      await new Promise((resolve) => {
        setTimeout(resolve, Math.random() * 1000);
      });

      return search(term);
    };
  }, []);

  return useAsyncSearch(query, { searcher, initialOptions: countries, debounce });
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [searchDebounce, setSearchDebounce] = useState(200);
  const [busyDebounce, setBusyDebounce] = useState(400);
  const [filteredOptions, busy] = useFindOptions(search, { debounce: searchDebounce });

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
