import { useEffect, useState } from 'react';
import { ComboBox, tokenSearcher } from '../../../src';
import countries from '../../data/countries.json';

const regions = countries
  .map(({ region }) => ({ name: region, isRegion: true }))
  .filter(
    (item, i, ar) =>
      item.name && ar.findIndex((sub) => sub.name === item.name) === i,
  );

const countriesAndRegions = [...countries, ...regions].sort((a, b) =>
  a.name.localeCompare(b.name),
);

function mapOption({ name }) {
  return name;
}

const tokenSearch = tokenSearcher(countriesAndRegions, { index: mapOption });

function searcher(query, value) {
  if (value?.isRegion && value?.name === query) {
    return countries.filter((c) => c.region === value?.name);
  }
  return tokenSearch(query);
}

function useDelaySearch(search, value) {
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      setBusy(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      if (!controller.signal.aborted) {
        setResults(searcher(search, value));
        setBusy(false);
      }
    };
    run();
    return () => controller.abort();
  }, [search, value]);

  return [results, busy];
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [closeOnSelect, setCloseOnSelect] = useState(false);
  const [filteredOptions, busy] = useDelaySearch(search, value);

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
        closeOnSelect={closeOnSelect}
        busy={busy}
      />

      <label>
        <input
          type="checkbox"
          checked={closeOnSelect}
          onChange={({ target: { checked } }) => {
            setCloseOnSelect(checked);
          }}
        />{' '}
        <code>closeOnSelect</code>
      </label>

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
