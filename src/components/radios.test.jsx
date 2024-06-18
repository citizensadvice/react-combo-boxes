import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radios } from './radios';

function Test({ value: _value, ...props }) {
  const [value, setValue] = useState(_value);

  return (
    <Radios
      id="id"
      name="name"
      value={value}
      onValue={setValue}
      {...props}
    />
  );
}

describe('options', () => {
  describe('as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders radio group', () => {
      const { container } = render(<Test options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('renders radios with a selected value', () => {
      render(
        <Test
          options={options}
          value="Orange"
        />,
      );
      expect(screen.getByRole('radio', { checked: true })).toEqual(
        screen.getByRole('radio', { name: 'Orange' }),
      );
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.click(screen.getByRole('radio', { name: 'Banana' }));
      expect(spy).toHaveBeenCalledWith('Banana');
    });

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      const option = screen.getByRole('radio', { name: 'Banana' });
      await userEvent.click(option);
      expect(screen.getByRole('radio', { checked: true })).toEqual(option);
    });
  });

  describe('options as array of numbers', () => {
    const options = [0, 1, 2, 3];

    it('renders radio group', () => {
      const { container } = render(<Test options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('renders radios with a selected value', () => {
      render(
        <Test
          options={options}
          value={2}
        />,
      );
      expect(screen.getByRole('radio', { checked: true })).toEqual(
        screen.getByRole('radio', { name: '2' }),
      );
    });

    it('triggers the onValue callback with the selected value', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValue={spy}
        />,
      );
      await userEvent.click(screen.getByRole('radio', { name: '2' }));
      expect(spy).toHaveBeenCalledWith(2);
    });

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      const option = screen.getByRole('radio', { name: '2' });
      await userEvent.click(option);
      expect(screen.getByRole('radio', { checked: true })).toEqual(option);
    });
  });

  describe('options as array of objects', () => {
    describe('label', () => {
      const options = [
        { label: 'Apple' },
        { label: 'Banana' },
        { label: 'Orange' },
      ];

      it('renders radio group', () => {
        const { container } = render(<Test options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('renders radios with a selected value', () => {
        render(
          <Test
            options={options}
            value={{ label: 'Banana' }}
          />,
        );
        expect(screen.getByRole('radio', { checked: true })).toEqual(
          screen.getByRole('radio', { name: 'Banana' }),
        );
      });

      it('triggers the onValue callback with the selected value', async () => {
        const spy = jest.fn();
        render(
          <Test
            options={options}
            onValue={spy}
          />,
        );
        await userEvent.click(screen.getByRole('radio', { name: 'Banana' }));
        expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
      });

      it('updates when the value changes', async () => {
        render(<Test options={options} />);
        const option = screen.getByRole('radio', { name: 'Banana' });
        await userEvent.click(option);
        expect(screen.getByRole('radio', { checked: true })).toEqual(option);
      });
    });

    describe('value', () => {
      it('is used as a options identity', async () => {
        const options = [
          { label: 'foo', value: 1 },
          { label: 'foo', value: 2 },
          { label: 'foo', value: 3 },
        ];
        render(
          <Test
            options={options}
            value={2}
          />,
        );
        expect(screen.getByRole('radio', { checked: true }).value).toEqual('2');
        const radios = screen.getAllByRole('radio');
        await userEvent.click(radios[0]);
        expect(screen.getByRole('radio', { checked: true })).toEqual(radios[0]);
      });
    });

    describe('id', () => {
      it('is used as a options identity', async () => {
        const options = [
          { label: 'foo', id: 1 },
          { label: 'foo', id: 2 },
          { label: 'foo', id: 3 },
        ];
        render(
          <Test
            options={options}
            value={2}
          />,
        );
        expect(screen.getByRole('radio', { checked: true }).value).toEqual('2');
        const radios = screen.getAllByRole('radio');
        await userEvent.click(radios[0]);
        expect(screen.getByRole('radio', { checked: true })).toEqual(radios[0]);
      });
    });

    describe('disabled', () => {
      it('sets the disabled attribute', () => {
        const options = [{ label: 'foo', disabled: true }];
        render(<Test options={options} />);
        expect(screen.getByRole('radio')).toBeDisabled();
      });

      it('will display a disabled radio as checked', () => {
        const options = [{ label: 'foo', disabled: true }];
        render(
          <Test
            options={options}
            value="foo"
          />,
        );
        expect(screen.getByRole('radio')).toBeChecked();
      });
    });

    describe('description', () => {
      it('sets the description', () => {
        const options = [{ label: 'foo', description: 'foo bar' }];
        render(<Test options={options} />);
        expect(screen.getByRole('radio')).toHaveAccessibleDescription(
          'foo bar',
        );
      });
    });

    describe('hint', () => {
      it('is used as a fallback for description', () => {
        const options = [{ label: 'foo', hint: 'foo bar' }];
        render(<Test options={options} />);
        expect(screen.getByRole('radio')).toHaveAccessibleDescription(
          'foo bar',
        );
      });

      it('is not used if description is present', () => {
        const options = [
          { label: 'foo', description: 'fizz buzz', hint: 'foo bar' },
        ];
        render(<Test options={options} />);
        expect(screen.getByRole('radio')).toHaveAccessibleDescription(
          'fizz buzz',
        );
      });
    });

    describe('html', () => {
      it('sets attributes on the radio', () => {
        const options = [
          { label: 'foo', html: { 'data-foo': 'bar', className: 'class' } },
        ];
        render(<Test options={options} />);
        expect(screen.getByRole('radio')).toHaveAttribute('data-foo', 'bar');
        expect(screen.getByRole('radio')).toHaveClass('class');
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

      it('selects an option', async () => {
        render(<Test options={options} />);
        const option = screen.getByRole('radio', { name: 'Citrus Lemon' });
        await userEvent.click(option);
        expect(screen.getByRole('radio', { checked: true })).toEqual(option);
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        render(<Test options={options} />);
        expect(screen.getByRole('radio')).not.toHaveAttribute(
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
        render(
          <Test
            options={options}
            mapOption={({ name }) => ({ label: name })}
          />,
        );
        const option = screen.getByRole('radio', { name: 'Banana' });
        await userEvent.click(option);
        expect(screen.getByRole('radio', { checked: true })).toEqual(option);
      });

      it('accepts value as a primitive', () => {
        render(
          <Test
            options={options}
            value="Banana"
            mapOption={({ name }) => ({ label: name })}
          />,
        );
        expect(
          screen.getByRole('radio', { name: 'Banana', checked: true }),
        ).toBeInTheDocument();
      });
    });

    describe('mapOption returns a string', () => {
      const options = [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' },
      ];

      it('maps options', async () => {
        render(
          <Test
            options={options}
            mapOption={({ name }) => name}
          />,
        );
        const option = screen.getByRole('radio', { name: 'Banana' });
        await userEvent.click(option);
        expect(screen.getByRole('radio', { checked: true })).toEqual(option);
      });

      it('accepts value as a primitive', () => {
        render(
          <Test
            options={options}
            value="Banana"
            mapOption={({ name }) => name}
          />,
        );
        expect(
          screen.getByRole('radio', { name: 'Banana', checked: true }),
        ).toBeInTheDocument();
      });
    });
  });
});

describe('required', () => {
  it('sets required', () => {
    const options = ['Apple'];
    render(
      <Test
        options={options}
        required
      />,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeRequired();
  });
});

describe('name', () => {
  it('sets the name', () => {
    const options = ['Apple'];
    render(
      <Test
        options={options}
        name="foo"
      />,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveProperty('name', 'foo');
  });
});

describe('onChange', () => {
  it('is called if a radio changes checked state', async () => {
    const options = ['Apple', 'Banana'];
    const onChange = jest.fn();
    render(
      <Test
        options={options}
        onChange={onChange}
        onValue={null}
      />,
    );
    const radio = screen.getByRole('radio', { name: 'Banana' });
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: radio,
      }),
    );
  });
});

describe('placeholderOption', () => {
  it('does not create an option', () => {
    const options = ['Apple', 'Banana'];
    render(
      <Test
        options={options}
        placeholderOption="Foo"
      />,
    );
    expect(
      screen.queryByRole('radio', { name: 'Foo' }),
    ).not.toBeInTheDocument();
  });
});

describe('classPrefix', () => {
  it('when null removes the class', () => {
    const options = ['Apple'];
    render(
      <Test
        options={options}
        classPrefix={null}
      />,
    );
    const radio = screen.getByRole('radio');
    expect(radio).not.toHaveClass();
  });

  it('sets the class', () => {
    const options = ['Apple'];
    render(
      <Test
        options={options}
        classPrefix="bar"
      />,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('bar__input');
  });
});

describe('renderWrapper', () => {
  it('customises the wrapper', () => {
    const spy = jest.fn(({ key, ...props }) => (
      <div
        key={key}
        data-foo="bar"
        {...props}
      />
    ));
    render(
      <Test
        options={['Apple']}
        renderWrapper={spy}
        test="foo"
      />,
    );

    expect(screen.getByRole('radio').parentNode).toHaveAttribute(
      'data-foo',
      'bar',
    );
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        option: expect.objectContaining({ label: 'Apple' }),
        group: undefined,
        checked: false,
      },
      expect.objectContaining({
        options: expect.any(Array),
        test: 'foo',
      }),
    );
  });
});

describe('renderInput', () => {
  it('customises the input', () => {
    const spy = jest.fn((props) => (
      <input
        data-foo="bar"
        {...props}
      />
    ));
    render(
      <Test
        options={['Apple']}
        renderInput={spy}
        test="foo"
      />,
    );

    expect(screen.getByRole('radio')).toHaveAttribute('data-foo', 'bar');
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        option: expect.objectContaining({ label: 'Apple' }),
        group: undefined,
        checked: false,
      },
      expect.objectContaining({
        options: expect.any(Array),
        test: 'foo',
      }),
    );
  });
});

