import { useState, forwardRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBoxTable } from './combo_box_table';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name';

const ComboBoxWrapper = forwardRef(({ value: initialValue, ...props }, ref) => {
  const [value, onValue] = useState(initialValue);
  return (
    <ComboBoxTable
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
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('allows selection by click', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />,
    );
    await userEvent.tab();
    await userEvent.click(screen.getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({
      label: 'Banana',
      type: 'Fruit',
      colour: 'Yellow',
    });
  });

  it('allows selection by keyboard', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(spy).toHaveBeenCalledWith({
      label: 'Banana',
      type: 'Fruit',
      colour: 'Yellow',
    });
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
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('allows selection by click', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />,
    );
    await userEvent.tab();
    await userEvent.click(screen.getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({
      label: 'Banana',
      type: 'Fruit',
      colour: 'Yellow',
    });
  });

  it('allows selection by keyboard', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
        onValue={spy}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(spy).toHaveBeenCalledWith({
      label: 'Banana',
      type: 'Fruit',
      colour: 'Yellow',
    });
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
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
      />,
    );
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
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

describe('cells with class names', () => {
  const options = [
    { label: 'Apple', type: 'Fruit', colour: 'Green' },
    { label: 'Banana', type: 'Fruit', colour: 'Yellow' },
    { label: 'Potato', type: 'Vegetable', colour: 'Brown' },
  ];

  const columns = [
    { name: 'label', label: 'Foo', cellClass: 'foo' },
    { name: 'type', label: 'Bar', cellClass: 'bar' },
  ];

  it('renders a table with colgroups', () => {
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
      />,
    );
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
    const { container } = render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
        mapOption={map}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('allows selection by click', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
        onValue={spy}
        mapOption={map}
      />,
    );
    await userEvent.tab();
    await userEvent.click(screen.getByRole('option', { name: /Banana/ }));
    expect(spy).toHaveBeenCalledWith({
      name: 'Banana',
      type: 'Fruit',
      colour: 'Yellow',
    });
  });

  it('allows selection by keyboard', async () => {
    const spy = jest.fn();
    render(
      <ComboBoxWrapper
        options={options}
        columns={columns}
        onValue={spy}
        mapOption={map}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(spy).toHaveBeenCalledWith({
      name: 'Banana',
      type: 'Fruit',
      colour: 'Yellow',
    });
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

  describe('renderTableWrapper', () => {
    it('allows the list box to be replaced', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableWrapper={(props) => (
            <dl
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      await userEvent.tab();
      expect(screen.getByRole('listbox').parentNode.tagName).toEqual('DL');
      expect(screen.getByRole('listbox').parentNode).toHaveAttribute(
        'data-foo',
        'bar',
      );
    });

    it('is called with context and props', () => {
      const spy = jest.fn(() => null);
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableWrapper={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderTable', () => {
    it('allows the table to be replaced', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTable={(props) => (
            <table
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      await userEvent.tab();
      expect(screen.getByRole('listbox')).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTable={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderTableHeaderCell', () => {
    it('allows a table header cell to be replaced', () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableHeaderCell={(props) => (
            <th
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      const el = document.querySelector(
        'table[role=listbox] > thead > tr > th',
      );
      expect(el).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableHeaderCell={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderTableGroupRow', () => {
    it('allows a table group row to be replaced', () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableGroupRow={(props) => (
            <tr
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      const el = document.querySelector(
        'table[role=listbox] > tbody> tr:not([role="option"])',
      );
      expect(el).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableGroupRow={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          group: expect.objectContaining({ label: 'Vegetable' }),
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderTableGroupHeaderCell', () => {
    it('allows a table group header cell to be replaced', () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableGroupHeaderCell={(props) => (
            <th
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      const el = document.querySelector(
        'table[role=listbox] > tbody> tr:not([role="option"]) > th',
      );
      expect(el).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableGroupHeaderCell={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          group: expect.objectContaining({ label: 'Vegetable' }),
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderTableRow', () => {
    it('allows a table row to be replaced', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableRow={(props) => (
            <tr
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      await userEvent.tab();
      expect(screen.getAllByRole('option')[0]).toHaveAttribute(
        'data-foo',
        'bar',
      );
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableRow={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderTableCell', () => {
    it('allows a table cell to be replaced', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableCell={(props) => (
            <td
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      await userEvent.tab();
      expect(
        screen.getAllByRole('option')[0].querySelector('td'),
      ).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableCell={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderGroupAccessibleLabel', () => {
    it('allows a table cell accessible label to be replaced', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderGroupAccessibleLabel={(props) => (
            <kbd
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      expect(
        screen.getAllByRole('option')[0].querySelector('td > kbd'),
      ).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderGroupAccessibleLabel={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        { children: 'Vegetable\u00A0', className: visuallyHiddenClassName },
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });

  describe('renderTableCellColumnAccessibleLabel', () => {
    it('allows a table cell accessible label to be replaced', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableCellColumnAccessibleLabel={(props) => (
            <kbd
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      expect(
        screen.getAllByRole('option')[0].querySelector('td > kbd'),
      ).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderTableCellColumnAccessibleLabel={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        { children: 'Type\u00A0', className: visuallyHiddenClassName },
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });

    it('is has empty children if the column is empty', () => {
      const testOptions = [{ name: 'Apple', type: 'Fruit', colour: '' }];
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={testOptions}
          columns={columns}
          mapOption={map}
          renderTableCellColumnAccessibleLabel={spy}
          test="foo"
        />,
      );
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
    it('allows a table cell value to be replaced', async () => {
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderColumnValue={(props) => (
            <kbd
              data-foo="bar"
              {...props}
            />
          )}
        />,
      );
      await userEvent.tab();
      expect(
        screen.getAllByRole('option')[0].querySelector('td > kbd'),
      ).toHaveAttribute('data-foo', 'bar');
    });

    it('is called with context and props', () => {
      const spy = jest.fn();
      render(
        <ComboBoxWrapper
          options={options}
          columns={columns}
          mapOption={map}
          renderColumnValue={spy}
          test="foo"
        />,
      );
      expect(spy).toHaveBeenLastCalledWith(
        { children: 'Vegetable' },
        {
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          search: null,
          currentOption: null,
          notFound: false,
          suggestedOption: null,
          group: expect.objectContaining({ label: 'Vegetable' }),
          option: expect.objectContaining({ label: 'Potato' }),
          selected: false,
          column: { label: 'Type', name: 'type' },
        },
        expect.objectContaining({
          options: expect.any(Array),
          test: 'foo',
          columns: expect.any(Array),
        }),
      );
    });
  });
});
