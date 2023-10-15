import { useState } from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ComboBox } from '../components/combo_box';
import { DropDown } from '../components/drop_down';
import { useTokenSearch } from '../hooks/use_token_search';
import { selectComboBoxOption } from './select_combo_box_option';

const values = ['foo', 'bar', 'foe', 'fee'];

function ComboBoxWrapper({ id = 'id', value: _value = null, ...props }) {
  const [value, onValue] = useState(_value);
  const [search, setSearch] = useState(null);
  const options = useTokenSearch(search, { options: values });

  return (
    <>
      <label
        htmlFor={id}
        id={`${id}_label`}
      >
        Label
      </label>
      <ComboBox
        id={id}
        aria-labelledby={`${id}_label`}
        value={value}
        onValue={onValue}
        onSearch={setSearch}
        options={options}
        {...props}
      />
      <label htmlFor={`output-${id}`}>Output</label>
      <output
        id={`output-${id}`}
      >
        {value}
      </output>
    </>
  );
}

function DropDownWrapper() {
  const [value, onValue] = useState(null);

  return (
    <>
      <div
        id="drop-down-label"
      >
        Label
      </div>
      <DropDown
        aria-labelledby="drop-down-label"
        id="id"
        value={value}
        onValue={onValue}
        options={values}
      />
      <label htmlFor="output">Output</label>
      <output
        id="output"
      >
        {value}
      </output>
    </>
  );
}

describe('selecting a value from a combo box', () => {
  it('selects a value', async () => {
    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: 'Label', searchFor: 'fo', select: 'foe', userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });

  it('selects a regular expression from', async () => {
    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: /Labe/, searchFor: 'fo', select: 'foe', userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });

  it('selects an object from', async () => {
    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: { name: 'Label' }, searchFor: 'fo', select: 'foe', userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });

  it('selects using a regular expression select', async () => {
    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: 'Label', searchFor: 'fo', select: /foe/, userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });

  it('selects an object select', async () => {
    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: 'Label', searchFor: 'fo', select: { name: 'foe' }, userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });

  it('selects without searching', async () => {
    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: 'Label', select: 'foe', userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });

  it('selects with an empty search', async () => {
    render(<ComboBoxWrapper value="fee" options={values} />);
    await selectComboBoxOption({ from: 'Label', searchFor: '', select: 'foe', userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });

  it('selects from a specific container', async () => {
    render((
      <>
        <div id="foo">
          <ComboBoxWrapper id="foo-combo-box" />
        </div>
        <div id="bar">
          <ComboBoxWrapper id="bar-combo-box" />
        </div>
      </>
    ));
    // eslint-disable-next-line testing-library/no-node-access
    await selectComboBoxOption({ from: 'Label', select: 'foe', container: document.getElementById('bar'), userEvent });
    expect(screen.getAllByLabelText('Output')[1]).toHaveValue('foe');
  });
});

describe('clearing a combo box', () => {
  it('await userEvent can clear a combo-box', async () => {
    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: 'Label', select: 'foe', userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
    await userEvent.clear(screen.getByRole('combobox', { name: 'Label' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Output')).toHaveValue('');
    });
  });
});

describe('selecting a value from a drop down', () => {
  it('selects a value', async () => {
    render(<DropDownWrapper />);
    await selectComboBoxOption({ from: /Label/, select: 'foe', userEvent });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });
});

describe('with a customised userEvent', () => {
  it('uses the supplied userEvent', async () => {
    // Using the wrong user event will cause a timeout
    jest.useFakeTimers();
    const user = await userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ComboBoxWrapper />);
    await selectComboBoxOption({ from: 'Label', searchFor: 'fo', select: 'foe', userEvent: user });
    expect(screen.getByLabelText('Output')).toHaveValue('foe');
  });
});
