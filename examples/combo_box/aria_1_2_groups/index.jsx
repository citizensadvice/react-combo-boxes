import React, { forwardRef, useContext, useState } from 'react';
import { Context, ComboBox, useTokenSearch } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
];

function GroupComponent({ children }) {
  const { group: { key } } = useContext(Context);
  const [label, groupOptions] = children;

  return (
    <li
      role="group"
      aria-labelledby={key}
    >
      {label}
      <ul
        role="presentation"
        className="react-combo-boxes-listbox__group"
      >
        {groupOptions}
      </ul>
    </li>
  );
}

function GroupLabelComponent({ children }) {
  const { group: { key } } = useContext(Context);

  return (
    <div
      className="react-combo-boxes-listbox__group-label"
      id={key}
    >
      {children}
    </div>
  );
}

const OptionComponent = forwardRef(({ children, ...props }, ref) => {
  // Filter out visually hidden label
  const [, option] = children;
  return (
    <li
      ref={ref}
      {...props}
    >
      {option}
    </li>
  );
});

export function Example() {
  const [value, setValue] = useState(null);
  const [managedFocus, setManagedFocus] = useState(true);
  const [filteredOptions, onSearch] = useTokenSearch(options);

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
        managedFocus={managedFocus}
        GroupComponent={GroupComponent}
        GroupLabelComponent={GroupLabelComponent}
        OptionComponent={OptionComponent}
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
