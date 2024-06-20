import { useState, forwardRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';

const Test = forwardRef(({ value: initialValue, ...props }, ref) => {
  const [value, setValue] = useState(initialValue);
  return (
    <Select
      value={value}
      onValue={setValue}
      {...props}
      ref={ref}
    />
  );
});

const TestMulitple = forwardRef(({ values: initialValues, ...props }, ref) => {
  const [values, setValues] = useState(initialValues);
  return (
    <Select
      multiple
      values={values}
      onValues={setValues}
      {...props}
      ref={ref}
    />
  );
});

describe('options', () => {
  describe('as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders an select', () => {
      const { container } = render(<Select options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('renders a select with a selected value', () => {
      render(
        <Test
          options={options}
          value="Orange"
        />,
      );
      expect(screen.getByRole('combobox')).toHaveValue('Orange');
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: 'Banana' }),
      );
      expect(spy).toHaveBeenCalledWith('Banana');
    });

    it('triggers the onChange callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onChange={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: 'Banana' }),
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            nodeName: 'SELECT',
            value: 'Banana',
          }),
        }),
      );
    });

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: 'Apple' }),
      );
      expect(screen.getByRole('combobox')).toHaveValue('Apple');
    });

    it('triggers onValue when selecting an empty string', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={['foo', '']}
          onValue={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getAllByRole('option')[1],
      );
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('options as array of numbers', () => {
    const options = [0, 1, 2, 3];

    it('renders an select', () => {
      const { container } = render(<Test options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: '2' }),
      );
      expect(spy).toHaveBeenCalledWith(2);
    });

    it('triggers the onChange callback with the selected value', async () => {
      const spy = jest.fn((e) => e.persist());
      render(
        <Test
          options={options}
          onChange={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: '2' }),
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            nodeName: 'SELECT',
            value: '2',
          }),
        }),
      );
    });

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: '1' }),
      );
      expect(screen.getByRole('combobox')).toHaveValue('1');
    });

    it('triggers onValue when selecting 0', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getByRole('option', { name: '0' }),
      );
      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  describe('options as null', () => {
    const options = ['foo', null];

    it('renders an select', () => {
      const { container } = render(<Test options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getAllByRole('option')[1],
      );
      expect(spy).toHaveBeenCalledWith(null);
    });

    it('triggers the onChange callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          value="foo"
          onChange={spy}
        />,
      );
      const option = screen.getAllByRole('option')[1];
      await userEvent.selectOptions(screen.getByRole('combobox'), option);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          target: screen.getByRole('combobox'),
        }),
      );
    });

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getAllByRole('option')[1],
      );
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });

  describe('options as undefined', () => {
    const options = ['foo', undefined];

    it('renders an select', () => {
      const { container } = render(<Test options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getAllByRole('option')[1],
      );
      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('triggers the onChange callback with the selected value', async () => {
      const spy = jest.fn((e) => e.persist());
      render(
        <Test
          options={options}
          onChange={spy}
        />,
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getAllByRole('option')[1],
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            nodeName: 'SELECT',
            value: '',
          }),
        }),
      );
    });

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        screen.getAllByRole('option')[1],
      );
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });

  describe('options as array of objects', () => {
    describe('label', () => {
      const options = [
        { label: 'Apple' },
        { label: 'Banana' },
        { label: 'Orange' },
      ];

      it('renders an select', () => {
        const { container } = render(<Test options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('triggers the onValue callback with the selected value', async () => {
        const spy = jest.fn();
        render(
          <Test
            options={options}
            onValue={spy}
          />,
        );
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Banana' }),
        );
        expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
      });

      it('triggers the onChange callback with the selected value', async () => {
        const spy = jest.fn((e) => e.persist());
        render(
          <Test
            options={options}
            onChange={spy}
          />,
        );
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Banana' }),
        );
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            target: expect.objectContaining({
              nodeName: 'SELECT',
              value: 'Banana',
            }),
          }),
        );
      });

      it('updates when the value changes', async () => {
        render(<Test options={options} />);
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Banana' }),
        );
        expect(screen.getByRole('combobox')).toHaveValue('Banana');
      });
    });

    describe('value', () => {
      it('is used as a options identity', async () => {
        const options = [
          { label: 'foo', value: 1 },
          { label: 'foo', value: 2 },
          { label: 'foo', value: 3 },
        ];
        const spy = jest.fn();
        render(
          <Test
            options={options}
            value={2}
            onValue={spy}
          />,
        );
        expect(screen.getByRole('combobox')).toHaveValue('2');
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getAllByRole('option')[2],
        );
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', async () => {
        const options = [
          { label: 'foo', id: 1 },
          { label: 'foo', id: 2 },
          { label: 'foo', id: 3 },
        ];
        const spy = jest.fn();
        render(
          <Test
            options={options}
            value={2}
            onValue={spy}
          />,
        );
        expect(screen.getByRole('combobox')).toHaveValue('2');
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getAllByRole('option')[2],
        );
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('disabled', () => {
      it('sets the disabled attribute', () => {
        const options = [{ label: 'foo', disabled: true }];
        render(<Test options={options} />);
        expect(screen.getAllByRole('option')[0]).toBeDisabled();
      });
    });

    describe('html', () => {
      it('sets attributes on the element', () => {
        const options = [
          { label: 'foo', html: { 'data-foo': 'bar', className: 'class' } },
        ];
        render(<Test options={options} />);
        expect(screen.getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(screen.getByRole('option')).toHaveClass('class');
      });
    });

    describe('group', () => {
      const options = [
        { label: 'Apple' },
        { label: 'Orange', group: 'Citrus' },
        { label: 'Lemon', group: 'Citrus' },
        { label: 'Raspberry', group: 'Berry' },
        { label: 'Strawberry', group: 'Berry' },
      ];

      it('renders grouped options', () => {
        const { container } = render(<Test options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('triggers the onValue callback with the selected value', async () => {
        const spy = jest.fn();
        render(
          <Test
            options={options}
            onValue={spy}
          />,
        );
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Lemon' }),
        );
        expect(spy).toHaveBeenCalledWith({ label: 'Lemon', group: 'Citrus' });
      });

      it('triggers the onChange callback with the selected value', async () => {
        const spy = jest.fn((e) => e.persist());
        render(
          <Test
            options={options}
            onChange={spy}
          />,
        );
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Lemon' }),
        );
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            target: expect.objectContaining({
              nodeName: 'SELECT',
              value: 'Lemon',
            }),
          }),
        );
      });

      it('updates when the value changes', async () => {
        render(<Test options={options} />);
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Lemon' }),
        );
        expect(screen.getByRole('combobox')).toHaveValue('Lemon');
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        render(<Test options={options} />);
        expect(screen.getByRole('combobox')).not.toHaveAttribute(
          'data-foo',
          'bar',
        );
      });
    });
  });

  describe('mapOption', () => {
    describe('mapOption returns an object', () => {
      const options = [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' },
      ];

      it('maps options', async () => {
        const spy = jest.fn();
        render(
          <Test
            options={options}
            onValue={spy}
            mapOption={({ name }) => ({ label: name })}
          />,
        );
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Orange' }),
        );
        expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
      });

      it('selects a mapped option', async () => {
        render(
          <Test
            options={options}
            value={{ name: 'Banana' }}
            mapOption={({ name }) => ({ label: name })}
          />,
        );
        expect(screen.getByRole('combobox')).toHaveValue('Banana');
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Orange' }),
        );
        expect(screen.getByRole('combobox')).toHaveValue('Orange');
      });

      it('accepts value as a primative', () => {
        render(
          <Test
            options={options}
            value="Banana"
            mapOption={({ name }) => ({ label: name })}
          />,
        );
        expect(screen.getByRole('combobox')).toHaveValue('Banana');
      });
    });

    describe('mapOption returns a string', () => {
      const options = [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' },
      ];

      it('maps options', async () => {
        const spy = jest.fn();
        render(
          <Test
            options={options}
            onValue={spy}
            mapOption={({ name }) => name}
          />,
        );
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Orange' }),
        );
        expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
      });

      it('selects a mapped option', async () => {
        render(
          <Test
            options={options}
            value={{ name: 'Banana' }}
            mapOption={({ name }) => name}
          />,
        );
        expect(screen.getByRole('combobox')).toHaveValue('Banana');
        await userEvent.selectOptions(
          screen.getByRole('combobox'),
          screen.getByRole('option', { name: 'Orange' }),
        );
        expect(screen.getByRole('combobox')).toHaveValue('Orange');
      });

      it('accepts value as a primative', () => {
        render(
          <Test
            options={options}
            value="Banana"
            mapOption={({ name }) => name}
          />,
        );
        expect(screen.getByRole('combobox')).toHaveValue('Banana');
      });
    });
  });
});

