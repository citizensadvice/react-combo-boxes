import React, { useState, forwardRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Select } from './select';

const SelectWrapper = forwardRef(({ value: initialValue, ...props }, ref) => {
  const [value, setValue] = useState(initialValue);
  return (
    <Select value={value} onValue={setValue} {...props} ref={ref} />
  );
});

describe('options', () => {
  describe('as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders an select', () => {
      const { container } = render(
        <Select options={options} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders a select with a selected value', () => {
      const { getByRole } = render(
        <SelectWrapper options={options} value="Orange" />,
      );
      expect(getByRole('combobox')).toHaveValue('Orange');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: 'Banana' } });
      expect(spy).toHaveBeenCalledWith('Banana');
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      const { getByRole } = render(<SelectWrapper options={options} onChange={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: 'Banana' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: 'Banana',
        }),
      }));
    });

    it('updates when the value changes', () => {
      const { getByRole } = render(<SelectWrapper options={options} />);
      fireEvent.change(getByRole('combobox'), { target: { value: 'Apple' } });
      expect(getByRole('combobox')).toHaveValue('Apple');
    });

    it('triggers onValue when selecting an empty string', () => {
      const spy = jest.fn();
      const { getByRole } = render(<SelectWrapper options={['foo', '']} onValue={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('options as array of numbers', () => {
    const options = [0, 1, 2, 3];

    it('renders an select', () => {
      const { container } = render(
        <SelectWrapper options={options} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '2' } });
      expect(spy).toHaveBeenCalledWith(2);
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      const { getByRole } = render(<SelectWrapper options={options} onChange={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '2' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: '2',
        }),
      }));
    });

    it('updates when the value changes', () => {
      const { getByRole } = render(<SelectWrapper options={options} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '1' } });
      expect(getByRole('combobox')).toHaveValue('1');
    });

    it('triggers onValue when selecting 0', () => {
      const spy = jest.fn();
      const { getByRole } = render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '0' } });
      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  describe('options as null', () => {
    const options = ['foo', null];

    it('renders an select', () => {
      const { container } = render(
        <SelectWrapper options={options} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(null);
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      const { getByRole } = render(<SelectWrapper options={options} value="foo" onChange={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: '',
        }),
      }));
    });

    it('updates when the value changes', () => {
      const { getByRole } = render(<SelectWrapper options={options} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '' } });
      expect(getByRole('combobox')).toHaveValue('');
    });
  });

  describe('options as undefined', () => {
    const options = ['foo', undefined];

    it('renders an select', () => {
      const { container } = render(
        <SelectWrapper options={options} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      const { getByRole } = render(<SelectWrapper options={options} onChange={spy} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: '',
        }),
      }));
    });

    it('updates when the value changes', () => {
      const { getByRole } = render(<SelectWrapper options={options} />);
      fireEvent.change(getByRole('combobox'), { target: { value: '' } });
      expect(getByRole('combobox')).toHaveValue('');
    });
  });

  describe('options as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders an select', () => {
        const { container } = render(
          <SelectWrapper options={options} />,
        );
        expect(container).toMatchSnapshot();
      });

      it('triggers the onValue callback with the selected value', () => {
        const spy = jest.fn();
        const { getByRole } = render(<SelectWrapper options={options} onValue={spy} />);
        fireEvent.change(getByRole('combobox'), { target: { value: 'Banana' } });
        expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
      });

      it('triggers the onChange callback with the selected value', () => {
        const spy = jest.fn((e) => e.persist());
        const { getByRole } = render(<SelectWrapper options={options} onChange={spy} />);
        fireEvent.change(getByRole('combobox'), { target: { value: 'Banana' } });
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
          target: expect.objectContaining({
            nodeName: 'SELECT',
            value: 'Banana',
          }),
        }));
      });

      it('updates when the value changes', () => {
        const { getByRole } = render(<SelectWrapper options={options} />);
        fireEvent.change(getByRole('combobox'), { target: { value: 'Banana' } });
        expect(getByRole('combobox')).toHaveValue('Banana');
      });
    });

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        const { getByRole } = render(<SelectWrapper options={options} value={2} onValue={spy} />);
        expect(getByRole('combobox')).toHaveValue('2');
        fireEvent.change(getByRole('combobox'), { target: { value: '3' } });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        const { getByRole } = render(<SelectWrapper options={options} value={2} onValue={spy} />);
        expect(getByRole('combobox')).toHaveValue('2');
        fireEvent.change(getByRole('combobox'), { target: { value: '3' } });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('disabled', () => {
      it('sets the disabled attribute', () => {
        const options = [{ label: 'foo', disabled: true }];
        const { getAllByRole } = render(<SelectWrapper options={options} />);
        expect(getAllByRole('option')[0]).toBeDisabled();
      });
    });

    describe('html', () => {
      it('sets attributes on the element', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        const { getByRole } = render(<SelectWrapper options={options} />);
        expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(getByRole('option')).toHaveAttribute('class', 'class');
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
        const { container } = render(<SelectWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('triggers the onValue callback with the selected value', () => {
        const spy = jest.fn();
        const { getByRole } = render(<SelectWrapper options={options} onValue={spy} />);
        fireEvent.change(getByRole('combobox'), { target: { value: 'Lemon' } });
        expect(spy).toHaveBeenCalledWith({ label: 'Lemon', group: 'Citrus' });
      });

      it('triggers the onChange callback with the selected value', () => {
        const spy = jest.fn((e) => e.persist());
        const { getByRole } = render(<SelectWrapper options={options} onChange={spy} />);
        fireEvent.change(getByRole('combobox'), { target: { value: 'Lemon' } });
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
          target: expect.objectContaining({
            nodeName: 'SELECT',
            value: 'Lemon',
          }),
        }));
      });

      it('updates when the value changes', () => {
        const { getByRole } = render(<SelectWrapper options={options} />);
        fireEvent.change(getByRole('combobox'), { target: { value: 'Lemon' } });
        expect(getByRole('combobox')).toHaveValue('Lemon');
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        const { getByRole } = render(<SelectWrapper options={options} />);
        expect(getByRole('combobox')).not.toHaveAttribute('data-foo', 'bar');
      });
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { getByRole } = render(<SelectWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      fireEvent.change(getByRole('combobox'), { target: { value: 'Orange' } });
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { getByRole } = render(<SelectWrapper
        options={options}
        value={{ name: 'Banana' }}
        mapOption={({ name }) => ({ label: name })}
      />);
      expect(getByRole('combobox')).toHaveValue('Banana');
      fireEvent.change(getByRole('combobox'), { target: { value: 'Orange' } });
      expect(getByRole('combobox')).toHaveValue('Orange');
    });
  });
});

