import React, { useState } from 'react';
import { ComboBox, useTokenSearch, tokenHighlight } from '../../../src';
import countries from '../../data/countries.json';

function map({ name, code }) {
  return `${name} (${code})`;
}

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(countries, { index: map });
  const [autoselect, setAutoselect] = useState('inline');
  const [tabAutocomplete, setTabAutocomplete] = useState(false);
  const [showSelectedLabel, setShowSelectedLabel] = useState(false);
  const [managedFocus, setManagedFocus] = useState(true);
  const [expandOnFocus, setExpandOnFocus] = useState(true);

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
        onSearch={onSearch}
        options={filteredOptions}
        mapOption={map}
        autoselect={autoselect}
        tabAutocomplete={tabAutocomplete}
        showSelectedLabel={showSelectedLabel}
        managedFocus={managedFocus}
        expandOnFocus={expandOnFocus}
        renderValue={tokenHighlight}
      />

      <fieldset>
        <legend>Autoselect</legend>
        <label>
          <input
            type="radio"
            name="autoselect"
            checked={autoselect === false}
            onChange={({ target: { checked } }) => {
              if (checked) {
                setAutoselect(false);
              }
            }}
          />
          {' '}
          <code>false</code>
        </label>
        <label>
          <input
            type="radio"
            name="autoselect"
            checked={autoselect === true}
            onChange={({ target: { checked } }) => {
              if (checked) {
                setAutoselect(true);
              }
            }}
          />
          {' '}
          <code>true</code>
        </label>
        <label>
          <input
            type="radio"
            name="autoselect"
            checked={autoselect === 'inline'}
            onChange={({ target: { checked } }) => {
              if (checked) {
                setAutoselect('inline');
              }
            }}
          />
          {' '}
          <code>&quot;inline&quot;</code>
        </label>
      </fieldset>

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setManagedFocus(checked)}
          checked={managedFocus}
        />
        {' '}
        Toggle managed focus
      </label>

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setTabAutocomplete(checked)}
          checked={tabAutocomplete}
        />
        {' '}
        Toggle tab completion
      </label>

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setShowSelectedLabel(checked)}
          checked={showSelectedLabel}
        />
        {' '}
        Toggle show selected label
      </label>

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setExpandOnFocus(checked)}
          checked={expandOnFocus}
        />
        {' '}
        Toggle Expand on focus
      </label>

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
