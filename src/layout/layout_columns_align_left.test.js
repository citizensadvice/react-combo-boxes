import { layoutColumnsAlignLeft } from './layout_columns_align_left';

describe('when natural table width is the auto table width', () => {
  it('does not set column widths', () => {
    const html = `
      <table>
        <col>
        <col>
        <tbody>
          <tr>
            <td>one</td>
            <td>two</td>
          </tr>
        </tbody>
      </table>
    `;

    const listbox = document.createElement('div');
    listbox.innerHTML = html;
    document.body.appendChild(listbox);

    const table = listbox.querySelector('table');

    jest
      .spyOn(table, 'clientWidth', 'get')
      .mockImplementationOnce(() => 100)
      .mockImplementationOnce(() => 100);

    layoutColumnsAlignLeft({ listbox });

    table.querySelectorAll('col').forEach((col) => {
      expect(col).toHaveStyle({ width: '' });
    });

    expect(table).toHaveStyle({ width: '' });
  });
});

describe('when natural table width not less then the auto table width', () => {
  it('sets column widths', () => {
    const html = `
      <table>
        <col>
        <col>
        <tbody>
          <tr>
            <td>one</td>
            <td>two</td>
          </tr>
        </tbody>
      </table>
    `;

    const listbox = document.createElement('div');
    listbox.innerHTML = html;
    document.body.appendChild(listbox);

    const table = listbox.querySelector('table');

    jest
      .spyOn(table, 'clientWidth', 'get')
      .mockImplementationOnce(() => 100)
      .mockImplementationOnce(() => 90);

    table.querySelectorAll('td').forEach((td) => {
      jest
        .spyOn(td, 'getBoundingClientRect')
        .mockImplementation(() => ({ width: 20 }));
    });

    layoutColumnsAlignLeft({ listbox });

    expect(table.querySelector('col:first-child')).toHaveStyle({
      width: '20px',
    });

    expect(table.querySelector('col:last-child')).toHaveStyle({
      width: '',
    });

    expect(table).toHaveStyle({ 'min-width': '', width: '' });
  });

  it('ignores rows with colspan cells', () => {
    const html = `
      <table>
        <col>
        <col>
        <tbody>
          <tr>
            <td colspan="2">group</td>
          </tr>
          <tr>
            <td>one</td>
            <td>two</td>
          </tr>
        </tbody>
      </table>
    `;

    const listbox = document.createElement('div');
    listbox.innerHTML = html;
    document.body.appendChild(listbox);

    const table = listbox.querySelector('table');

    jest
      .spyOn(table, 'clientWidth', 'get')
      .mockImplementationOnce(() => 100)
      .mockImplementationOnce(() => 90);

    table.querySelectorAll('tr:nth-child(2) td').forEach((td) => {
      jest
        .spyOn(td, 'getBoundingClientRect')
        .mockImplementation(() => ({ width: 20 }));
    });

    layoutColumnsAlignLeft({ listbox });

    expect(table.querySelector('col:first-child')).toHaveStyle({
      width: '20px',
    });

    expect(table.querySelector('col:last-child')).toHaveStyle({
      width: '',
    });

    expect(table).toHaveStyle({ 'min-width': '', width: '' });
  });

  it('does not set column widths if there are no applicable rows', () => {
    const html = `
      <table>
        <col>
        <col>
        <tbody>
          <tr>
            <td colspan="2">group</td>
          </tr>
        </tbody>
      </table>
    `;

    const listbox = document.createElement('div');
    listbox.innerHTML = html;
    document.body.appendChild(listbox);

    const table = listbox.querySelector('table');

    layoutColumnsAlignLeft({ listbox });

    table.querySelectorAll('col').forEach((col) => {
      expect(col).toHaveStyle({ width: '' });
    });

    expect(table).toHaveStyle({ width: '' });
  });

  it('does not set column widths if there are no applicable cells', () => {
    const html = `
      <table>
        <col>
        <col>
        <tbody>
          <tr>
          </tr>
        </tbody>
      </table>
    `;

    const listbox = document.createElement('div');
    listbox.innerHTML = html;
    document.body.appendChild(listbox);

    const table = listbox.querySelector('table');

    layoutColumnsAlignLeft({ listbox });

    table.querySelectorAll('col').forEach((col) => {
      expect(col).toHaveStyle({ width: '' });
    });

    expect(table).toHaveStyle({ width: '' });
  });
});