describe('id', () => {
  it('passes the id', () => {
    render(
      <Test
        options={['Apple', 'Banana']}
        id="foo"
      />,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'foo');
  });
});

describe('multiple', () => {
  describe('string options', () => {
    const options = ['Apple', 'Banana', 'Orange', 'Grape'];

    it('allows multiple options to be selected', async () => {
      render(
        <TestMulitple
          options={options}
          values={['Banana']}
        />,
      );
      const select = screen.getByRole('listbox');
      expect(select).toHaveValue(['Banana']);
      await userEvent.selectOptions(select, [
        screen.getByRole('option', { name: 'Orange' }),
        screen.getByRole('option', { name: 'Apple' }),
      ]);
      expect(select).toHaveValue(['Apple', 'Banana', 'Orange']);
    });

    it('allows options to be deselected', async () => {
      render(
        <TestMulitple
          options={options}
          values={['Banana']}
        />,
      );
      const select = screen.getByRole('listbox');
      expect(select).toHaveValue(['Banana']);
      await userEvent.deselectOptions(select, [
        screen.getByRole('option', { name: 'Banana' }),
      ]);
      expect(select).toHaveValue([]);
    });

    it('updates options', () => {
      const { rerender } = render(
        <TestMulitple
          options={options}
          values={['Banana', 'Pear']}
        />,
      );
      const select = screen.getByRole('listbox');
      expect(select).toHaveValue(['Banana']);
      rerender(
        <TestMulitple
          options={[...options, 'Pear']}
          values={['Banana', 'Pear']}
        />,
      );
      expect(select).toHaveValue(['Banana', 'Pear']);
    });
  });

  describe('object options', () => {
    const options = [
      { label: 'Apple' },
      { label: 'Banana' },
      { label: 'Orange' },
    ];

    it('allows multiple options to be selected', async () => {
      render(
        <TestMulitple
          options={options}
          values={['Banana']}
        />,
      );
      const select = screen.getByRole('listbox');
      expect(select).toHaveValue(['Banana']);
      await userEvent.selectOptions(select, [
        screen.getByRole('option', { name: 'Orange' }),
        screen.getByRole('option', { name: 'Apple' }),
      ]);
      expect(select).toHaveValue(['Apple', 'Banana', 'Orange']);
    });

    it('allows a disabled option to be marked as selected', () => {
      render(
        <TestMulitple
          options={[{ label: 'Banana', disabled: true }]}
          values={['Banana']}
        />,
      );
      const select = screen.getByRole('listbox');
      expect(select).toHaveValue(['Banana']);
    });
  });
});

