/* eslint-disable testing-library/no-node-access */

import React, { useState, forwardRef } from 'react';
import { render, screen } from '@testing-library/react';
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

  it('allows selection by click', async () => {
    const spy = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });

  it('allows selection by keyboard', async () => {
    const spy = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));

    screen.getByRole('combobox').focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

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

  it('allows selection by click', async () => {
    const spy = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });

  it('allows selection by keyboard', async () => {
    const spy = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    screen.getByRole('combobox').focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

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

  it('allows selection by click', async () => {
    const spy = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
        mapOption={map}
      />
    ));
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({ name: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });

  it('allows selection by keyboard', async () => {
    const spy = jest.fn();
    render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
        mapOption={map}
      />
    ));
    screen.getByRole('combobox').focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(spy).toHaveBeenCalledWith({ name: 'Banana', type: 'Fruit', colour: 'Yellow' });
  });
});
