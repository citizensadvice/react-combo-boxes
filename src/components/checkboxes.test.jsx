import { useState, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkboxes } from './checkboxes';

function Test({ values: _values, ...props }) {
  const [values, setValues] = useState(_values);

  return (
    <Checkboxes
      id="id"
      values={values}
      onValues={setValues}
      {...props}
    />
  );
}

describe('options', () => {
  describe('as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders checkbox group', () => {
      const { container } = render(<Test options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('renders checkboxes with selected values', () => {
      render(
        <Test
          options={options}
          values={['Apple', 'Orange']}
        />,
      );
      expect(screen.getAllByRole('checkbox', { checked: true })).toEqual([
        screen.getByRole('checkbox', { name: 'Apple' }),
        screen.getByRole('checkbox', { name: 'Orange' }),
      ]);
    });

    it('triggers the onValues callback', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValues={spy}
          values={['Apple']}
        />,
      );
      await userEvent.click(screen.getByRole('checkbox', { name: 'Banana' }));
      expect(spy).toHaveBeenCalledWith(['Apple', 'Banana']);
    });

    it('triggers the onValues callback when values are removed', async () => {
      const spy = jest.fn();
      render(
        <Test
          options={options}
          onValues={spy}
          values={['Banana']}
        />,
      );
      await userEvent.click(screen.getByRole('checkbox', { name: 'Banana' }));
      expect(spy).toHaveBeenCalledWith([]);
    });

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      await userEvent.click(screen.getByRole('checkbox', { name: 'Banana' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Apple' }));
      expect(screen.getAllByRole('checkbox', { checked: true })).toEqual([
        screen.getByRole('checkbox', { name: 'Apple' }),
        screen.getByRole('checkbox', { name: 'Banana' }),
      ]);
    });
  });

  describe('options as array of numbers', () => {
    const options = [0, 1, 2, 3];

    it('updates when the value changes', async () => {
      render(<Test options={options} />);
      await userEvent.click(screen.getByRole('checkbox', { name: '1' }));
      await userEvent.click(screen.getByRole('checkbox', { name: '2' }));
      expect(screen.getAllByRole('checkbox', { checked: true })).toEqual([
        screen.getByRole('checkbox', { name: '1' }),
        screen.getByRole('checkbox', { name: '2' }),
      ]);
    });
  });

  describe('options as array of objects', () => {
    describe('label', () => {
      const options = [
        { label: 'Apple' },
        { label: 'Banana' },
        { label: 'Orange' },
      ];

      it('updates when the value changes', async () => {
        render(<Test options={options} />);
        await userEvent.click(screen.getByRole('checkbox', { name: 'Banana' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Orange' }));
        expect(screen.getAllByRole('checkbox', { checked: true })).toEqual([
          screen.getByRole('checkbox', { name: 'Banana' }),
          screen.getByRole('checkbox', { name: 'Orange' }),
        ]);
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
            values={[2]}
          />,
        );
        expect(screen.getByRole('checkbox', { checked: true }).value).toEqual(
          '2',
        );
        const checkboxes = screen.getAllByRole('checkbox');
        await userEvent.click(checkboxes[0]);
        expect(screen.getAllByRole('checkbox', { checked: true })).toEqual([
          checkboxes[0],
          checkboxes[1],
        ]);
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
            values={[2]}
          />,
        );
        expect(screen.getByRole('checkbox', { checked: true }).value).toEqual(
          '2',
        );
        const checkboxes = screen.getAllByRole('checkbox');
        await userEvent.click(checkboxes[0]);
        expect(screen.getAllByRole('checkbox', { checked: true })).toEqual([
          checkboxes[0],
          checkboxes[1],
        ]);
      });
    });

    describe('disabled', () => {
      it('sets the disabled attribute', () => {
        const options = [{ label: 'foo', disabled: true }];
        render(<Test options={options} />);
        expect(screen.getByRole('checkbox')).toBeDisabled();
      });

      it('will display a disabled checkboz as checked', () => {
        const options = [{ label: 'foo', disabled: true }];
        render(
          <Test
            options={options}
            values={['foo']}
          />,
        );
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
    });

    describe('description', () => {
      it('sets the description', () => {
        const options = [{ label: 'foo', description: 'foo bar' }];
        render(<Test options={options} />);
        expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
          'foo bar',
        );
      });
    });

    describe('hint', () => {
      it('is used as a fallback for description', () => {
        const options = [{ label: 'foo', hint: 'foo bar' }];
        render(<Test options={options} />);
        expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
          'foo bar',
        );
      });

      it('is not used if description is present', () => {
        const options = [
          { label: 'foo', description: 'fizz buzz', hint: 'foo bar' },
        ];
        render(<Test options={options} />);
        expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
          'fizz buzz',
        );
      });
    });

    describe('html', () => {
      it('sets attributes on the checkbox', () => {
        const options = [
          { label: 'foo', html: { 'data-foo': 'bar', className: 'class' } },
        ];
        render(<Test options={options} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('data-foo', 'bar');
        expect(screen.getByRole('checkbox')).toHaveClass('class');
      });

      describe('ref', () => {
        it('will use a callback ref', () => {
          const ref = jest.fn();
          const options = [{ label: 'foo', html: { ref } }];
          render(<Test options={options} />);
          expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
        });

        it('will use an object ref', () => {
          const ref = createRef();
          const options = [{ label: 'foo', html: { ref } }];
          render(<Test options={options} />);
          expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });
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
        const option = screen.getByRole('checkbox', { name: 'Citrus Lemon' });
        await userEvent.click(option);
        expect(screen.getByRole('checkbox', { checked: true })).toEqual(option);
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        render(<Test options={options} />);
        expect(screen.getByRole('checkbox')).not.toHaveAttribute(
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
        const option = screen.getByRole('checkbox', { name: 'Banana' });
        await userEvent.click(option);
        expect(screen.getByRole('checkbox', { checked: true })).toEqual(option);
      });

      it('accepts value as a primitive', () => {
        render(
          <Test
            options={options}
            values={['Banana']}
            mapOption={({ name }) => ({ label: name })}
          />,
        );
        expect(
          screen.getByRole('checkbox', { name: 'Banana', checked: true }),
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
        const option = screen.getByRole('checkbox', { name: 'Banana' });
        await userEvent.click(option);
        expect(screen.getByRole('checkbox', { checked: true })).toEqual(option);
      });

      it('accepts value as a primitive', () => {
        render(
          <Test
            options={options}
            values={['Banana']}
            mapOption={({ name }) => name}
          />,
        );
        expect(
          screen.getByRole('checkbox', { name: 'Banana', checked: true }),
        ).toBeInTheDocument();
      });
    });
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
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveProperty('name', 'foo');
  });
});

describe('onChange', () => {
  it('is called if a checkbox changes checked state', async () => {
    const options = ['Apple', 'Banana'];
    const onChange = jest.fn();
    render(
      <Test
        options={options}
        onChange={onChange}
        onValue={null}
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Banana' });
    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: checkbox,
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
      screen.queryByRole('checkbox', { name: 'Foo' }),
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
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toHaveClass();
  });

  it('sets the class', () => {
    const options = ['Apple'];
    render(
      <Test
        options={options}
        classPrefix="bar"
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('bar__input');
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

    expect(screen.getByRole('checkbox').parentNode).toHaveAttribute(
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

    expect(screen.getByRole('checkbox')).toHaveAttribute('data-foo', 'bar');
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

    const checkbox = screen.getByRole('checkbox');
    expect(
      document.getElementById(checkbox.getAttribute('aria-describedby')),
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

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.parentNode.parentNode).toHaveAttribute('data-foo', 'bar');
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

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.parentNode.parentNode.firstElementChild).toHaveAttribute(
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
