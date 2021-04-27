import React, { useState, forwardRef } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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
      render(
        <SelectWrapper options={options} value="Orange" />,
      );
      expect(screen.getByRole('combobox')).toHaveValue('Orange');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Banana' } });
      expect(spy).toHaveBeenCalledWith('Banana');
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      render(<SelectWrapper options={options} onChange={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Banana' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: 'Banana',
        }),
      }));
    });

    it('updates when the value changes', () => {
      render(<SelectWrapper options={options} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Apple' } });
      expect(screen.getByRole('combobox')).toHaveValue('Apple');
    });

    it('triggers onValue when selecting an empty string', () => {
      const spy = jest.fn();
      render(<SelectWrapper options={['foo', '']} onValue={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
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
      render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
      expect(spy).toHaveBeenCalledWith(2);
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      render(<SelectWrapper options={options} onChange={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: '2',
        }),
      }));
    });

    it('updates when the value changes', () => {
      render(<SelectWrapper options={options} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
      expect(screen.getByRole('combobox')).toHaveValue('1');
    });

    it('triggers onValue when selecting 0', () => {
      const spy = jest.fn();
      render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
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
      render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(null);
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      render(<SelectWrapper options={options} value="foo" onChange={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: '',
        }),
      }));
    });

    it('updates when the value changes', () => {
      render(<SelectWrapper options={options} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
      expect(screen.getByRole('combobox')).toHaveValue('');
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
      render(<SelectWrapper options={options} onValue={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      render(<SelectWrapper options={options} onChange={spy} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          nodeName: 'SELECT',
          value: '',
        }),
      }));
    });

    it('updates when the value changes', () => {
      render(<SelectWrapper options={options} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
      expect(screen.getByRole('combobox')).toHaveValue('');
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
        render(<SelectWrapper options={options} onValue={spy} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Banana' } });
        expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
      });

      it('triggers the onChange callback with the selected value', () => {
        const spy = jest.fn((e) => e.persist());
        render(<SelectWrapper options={options} onChange={spy} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Banana' } });
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
          target: expect.objectContaining({
            nodeName: 'SELECT',
            value: 'Banana',
          }),
        }));
      });

      it('updates when the value changes', () => {
        render(<SelectWrapper options={options} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Banana' } });
        expect(screen.getByRole('combobox')).toHaveValue('Banana');
      });
    });

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        render(<SelectWrapper options={options} value={2} onValue={spy} />);
        expect(screen.getByRole('combobox')).toHaveValue('2');
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        render(<SelectWrapper options={options} value={2} onValue={spy} />);
        expect(screen.getByRole('combobox')).toHaveValue('2');
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('disabled', () => {
      it('sets the disabled attribute', () => {
        const options = [{ label: 'foo', disabled: true }];
        render(<SelectWrapper options={options} />);
        expect(screen.getAllByRole('option')[0]).toBeDisabled();
      });
    });

    describe('html', () => {
      it('sets attributes on the element', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        render(<SelectWrapper options={options} />);
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
        const { container } = render(<SelectWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('triggers the onValue callback with the selected value', () => {
        const spy = jest.fn();
        render(<SelectWrapper options={options} onValue={spy} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Lemon' } });
        expect(spy).toHaveBeenCalledWith({ label: 'Lemon', group: 'Citrus' });
      });

      it('triggers the onChange callback with the selected value', () => {
        const spy = jest.fn((e) => e.persist());
        render(<SelectWrapper options={options} onChange={spy} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Lemon' } });
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
          target: expect.objectContaining({
            nodeName: 'SELECT',
            value: 'Lemon',
          }),
        }));
      });

      it('updates when the value changes', () => {
        render(<SelectWrapper options={options} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Lemon' } });
        expect(screen.getByRole('combobox')).toHaveValue('Lemon');
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        render(<SelectWrapper options={options} />);
        expect(screen.getByRole('combobox')).not.toHaveAttribute('data-foo', 'bar');
      });
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      render(<SelectWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Orange' } });
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      render(<SelectWrapper
        options={options}
        value={{ name: 'Banana' }}
        mapOption={({ name }) => ({ label: name })}
      />);
      expect(screen.getByRole('combobox')).toHaveValue('Banana');
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Orange' } });
      expect(screen.getByRole('combobox')).toHaveValue('Orange');
    });
  });
});

describe('placeholderOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a placeholder option', () => {
    render(<SelectWrapper options={options} placeholderOption="Please select…" />);
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Please select…');
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('renders with a selected value', () => {
    render(<SelectWrapper options={options} placeholderOption="Please select…" value="Orange" />);
    expect(screen.getByRole('combobox')).toHaveValue('Orange');
  });
});

describe('renderOption', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('allows additional props to be added to all options', () => {
    render(
      <SelectWrapper options={options} renderOption={(props) => <option {...props} data-foo="bar" />} />,
    );
    screen.getAllByRole('option').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });

  it('is called with context and props', () => {
    const spy = jest.fn();
    render(
      <SelectWrapper options={options} renderOption={spy} test="foo" />,
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
      <SelectWrapper options={options} renderOptGroup={(props) => <optgroup {...props} data-foo="bar" />} />,
    );
    screen.getAllByRole('group').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });

  it('is called with state and props', () => {
    const spy = jest.fn();
    render(
      <SelectWrapper options={options} renderOptGroup={spy} test="foo" />,
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
      <SelectWrapper options={options} required data-foo="bar" />,
    );
    expect(screen.getByRole('combobox')).toBeRequired();
    expect(screen.getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ref', () => {
  it('references the select for an object ref', () => {
    const ref = { current: null };
    render((
      <SelectWrapper options={['foo']} ref={ref} />
    ));
    expect(ref.current).toEqual(screen.getByRole('combobox'));
  });

  it('references the combobox for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    render((
      <SelectWrapper options={['foo']} ref={ref} />
    ));
    expect(value).toEqual(screen.getByRole('combobox'));
  });
});
