import React, { useState, forwardRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropDownTable } from './drop_down_table';

const DropDownWrapper = forwardRef(({ value: initialValue, ...props }, ref) => {
  const [value, onValue] = useState(initialValue);
  return (
    <DropDownTable
      id="id"
      aria-labelledby="id-label"
      value={value}
      onValue={onValue}
      {...props}
      ref={ref}
    />
  );
});

describe('columns as names only', () => {
  const options = [
    { label: 'Apple', type: 'Fruit', colour: 'Green' },
    { label: 'Banana', type: 'Fruit', colour: 'Yellow' },
    { label: 'Potato', type: 'Vegetable', colour: 'Brown' },
    { label: 'Tomato', type: 'Vegetable', colour: 'Red', disabled: true },
  ];

  const columns = ['label', 'type'];

  it('renders a table as the list box', () => {
    const { container } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
      />
    ));
    expect(container).toMatchSnapshot();
  });

  it('allows selection by click', () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    userEvent.click(getByRole('combobox'));
    userEvent.click(getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });

  it('allows selection by keyboard', () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));

    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'Enter' });

    expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });
});

describe('columns with headers', () => {
  const options = [
    { label: 'Apple', type: 'Fruit', colour: 'Green' },
    { label: 'Banana', type: 'Fruit', colour: 'Yellow' },
    { label: 'Potato', type: 'Vegetable', colour: 'Brown' },
  ];

  const columns = [
    { name: 'label', label: 'Name' },
    { name: 'type', label: 'Type' },
  ];

  it('renders a table with headers', () => {
    const { container } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
      />
    ));
    expect(container).toMatchSnapshot();
  });

  it('allows selection by click', () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    userEvent.click(getByRole('combobox'));
    userEvent.click(getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });

  it('allows selection by keyboard', () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'Enter' });

    expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });
});

describe('columns with html', () => {
  const options = [
    { label: 'Apple', type: 'Fruit', colour: 'Green' },
    { label: 'Banana', type: 'Fruit', colour: 'Yellow' },
    { label: 'Potato', type: 'Vegetable', colour: 'Brown' },
  ];

  const columns = [
    { name: 'label', colHtml: { className: 'foo' } },
    { name: 'type', colHtml: { className: 'bar' } },
  ];

  it('renders a table with colgroups', () => {
    const { container } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
      />
    ));
    expect(container).toMatchSnapshot();
  });
});

describe('cells with html', () => {
  const options = [
    { label: 'Apple', type: 'Fruit', colour: 'Green' },
    { label: 'Banana', type: 'Fruit', colour: 'Yellow' },
    { label: 'Potato', type: 'Vegetable', colour: 'Brown' },
  ];

  const columns = [
    { name: 'label', cellHtml: { className: 'foo' } },
    { name: 'type', cellHtml: { className: 'bar' } },
  ];

  it('renders a table with colgroups', () => {
    const { container } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
      />
    ));
    expect(container).toMatchSnapshot();
  });
});

describe('grouped', () => {
  const options = [
    { name: 'Apple', type: 'Fruit', colour: 'Green' },
    { name: 'Banana', type: 'Fruit', colour: 'Yellow' },
    { name: 'Potato', type: 'Vegetable', colour: 'Brown' },
  ];

  const columns = ['name', 'colour'];

  function map({ name, type }) {
    return {
      label: name,
      group: type,
    };
  }

  it('renders a table with groups', () => {
    const { container } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        mapOption={map}
      />
    ));
    expect(container).toMatchSnapshot();
  });

  it('allows selection by click', () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
        mapOption={map}
      />
    ));
    userEvent.click(getByRole('combobox'));
    userEvent.click(getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({ name: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });

  it('allows selection by keyboard', () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
        mapOption={map}
      />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'Enter' });

    expect(spy).toHaveBeenCalledWith({ name: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });
});