describe('renderLabel', () => {
  it('customises the label', () => {
    const spy = jest.fn((props) => (
      <label
        data-foo="bar"
        {...props}
      />
    ));
    render(
      <Test
        options={['Apple']}
        renderLabel={spy}
        test="foo"
      />,
    );

    expect(document.querySelector('label')).toHaveAttribute('data-foo', 'bar');
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        option: expect.objectContaining({ label: 'Apple' }),
        group: undefined,
        checked: false,
      },
      expect.objectContaining({
        options: expect.any(Array),
        test: 'foo',
      }),
    );
  });
});

describe('renderDescription', () => {
  it('customises the description', () => {
    const spy = jest.fn((props) => (
      <div
        data-foo="bar"
        {...props}
      />
    ));
    render(
      <Test
        options={[{ label: 'Apple', description: 'fizz' }]}
        renderDescription={spy}
        test="foo"
      />,
    );

    const radio = screen.getByRole('radio');
    expect(
      document.getElementById(radio.getAttribute('aria-describedby')),
    ).toHaveAttribute('data-foo', 'bar');
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        option: expect.objectContaining({ label: 'Apple' }),
        group: undefined,
        checked: false,
      },
      expect.objectContaining({
        options: expect.any(Array),
        test: 'foo',
      }),
    );
  });
});

