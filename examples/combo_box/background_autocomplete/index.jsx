import React, { useState } from 'react';
import { ComboBox, useSearch } from '../../../src';

function search(value) {
  if (!value) {
    return [];
  }

  const match = value.match(/^.*\b(in|is|from|to):(\w*)$/);
  if (!match) {
    return [];
  }

  const found = {
    in: ['spam', 'bin', 'inbox', 'draft'],
    is: ['read', 'starred'],
    from: ['me', 'example@foo.com'],
    to: ['me', 'example@bar.com'],
  }[match[1]];

  if (!found) {
    return [];
  }

  return found
    .filter((term) => (
      (!match[2] || term.startsWith(match[2].toLowerCase())) && !new RegExp(`\\b${match[1]}:${term}\\b`).test(value)
    ))
    .map((term) => (
      `${value}${term.slice((match[2] || '').length)} `
    ));
}

function renderInput(props, { expanded, suggestedOption }) {
  const suggestedValue = (expanded && suggestedOption?.label) || '';
  const { className } = props;

  return (
    <>
      <input
        {...props}
        style={{ background: 'transparent' }}
      />
      <input
        className={className}
        value={suggestedValue}
        disabled
        style={{ position: 'absolute', left: 0, background: 'white', zIndex: -1, color: '#999' }}
      />
    </>
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useSearch(search, { minLength: 1 });
  const [autoselect, setAutoselect] = useState(false);

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
        size={100}
        onChange={({ target: { value: _value } }) => setValue(_value)}
        onSearch={onSearch}
        options={filteredOptions}
        tabAutocomplete
        showSelectedLabel
        expandOnFocus={false}
        managedFocus={false}
        renderNotFound={() => null}
        renderClearButton={() => null}
        renderInput={renderInput}
        autoselect={autoselect}
        autoCapitalize="none"
        autoCorrect="off"
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

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
