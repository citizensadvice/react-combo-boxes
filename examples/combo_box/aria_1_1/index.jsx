import React, { forwardRef, useContext, useState } from 'react';
import { Context, ComboBox, useTokenSearch } from '../../../src';

const options = [
  'Apple',
  'Orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
];

const WrapperComponent = forwardRef((props, ref) => {
  const { expanded, props: { id } } = useContext(Context);
  return (
    <div
      {...props}
      ref={ref}
      role="combobox"
      aria-owns={id}
      aris-expanded={expanded ? 'true' : 'false'}
    />
  );
});

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(options);
  const [managedFocus, setManagedFocus] = useState(true);

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
        WrapperComponent={WrapperComponent}
        wrapperProps={{ 'aria-labelledby': 'select-label' }}
        inputProps={{ role: null, 'aria-expanded': null }}
        managedFocus={managedFocus}
      />

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setManagedFocus(checked)}
          checked={managedFocus}
        />
        {' '}
        Toggle managed focus
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