describe('renderGroup', () => {
  it('customises the group', () => {
    const spy = jest.fn(({ key, ...props }) => (
      <div
        key={key}
        data-foo="bar"
        {...props}
      />
    ));
    render(
      <Test
        options={[{ label: 'Apple', group: 'fizz' }]}
        renderGroup={spy}
        test="foo"
      />,
    );

    const radio = screen.getByRole('radio');
    expect(radio.parentNode.parentNode).toHaveAttribute('data-foo', 'bar');
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        group: expect.objectContaining({ label: 'fizz' }),
      },
      expect.objectContaining({
        options: expect.any(Array),
        test: 'foo',
      }),
    );
  });
});

describe('renderGroupLabel', () => {
  it('customises the group label', () => {
    const spy = jest.fn((props) => (
      <div
        data-foo="bar"
        {...props}
      />
    ));
    render(
      <Test
        options={[{ label: 'Apple', group: 'fizz' }]}
        renderGroupLabel={spy}
        test="foo"
      />,
    );

    const radio = screen.getByRole('radio');
    expect(radio.parentNode.parentNode.firstElementChild).toHaveAttribute(
      'data-foo',
      'bar',
    );
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        group: expect.objectContaining({ label: 'fizz' }),
      },
      expect.objectContaining({
        options: expect.any(Array),
        test: 'foo',
      }),
    );
  });
});

describe('renderGroupAccessibleLabel', () => {
  it('customises the group accessible label', () => {
    const spy = jest.fn((props) => (
      <div
        data-foo="bar"
        {...props}
      />
    ));
    render(
      <Test
        options={[{ label: 'Apple', group: 'fizz' }]}
        renderGroupAccessibleLabel={spy}
        test="foo"
      />,
    );

    expect(document.querySelector('label').firstElementChild).toHaveAttribute(
      'data-foo',
      'bar',
    );
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        group: expect.objectContaining({ label: 'fizz' }),
      },
      expect.objectContaining({
        options: expect.any(Array),
        test: 'foo',
      }),
    );
  });
});
