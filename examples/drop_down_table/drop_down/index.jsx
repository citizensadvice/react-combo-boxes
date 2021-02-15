import React, { useRef, useState } from 'react';
import { DropDownTable, useConfineListBox } from '../../../src';
import cats from '../../data/cats.json';

const columns = ['breed', 'country', 'origin', 'bodyType', 'coatLength', 'pattern'];

function mapOption({ breed }) {
  return { label: breed };
}

export function Example() {
  const [value, setValue] = useState(null);
  const ref = useRef();
  const [style, onLayoutListBox] = useConfineListBox();

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
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="drop-down" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
