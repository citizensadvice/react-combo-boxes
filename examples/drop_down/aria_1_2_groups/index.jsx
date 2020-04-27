import React, { forwardRef, useContext, useRef, useState } from 'react';
import { DropDown, Context } from '../../../src';

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
  const ref = useRef();
  return (
    <>
      <div
        className="label"
        onClick={() => ref.current.focus()}
        id="drop-down-label"
      >
        Drop down
      </div>
      <DropDown
        id="drop-down"
        ref={ref}
        aria-labelledby="drop-down-label"
        value={value}
        onValue={setValue}
        options={options}
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
      <output htmlFor="drop-down" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
