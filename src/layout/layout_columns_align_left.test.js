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

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const table = container.querySelector('table');

    jest.spyOn(table, 'clientWidth', 'get')
      .mockImplementationOnce(() => 100)
      .mockImplementationOnce(() => 100);

    layoutColumnsAlignLeft(container);

    table.querySelectorAll('col').forEach((col) => {
      expect(col).toHaveStyle({ 'min-width': '', width: '' });
    });

    expect(table).toHaveStyle({ 'min-width': '', width: '' });
  });
});

describe('when natural table width is less then the auto table width', () => {
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

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const table = container.querySelector('table');

    jest.spyOn(table, 'clientWidth', 'get')
      .mockImplementationOnce(() => 100)
      .mockImplementationOnce(() => 90);

    table.querySelectorAll('col').forEach((col) => {
      jest.spyOn(col, 'getBoundingClientRect').mockImplementation(() => ({ width: 20 }));
    });

    layoutColumnsAlignLeft(container);

    expect(table.querySelector('col:first-child')).toHaveStyle({
      'min-width': '20px',
      width: '',
    });

    expect(table.querySelector('col:last-child')).toHaveStyle({
      'min-width': '',
      width: '100%',
    });

    expect(table).toHaveStyle({ 'min-width': '', width: '' });
  });
});
