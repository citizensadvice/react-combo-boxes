import React, { useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  'Apple',
  'Orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
];

function renderListBox({ hidden, className, ...props }) {
  return (
    <div
      className={className}
      hidden={hidden}
    >
      <ul
        className="reset-list"
        {...props}
      />
      <div className="list-footer">
        <a href="https://en.wikipedia.org/wiki/Fruit">
          More about fruit
        </a>
      </div>
    </div>
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState(null);
  const filteredOptions = useTokenSearch(search, { options });

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
        renderListBox={renderListBox}
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
