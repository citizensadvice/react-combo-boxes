import React, { useState, forwardRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropDownTable } from './drop_down_table';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';

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
    const { getByRole, getAllByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    userEvent.click(getByRole('combobox'));
    userEvent.click(getAllByRole('option')[1]);
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
    const { getByRole, getAllByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />
    ));
    userEvent.click(getByRole('combobox'));
    userEvent.click(getAllByRole('option')[1]);
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
    { name: 'label', html: { className: 'foo' } },
    { name: 'type', html: { className: 'bar' } },
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
    const { getByRole, getAllByRole } = render((
      <DropDownWrapper
        options={options}
        columns={columns}
        onValue={spy}
        mapOption={map}
      />
    ));
    userEvent.click(getByRole('combobox'));
    userEvent.click(getAllByRole('option')[1]);
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

describe('customisation', () => {
  const options = [
    { name: 'Apple', type: 'Fruit', colour: 'Green' },
    { name: 'Banana', type: 'Fruit', colour: 'Yellow' },
    { name: 'Potato', type: 'Vegetable', colour: 'Brown' },
  ];

  const columns = [
    { name: 'name', label: 'Name' },
    { name: 'colour', label: 'Colour' },
    { name: 'type', label: 'Type' },
  ];

  function map({ name, type }) {
    return {
      label: name,
      group: type,
    };
  }

  describe('renderListBox', () => {
    it('allows the list box to be replaced', () => {
      const { getByRole } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderListBox={(props) => <dl data-foo="bar" {...props} />} />,
      );
      userEvent.click(getByRole('combobox'));
      expect(getByRole('listbox').parentNode.tagName).toEqual('DL');
      expect(getByRole('listbox').parentNode).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn(() => null);
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderListBox={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderTable', () => {
    it('allows the table to be replaced', () => {
      const { getByRole } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTable={(props) => <table data-foo="bar" {...props} />} />,
      );
      userEvent.click(getByRole('combobox'));
      expect(getByRole('listbox')).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTable={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderTableHeaderCell', () => {
    it('allows a table header cell to be replaced', () => {
      const { container } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableHeaderCell={(props) => <th data-foo="bar" {...props} />} />,
      );
      const el = container.querySelector('table[role=listbox] > thead > tr > th');
      expect(el).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableHeaderCell={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderTableGroupRow', () => {
    it('allows a table group row to be replaced', () => {
      const { container } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableGroupRow={(props) => <tr data-foo="bar" {...props} />} />,
      );
      const el = container.querySelector('table[role=listbox] > tbody> tr:not([role="option"])');
      expect(el).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableGroupRow={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          group: expect.objectContaining({ label: 'Vegetable' }),
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderTableGroupHeaderCell', () => {
    it('allows a table group header cell to be replaced', () => {
      const { container } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableGroupHeaderCell={(props) => <th data-foo="bar" {...props} />} />,
      );
      const el = container.querySelector('table[role=listbox] > tbody> tr:not([role="option"]) > th');
      expect(el).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableGroupHeaderCell={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          group: expect.objectContaining({ label: 'Vegetable' }),
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderTableRow', () => {
    it('allows a table row to be replaced', () => {
      const { getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableRow={(props) => <tr data-foo="bar" {...props} />} />,
      );
      userEvent.click(getByRole('combobox'));
      expect(getAllByRole('option')[0]).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableRow={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderTableCell', () => {
    it('allows a table cell to be replaced', () => {
      const { getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableCell={(props) => <td data-foo="bar" {...props} />} />,
      );
      userEvent.click(getByRole('combobox'));
      expect(getAllByRole('option')[0].querySelector('td')).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableCell={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderGroupAccessibleLabel', () => {
    it('allows a table cell accessible label to be replaced', () => {
      const { getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderGroupAccessibleLabel={(props) => <kbd data-foo="bar" {...props} />} />,
      );
      userEvent.click(getByRole('combobox'));
      expect(getAllByRole('option')[0].querySelector('td > kbd')).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderGroupAccessibleLabel={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        { children: 'Vegetable ', className: visuallyHiddenClassName },
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });

  describe('renderTableCellColumnAccessibleLabel', () => {
    it('allows a table cell accessible label to be replaced', () => {
      const { getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableCellColumnAccessibleLabel={(props) => <kbd data-foo="bar" {...props} />} />,
      );
      userEvent.click(getByRole('combobox'));
      expect(getAllByRole('option')[0].querySelector('td > kbd')).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderTableCellColumnAccessibleLabel={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        { children: 'Type ', className: visuallyHiddenClassName },
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });

    it('is has empty children if the column is empty', () => {
      const testOptions = [
        { name: 'Apple', type: 'Fruit', colour: '' },
      ];
      const spy = jest.fn();
      render((
        <DropDownWrapper options={testOptions} columns={columns} mapOption={map} renderTableCellColumnAccessibleLabel={spy} test="foo" />
      ));
      expect(spy).toHaveBeenCalledWith(
        { children: null, className: visuallyHiddenClassName },
        expect.objectContaining({
          group: expect.objectContaining({ label: 'Fruit' }),
          option: expect.objectContaining({ label: 'Apple' }),
          column: { label: 'Colour', name: 'colour' },
        }),
        expect.anything(),
      );
    });
  });

  describe('renderColumnValue', () => {
    it('allows a table cell value to be replaced', () => {
      const { getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderColumnValue={(props) => <kbd data-foo="bar" {...props} />} />,
      );
      userEvent.click(getByRole('combobox'));
      expect(getAllByRole('option')[0].querySelector('td > kbd')).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render((
        <DropDownWrapper options={options} columns={columns} mapOption={map} renderColumnValue={spy} test="foo" />
      ));
      expect(spy).toHaveBeenLastCalledWith(
        { children: 'Vegetable' },
        {
          expanded: false,
          search: '',
          currentOption: expect.objectContaining({
            label: 'Apple',
          }),
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({ options: expect.any(Array), test: 'foo', columns: expect.any(Array) }),
      );
    });
  });
});
