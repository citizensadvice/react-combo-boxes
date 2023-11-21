import { useRef, useState } from 'react';
import { DropDown } from '../../../src';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
];

function renderGroup(props, { groupChildren, group: { key, label } }) {
  return (
    <li
      role="group"
      aria-labelledby={key}
      key={key}
    >
      <div
        className="react-combo-boxes-dropdown__group-label"
        id={key}
      >
        {label}
      </div>
      <ul
        role="presentation"
        className="react-combo-boxes-dropdown__group"
      >
        {groupChildren}
      </ul>
    </li>
  );
}

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
        renderGroup={renderGroup}
        renderGroupAccessibleLabel={() => null}
      />

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setManagedFocus(checked)}
          checked={managedFocus}
        />{' '}
        Toggle managed focus
      </label>

      <label htmlFor="output">Current value</label>
      <output
        htmlFor="drop-down"
        id="output"
      >
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
