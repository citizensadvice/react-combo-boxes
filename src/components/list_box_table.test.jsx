import React, { useState, useContext, forwardRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBox } from './combo_box';
import { ListBoxTable } from './list_box_table';
import { Context } from '../context';

const ComboBoxWrapper = forwardRef(({ value: initialValue, ...props }, ref) => {
  const [value, onValue] = useState(initialValue);
  return (
    <ComboBox id="id" value={value} onValue={onValue} {...props} ref={ref} />
  );
});

describe('used with a combo box', () => {
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
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
        />
      ));
      expect(container).toMatchSnapshot();
    });

    it('allows selection by click', () => {
      const spy = jest.fn();
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
          onValue={spy}
        />
      ));
      getByRole('combobox').focus();
      userEvent.click(getAllByRole('option')[1]);
      expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
    });

    it('allows selection by keyboard', () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
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
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
        />
      ));
      expect(container).toMatchSnapshot();
    });

    it('allows selection by click', () => {
      const spy = jest.fn();
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
          onValue={spy}
        />
      ));
      getByRole('combobox').focus();
      userEvent.click(getAllByRole('option')[1]);
      expect(spy).toHaveBeenCalledWith({ label: 'Banana', type: 'Fruit', colour: 'Yellow' });
    });

    it('allows selection by keyboard', () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
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
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
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
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
          mapOption={map}
        />
      ));
      expect(container).toMatchSnapshot();
    });

    it('allows selection by click', () => {
      const spy = jest.fn();
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
          onValue={spy}
          mapOption={map}
        />
      ));
      getByRole('combobox').focus();
      userEvent.click(getAllByRole('option')[1]);
      expect(spy).toHaveBeenCalledWith({ name: 'Banana', type: 'Fruit', colour: 'Yellow' });
    });

    it('allows selection by keyboard', () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
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
    ];

    function map({ name, type }) {
      return {
        label: name,
        group: type,
      };
    }

    it('adds props to the components', () => {
      const { container } = render((
        <ComboBoxWrapper
          options={options}
          columns={columns}
          ListBoxComponent={ListBoxTable}
          mapOption={map}
          listBoxListProps={{ className: 'listbox' }}
          tableProps={{ className: 'table' }}
          tableHeaderProps={{ className: 'table-header' }}
          tableGroupRowProps={{ className: 'table-group-row' }}
          tableGroupHeaderProps={{ className: 'table-group-header' }}
          tableRowProps={{ className: 'table-row' }}
          tableCellProps={{ className: 'table-cell' }}
        />
      ));

      expect(container.querySelector('table').parentNode).toHaveClass('listbox');
      expect(container.querySelector('table')).toHaveClass('table');
      expect(container.querySelector('th')).toHaveClass('table-header');
      expect(container.querySelector('tbody tr:first-child')).toHaveClass('table-group-row');
      expect(container.querySelector('th[colspan]')).toHaveClass('table-group-header');
      expect(container.querySelector('tbody tr:nth-child(2)')).toHaveClass('table-row');
      expect(container.querySelector('td')).toHaveClass('table-cell');
    });

    describe('ListBoxListComponent', () => {
      it('allows the list box to be replaced', () => {
        const { container } = render((
          <ComboBoxWrapper
            options={options}
            columns={columns}
            ListBoxComponent={ListBoxTable}
            mapOption={map}
            ListBoxListComponent="dl"
          />
        ));

        expect(container.querySelector('table').parentNode.tagName).toEqual('DL');
      });
    });

    describe('visuallyHiddenClassName', () => {
      it('allows custom props', () => {
        const { getAllByRole, getByRole } = render((
          <ComboBoxWrapper
            options={options}
            columns={columns}
            ListBoxComponent={ListBoxTable}
            mapOption={map}
            visuallyHiddenClassName="bar"
          />
        ));
        getByRole('combobox').focus();
        expect(getAllByRole('option')[0].firstChild.firstChild).toHaveClass('bar');
      });
    });

    describe('ValueComponent', () => {
      it('allows the component to be replaced', () => {
        const { getByRole, container } = render((
          <ComboBoxWrapper
            options={options}
            columns={columns}
            ListBoxComponent={ListBoxTable}
            mapOption={map}
            ValueComponent="dl"
          />
        ));
        getByRole('combobox').focus();
        expect(container.querySelector('td > dl')).toHaveTextContent('Apple');
      });

      it('gives access to the context', () => {
        const spy = jest.fn();

        const ValueComponent = forwardRef((props, _) => {
          const context = useContext(Context);
          spy(context);
          return (
            <div {...props} />
          );
        });

        render((
          <ComboBoxWrapper
            options={options}
            columns={columns}
            ListBoxComponent={ListBoxTable}
            mapOption={map}
            ValueComponent={ValueComponent}
            foo="bar"
          />
        ));

        expect(spy).toHaveBeenCalledWith({
          'aria-autocomplete': 'none',
          'aria-busy': false,
          expanded: false,
          notFound: false,
          currentOption: null,
          search: null,
          suggestedOption: null,
          selected: false,
          props: expect.objectContaining({
            foo: 'bar',
            options: expect.any(Array),
            value: null,
          }),
          group: expect.objectContaining({
            label: 'Fruit',
            options: expect.any(Array),
          }),
          option: expect.objectContaining({
            label: 'Apple',
            group: expect.objectContaining({
              label: 'Fruit',
            }),
          }),
          columns: [
            { label: 'Name', name: 'name' },
            { label: 'Colour', name: 'colour' },
          ],
          column: {
            label: 'Name', name: 'name',
          },
        });
      });
    });

    describe('valueProps', () => {
      it('allows the props to be amended', () => {
        const { getByRole, container } = render((
          <ComboBoxWrapper
            options={options}
            columns={columns}
            ListBoxComponent={ListBoxTable}
            mapOption={map}
            ValueComponent="dl"
            valueProps={{ className: 'foo' }}
          />
        ));
        getByRole('combobox').focus();
        expect(container.querySelector('td > dl')).toHaveClass('foo');
      });
    });
  });
});