describe('placeholder', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a placeholder option', () => {
    const { getByRole, getAllByRole } = render(<SelectWrapper options={options} placeholder="Please select…" />);
    expect(getAllByRole('option')[0]).toHaveTextContent('Please select…');
    expect(getByRole('combobox')).toHaveValue('');
  });

  it('renders with a selected value', () => {
    const { getByRole } = render(<SelectWrapper options={options} placeholder="Please select…" value="Orange" />);
    expect(getByRole('combobox')).toHaveValue('Orange');
  });
});

describe('renderOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('allows additional props to be added to all options', () => {
    const { getAllByRole } = render(
      <SelectWrapper options={options} renderOption={(props) => <option {...props} data-foo="bar" />} />,
    );
    getAllByRole('option').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
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
    const { container } = render(
      <SelectWrapper options={options} renderOptGroup={(props) => <optgroup {...props} data-foo="bar" />} />,
    );
    container.querySelectorAll('optgroup').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });
});

describe('additional props', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('includes them on the select', () => {
    const { getByRole } = render(
      <SelectWrapper options={options} required data-foo="bar" />,
    );
    expect(getByRole('combobox')).toBeRequired();
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ref', () => {
  it('references the select for an object ref', () => {
    const ref = { current: null };
    const { getByRole } = render((
      <SelectWrapper options={['foo']} ref={ref} />
    ));
    expect(ref.current).toEqual(getByRole('combobox'));
  });

  it('references the combobox for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    const { getByRole } = render((
      <SelectWrapper options={['foo']} ref={ref} />
    ));
    expect(value).toEqual(getByRole('combobox'));
  });
});
