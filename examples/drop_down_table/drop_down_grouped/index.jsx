import React, { useRef, useState } from 'react';
import { DropDownTable, useConfineListBox } from '../../../src';
import cats from '../../data/cats.json';

const columns = ['breed', 'country', 'origin', 'bodyType', 'pattern'];

function mapOption({ breed, coatLength }) {
  return { label: breed, group: coatLength };
}

export function Example() {
  const [value, setValue] = useState(null);
  const ref = useRef();
  const [style, onLayoutListBox] = useConfineListBox();
  const [managedFocus, setManagedFocus] = useState(true);

  return (
    <>
      <div
        className="label"
        onClick={() => ref.current.focus()}
        id="drop-down-label"
      >
        Drop down
      </div>
      <DropDownTable
        id="drop-down"
        aria-labelledby="drop-down-label"
        ref={ref}
        value={value}
        onValue={setValue}
        onLayoutListBox={onLayoutListBox}
        options={cats}
        renderListBox={(props) => <div style={style} {...props} />}
        columns={columns}
        mapOption={mapOption}
        managedFocus={managedFocus}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="drop-down" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setManagedFocus(checked)}
          checked={managedFocus}
        />
        {' '}
        Toggle managed focus
      </label>
    </>
  );
}
