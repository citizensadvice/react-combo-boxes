import React, { forwardRef, useState } from 'react';
import { ComboBox, useTokenSearch } from '../../../src';

const options = [
  'Apple',
  'Orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
];

const ListBoxList = forwardRef(({ hidden, className, ...props }, ref) => (
  <div
    className={className}
    hidden={hidden}
  >
    <ul
      ref={ref}
      className="reset-list"
      {...props}
    />
    <div className="list-footer">
      <a href="https://en.wikipedia.org/wiki/Fruit">
        More about fruit
      </a>
    </div>
  </div>
));

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(options);

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
        ListBoxListComponent={ListBoxList}
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
