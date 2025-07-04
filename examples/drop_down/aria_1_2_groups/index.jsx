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
      key={key}
      role="group"
      aria-labelledby={key}
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

function renderOption({ key, 'aria-labelledby': _, ...props }) {
  return (
    <li
      key={key}
      {...props}
    />
  );
}

export function Example() {
  const [value, setValue] = useState(null);
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
        renderGroup={renderGroup}
        renderOption={renderOption}
      />

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