describe('placeholderOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a placeholder option', () => {
    render(
      <Test
        options={options}
        placeholderOption="Please select…"
      />,
    );
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Please select…');
  });

  it('renders with a selected value', () => {
    render(
      <Test
        options={options}
        placeholderOption="Please select…"
        value="Orange"
      />,
    );
    expect(screen.getByRole('combobox')).toHaveValue('Orange');
  });

  it('renders a blank placeholder option', () => {
    render(
      <Test
        options={options}
        placeholderOption=""
      />,
    );
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveDisplayValue('');
  });
});

describe('renderOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('allows additional props to be added to all options', () => {
    render(
      <Test
        options={options}
        renderOption={({ key, ...props }) => (
          <option
            key={key}
            {...props}
            data-foo="bar"
          />
        )}
      />,
    );
    screen.getAllByRole('option').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });

  it('is called with context and props', () => {
    const spy = jest.fn();
    render(
      <Test
        options={options}
        renderOption={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        option: expect.objectContaining({ label: 'Orange' }),
        group: undefined,
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('renderOptGroup', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Orange', group: 'Citrus' },
    { label: 'Lemon', group: 'Citrus' },
    { label: 'Raspberry', group: 'Berry' },
    { label: 'Strawberry', group: 'Berry' },
  ];

  it('allows additional props to be added to all options', () => {
    render(
      <Test
        options={options}
        renderOptGroup={({ key, ...props }) => (
          <optgroup
            key={key}
            {...props}
            data-foo="bar"
          />
        )}
      />,
    );
    screen.getAllByRole('group').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });

  it('is called with state and props', () => {
    const spy = jest.fn();
    render(
      <Test
        options={options}
        renderOptGroup={spy}
        test="foo"
      />,
    );

    expect(spy).toHaveBeenLastCalledWith(
      expect.any(Object),
      {
        group: expect.objectContaining({ label: 'Berry' }),
      },
      expect.objectContaining({ options: expect.any(Array), test: 'foo' }),
    );
  });
});

describe('additional props', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('includes them on the select', () => {
    render(
      <Test
        options={options}
        required
        data-foo="bar"
      />,
    );
    expect(screen.getByRole('combobox')).toBeRequired();
    expect(screen.getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ref', () => {
  it('references the select for an object ref', () => {
    const ref = { current: null };
    render(
      <Test
        options={['foo']}
        ref={ref}
      />,
    );
    expect(ref.current).toEqual(screen.getByRole('combobox'));
  });

  it('references the combobox for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    render(
      <Test
        options={['foo']}
        ref={ref}
      />,
    );
    expect(value).toEqual(screen.getByRole('combobox'));
  });
});
