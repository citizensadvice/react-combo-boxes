import { useState } from 'react';
import { ComboBox, useAsyncSearch } from '../../../src';

async function searcher(query, { signal }) {
  if (!query || query.trim().length < 2) {
    return null;
  }
  const url = new URL('https://www.thecocktaildb.com/api/json/v1/1/search.php');
  url.searchParams.set('s', query.trim());
  const response = await fetch(url, { signal });
  const data = await response.json();
  if (!data.drinks) {
    return [];
  }
  return data.drinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
}

function mapOption({ idDrink, strDrink }) {
  return {
    id: idDrink,
    label: strDrink,
  };
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [options, busy] = useAsyncSearch(search, { searcher, debounce: 200 });

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
        options={options}
        mapOption={mapOption}
        busy={busy}
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
